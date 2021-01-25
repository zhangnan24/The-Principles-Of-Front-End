# 开始

貌似从 4.0.0 以后，就不支持全局安装 create-react-app 了。

```powershell
npx create-react-app [项目名] --template typescript
```

# 关于 typescript 的配置

可能会遇到类似“无法使用 JSX，除非提供了 “--jsx“ 标志”的问题，这是由于react17以后给tsx解析增加了新特性，但是需要typescript4.1后的版本支持，所以升级一下ts版本就可以了，同时需要把vscode工作区的ts版本也改为最新的，这样最终会改到`.vscode/settings.json`这个文件里面。

# React 路由配置

react 中的路由，基本上是基于`react-router-dom`这个包来做的。

在 react 中，有不少的路由包，如下：

- react-router：路由基础库，只包含核心功能，不适用生产
- react-router-dom：基于 react-router 的，适用于浏览器环境的二次封装，即包含核心功能，又包含浏览器定制功能，好！
- react-router-native：基于 react-router 的，适用于 react-native 环境的二次封装，因为我们不搞 react-native，所以这个用不着。
- react-router-config：静态路由配置助手，一个新东西，旨在将路由变得像 vue-router 一样配置化。

综上，`react-router-dom`看起来是我们目前项目的最佳选择。

在 react-router-dom 里面，核心的思想是这样的：我们有两个角色，`router`和`route`，react-router 需要工作起来，需要组件树的顶层放一个 Router 组件，在组件树里面可以散落很多的 route 组件，router 负责监听并分析 url 的变化，route 则读取 url 变化信息，并做相关组件的匹配渲染。

也就是说，router 是顶层提供者，route 是信息消费者。

## router 选用

对于浏览器项目我们通常选用`BrowserRouter`或者`HashRouter`组件来实现 Router。前者会刷新页面，后者不会刷新页面，但是 url 中会多一个`#`。

## route 介绍

Route 就是一个普通的 react 组件，路由匹配成功则原地渲染该组件。它主要有以下三个属性：

- path：路由的匹配规则路径
- exact：用于精确匹配路由
- component：需要渲染的组件

## 怎么跳转页面

跳转页面主要有两种形式，一种是特定组件<Link />，类似于 vue 中的<router-link />组件。

第二种则是更为灵活的通过方法去跳转，或者叫“编程式导航”，要使用编程式导航，则需要用到 history 对象。

万幸，`react-router-dom`提供了一个`useHistory`的钩子，执行后即可得到一个 history 对象。

最简单的用法如下：

```tsx
const Home = () => {
  const history = useHistory();

  function toDetail() {
    history.push("/detail");
  }

  return (
    <>
      <h1>Home</h1>
      <button onClick={toDetail}>跳转到详情</button>
    </>
  );
};
```

这个 history 对象提供了`go`、`goBack`、`goForward`、`push`这几个常用方法。

## 跳转后怎么传参收参

跳转的传参在这里一般有两种：动态路由、queryString。

### 动态路由

动态路由没什么好说的，就是在定义路由的时候，定义路由的 path 部分写法如下：

```ts
path: "/detail/:id";
```

然后跳转方式如下：

```ts
const history = useHistory();
const ID = "xxoo";
history.push(`/detail/${ID}`);
```

在 detail 页面就可以这样接收：

```ts
const params = useParams();
console.log(params); // { id: 'xxoo' }
```

### queryString

queryString 则用起来会有点麻烦，主要是取值有点麻烦。

定义一个正常的路由：

```ts
path: "/detail";
```

跳转方式如下：

```ts
const history = useHistory();
const ID = "xxoo";
history.push(`/detail?userID=${ID}`);
```

在 detail 页面就可以这样接收：

```ts
const location = useLocation();
const queryID = new URLSearchParams(location.search).get("userID");
console.log(queryID); // 'xxoo'
```

### 总结

跳转，接收参数一般只用到这三个 hook，均来自于"react-router-dom"。

```ts
import { useHistory, useParams, useLocation } from "react-router-dom";
```

## Swith 组件实现 404

# .d.ts 文件有什么用
