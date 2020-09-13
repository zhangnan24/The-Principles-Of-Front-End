# 请求工具 axios 的封装

## 为什么要进行 axios 封装

axios 是一个我们在项目中最经常用的一个请求插件，关于 axios 的封装，在实际项目中封装了一次之后，我感觉自己总算有点发言权了，毕竟确实用起来了。

axios 封装的意义就是说，针对一些公共的配置(如：超时时间、公共请求域名、项目中 header 的统一字段、loading 的管理)，可以做集中处理，这样就不用每个请求都去写一遍，减少重复劳动。

当然，灵活性也是封装必须要考虑的一点，我们常说的封装封装，就是把一些基本不变的东西统一抽离出来，到处使用。但是这个是基本不变，不代表绝对不变。所以好的封装都会留一个出口给使用者做自定义配置，**并且自定义配置的优先级一定是高于封装的默认配置的**。

## axios 配置的优先级

像 axios，对于配置来说，有三种我们能够配置的东西：axios 的默认值，axios 实例的默认值，axios 实例单个请求的 config。优先级为：

_实例的 config > 实例的默认值 > axios 的默认值_

对于实例的 config，我们一般会先定义一个公共实例，它包含一些初始的 config，后续使用的时候，在请求里面也加入更加具体的单个请求的 config，单个请求 config 会 merge 到该实例的初始 config 上，所以如果要排的话，我们可以再这样排一下优先级：

_单次请求的自定义 config > 公共实例的初始 config > 公共实例的默认值 > axios 的默认值_

好了，从实际项目来说，一般就不建议去对 axios 默认值进行修改，这样影响范围太大了。我们把要封装的配置写在某个实例里面会好很多，这样就降低了公共配置的影响范围，使其局限于当前你所创建的这个实例里面。毕竟，一个项目是可以创建多个 axios 实例的。

## 一个好的 axios 封装一般包含哪些内容

我觉得，一个好的 axios 封装，应该至少应该有以下三个特点：

- 对于常见的错误码有统一的处理，如 toast 或者跳转到登陆页等
- 能够自由控制 loading
- 统一设置公共的请求头字段，如 token 等

```！
关于baseUrl写在axios封装代码里面好还是不好，我觉得没有标准答案，毕竟这种东西如果只是当前项目使用而不是作为公共封装插件的话，这么写我个人是觉得无可厚非，因为在这里axios封装的一些处理包括字段是基于当前项目的，不算是完全独立于业务逻辑之外的白莲花。
```

## 我写的 axios 封装示例

```js
import axios from "axios";
import { Toast } from "vant";

// 不同模式下的baseUrl
const baseUrlMap = {
  dev: "xxx1",
  gray: "xxx2",
  prd: "xxx3",
};

const baseUrl = baseUrlMap[process.env.VUE_APP_ENV];

// 常见状态码对应的中文提示
const codeMsg = {
  401: "登录失效",
  403: "无权限访问",
  404: "找不到该资源",
  502: "网关错误",
  504: "网关超时",
};

// 处理响应错误
function handleResponseError(error) {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMsg[response.status] || response.statusText;
    Toast(errorText);
  } else if (!response) {
    Toast("网络错误");
  }
}

// 创建一个实例
const instance = axios.create({
  timeout: 10000,
  baseUrl,
  withCredentials: true,
});

// 请求拦截
instance.interceptors.request.use(
  (config) => {
    if (config.loading) {
      Toast.loading("加载中");
    }

    Object.assign(config.headers, {
      token: sessionStorage["token"],
      "XX-XXX-TIMESTAMP": Date.now(),
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截
instance.interceptors.response.use(
  (res) => {
    Toast.clear();
    return Promise.resolve(res.data);
  },
  (error) => {
    Toast.clear();
    handleResponseError(error);
    return Promise.reject(error);
  }
);

export default instance;
```

## 踩坑小记

axios的0.19.0版本有坑，不支持config自定义字段配置，升级到0.20.0版本后得到解决。
