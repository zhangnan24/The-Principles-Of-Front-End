## babel 能做什么事情

在EcmaScript里面，babel能做的事情，就是将 ES6 以上的高版本语法，转化为 ES5 甚至是 ES3 这样的低版本语法。

简单来说：**babel就是一个JS新语法编译器，负责对JS的新语法做降版本处理（ES5、ES3之类）。**

比如：

```js
const sum = (a, b) => a + b;

// babel转化后
var sum = function sum(a, b) {
  return a + b;
};
```

注意：**babel只关注语法，而不关注API。** 比如对于下面这样的一段代码，babel是无能为力的。

```js
['a', 'b'].includes('a')
```

这是因为`a.xxx(b)`这种形式的语法在很久以前就有了，比如说`['a', 'b'].indexOf('a')`老早就有了。只不过`includes`这个API比较新而已。

在老版本的浏览器兼容新的API，就需要用到polyfill。

# 啥是polyfill?

polyfill，就是在一些不支持高版本EcmaScript新潮API的老旧浏览器中，通过老旧的语法，模拟实现新的API。

就比如`includes`这个api，mdn的官方polyfill实现如下：

```js
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(valueToFind, fromIndex) {
        // xxx 一堆实现代码
    }
  });
}
```

大体看一些可以发现，就是用各种老旧语法也定义一个叫`includes`的函数，并且直接挂到`Array.prototype`里面，让其用起来跟ES6的`includes`效果一样。

```!
注意⚠️： polyfill的策略是暴力的，比如检测到Array里面没有includes这个API，就会直接在全局Array的原型链上直接追加这个API；如果没有Promise这个API，就会直接在window对象中追加这个属性。
```

当然，这只是一个API的实现而已，*有没有一个库，它用低版本API实现了很多很多ES6+的新API，而且效果很好呢？*

有，这个库就是`core-js`，一个npm周下载量近千万的神库。

# @babel/polyfill

core-js虽然牛逼，但是它没有用低版本API实现`async/await`函数。

而恰巧另一个库很好的实现了这一功能，这使得无数开发者能够放心地写`async/await`语法，并平稳安全地运行在无数老旧浏览器中，它就是`regenerator`，当然现在已经改良成了`regenerator-runtime`，并在npm中拥有近两千万的周下载量。

而所谓的`@babel/polyfill`，就是把这两个神库合并了一下，简单来说： `@babel/polyfill = core-js + regenerator-runtime`

# @babel/runtime

上面也说了，`core-js`的对于使用者的全局环境会直接进行暴力入侵，假如我们要弄一个第三方的lib库，直接在使用者的全局环境里面定义什么`window.Promise = xxx`，`Array.prototype.includes = xxx`是很不好的，因为作为第三方库，有一个基本的底线就是：*不污染使用者的全局环境。*

这就是`@babel/runtime`的意义所在，当然，要使用它，需要额外安装一个`@babel/plugin-transform-runtime`在开发依赖中，如下：

```powershell
npm install @babel/plugin-transform-runtime -D
npm install @babel/runtime -S
```

配置`babelrc`后，效果如下：

```js
var check = arr.includes("yeah!");
var promise = Promise.resolve();

// 跑完runtime后，上述代码会变成这样：
var check = _includesInstanceProperty(arr).call(arr, "yeah!");
var promise = _Promise.resolve();
```

其实就是给你的代码里面的新潮API换了个名字，比如`Promise`换成`_Promise`。而像`_includesInstanceProperty`，`_Promise`这些方法放在统一打包的模块里面，避免直接往window对象里面追加属性或是暴力魔改原型对象。
