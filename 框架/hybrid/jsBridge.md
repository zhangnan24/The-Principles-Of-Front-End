# jsbridge 的概念

人们希望有一个中间层，它用来管理原生 native 和 h5 的通信问题，这个中间层就叫做 jsBridge。

严格来说 jsBridge 它并不是一个具体的东西，它只是一种约定的双向通信方式。之所以能建立约定，是因为 native 和 h5 都可以访问同一个 window 对象，这个 window 对象为双方的相互调用提供了可能。

# js 怎么调用 native?

js 调用 native，无非就是两种：**注入、拦截**

- native 往 webview 的 window 对象注入一些原生方法，h5 通过这些注入的方法来实现执行 js 代码，调用 app 原生能力；
- native 啥也不注入，h5 通过一些发送一些比较猎奇的请求，native 拦截这些请求，并做出相应动作。

简单来说，要么就是 native 直接把方法赤裸裸放心交给 h5 去直接调用；要么就保守点：h5 发送特定消息，native 拦截特定消息，并由 native 自身亲力亲为去调用。

## native 注入

对于第一种注入来说，webview 确实实现了这种给原生注入的接口，就比如 Andriod 里面的`addJavascriptInterface`方法，就可以将一些原生的东西注入到 webview 中：

```
当然，这里还涉及到一个知识点，那就是如果不考虑适配安卓4.2以下的机型，可以用@JavascriptInterface来注入。因为addJavascriptInterface在安卓4.2以下存在安全风险。
```

```java
// 安卓端
public class NativeInjectObject {
    public void openCamera(successCbKey, failCbKey) {
        // xxx
    }
}

webview.addJavascriptInterface(new NativeInjectObject(), 'NativeBridge')
```

这样的话，在 h5 这边，就可以这样调用：

```js
window.NativeBridge.openCamera();
```

## native 拦截

首先 native 拦截真的不如注入来的科学，我们姑且看一下拦截的实现思路：

h5 一般通过 iframe.src 方法发送一个 url 请求，当然这个 iframe 会设置`display: none`来避免对用户视觉造成影响，这个请求的协议比较特别，它是一个 h5 和 native 约定的特殊协议，随意命名，比如命名为`mynative`。那么这时候会发送一个类似于`mynative://openCamera?flashlight=off`这样的请求。

native 端如 Java，会通过`shouldOverrideUrlLoading`拦截掉这个请求，如果发现是之前约定的`muynative`协议开头，那么 native 端就可以非常确定地认为现在 h5 是在试图调用原生的方法，这时候就可以解析这个 url 的路径和参数，并调用相关的原生能力。否则，可以认为这只是个普通的 http 或 https 请求罢了，放行即可。

# native 为什么要调用 js？怎么调用?

native 为什么要调用 JS，为了回调。

对于理想情况来讲，我们本来可以传一个回调函数的引用给到原生，让 native 来执行这个回调的时候自动寻址到引用对应的堆当中，执行就完事了。但是实际情况确实，貌似我们没法直接传一个回调函数给原生，只能传个回调函数名，也就是字符串。

这个时候，这个回调机制就会显得有点尴尬 😅，我们只能通过一种不太优雅的方式来使得这个机制运转起来。在 JS 调用 native 方法的时候，通过生成随机数来作为回调的函数名，一边传给原生，一边挂在到 window 对象中，为了避免 window 对象增加大量的供 native 回调的随机属性名（每个调用原生动作都会增加两个属性名），回调函数通常还会在执行完删掉自身，如下：

```js
function openCamera() {
  return new Promise((resolve, reject) => {
    const successCbKey = uuid();
    window[successCbKey] = (res) => {
      // res是操作成功时native执行回调传进来的结果
      resolve(res);
      delete window[successCbKey];
    };

    const failCbKey = uuid();
    window[failCbKey] = (err) => {
      // err是操作失败时native执行回调传回来的错误
      reject(err);
      delete window[failCbKey];
    };

    window.NativeBridge.openCamera(successCbKey, failCbKey);
  });
}
```

在原生端则可以通过`loadUrl`或者`evaluateJavacript`来调用这个回调：

```java
// 安卓端
public class NativeInjectObject {
    public void openCamera(successCbKey, failCbKey) {
        // xxx
        if (success) {
            webview.evaluateJavacript(String.format(successCbKey))
        } else {
            webview.evaluateJavacript(String.format(failCbKey))
        }
    }
}

webview.addJavascriptInterface(new NativeInjectObject(), 'NativeBridge')
```

# js-native-sdk 的封装

实际上，我们已经实现了一个 sdk 的简单封装，它做的事情很简单，那就是：_封装一堆原生的方法，并把每个方法的执行结果处理成 promise 对象返回。_

为什么要处理成 promise 返回？因为易用。我们再理一遍这个流程：

原生端：

```java
public class NativeInjectObject {
    public void openCamera(successCbKey, failCbKey) {
        // 尝试打开摄像头
        if (success) {
            webview.evaluateJavacript(String.format(successCbKey))
        } else {
            webview.evaluateJavacript(String.format(failCbKey))
        }
    }

    public void getLocation(successCbKey, failCbKey) {
        // 尝试获取用户位置
        if (success) {
            webview.evaluateJavacript(String.format(successCbKey))
        } else {
            webview.evaluateJavacript(String.format(failCbKey))
        }
    }
}

webview.addJavascriptInterface(new NativeInjectObject(), 'NativeBridge')
```

webview 中：

```js
window.NativeBridge; // {openCamera: ƒ, getLocation: ƒ}
```

js-native-sdk 中：

```js
// 打开摄像头
function openCamera() {
  return new Promise((resolve, reject) => {
    const successCbKey = uuid();
    window[successCbKey] = (res) => {
      resolve(res);
      delete window[successCbKey];
    };

    const failCbKey = uuid();
    window[failCbKey] = (err) => {
      reject(err);
      delete window[failCbKey];
    };

    window.NativeBridge.openCamera(successCbKey, failCbKey);
  });
}

// 获取位置信息
function getUserLocation() {
  return new Promise((resolve, reject) => {
    const successCbKey = uuid();
    window[successCbKey] = (res) => {
      resolve(res);
      delete window[successCbKey];
    };

    const failCbKey = uuid();
    window[failCbKey] = (err) => {
      reject(err);
      delete window[failCbKey];
    };

    window.NativeBridge.getLocation(successCbKey, failCbKey);
  });
}

export { openCamera, getUserLocation };
```

业务代码中：

```js
<script>
import { openCamera } from 'js-native-sdk'

export default function App() {
    function openDeviceCamera() {
        openCamera()
        .then(res => {
            console.log('打开的摄像头信息为：', res)
        })
        .catch(err => {
            console.warn('打开摄像头失败，错误原因为：', err)
        })
    }

    return (
        <Button onClick={openDeviceCamera}>打开摄像头</Button>
    )
}
</script>
```
