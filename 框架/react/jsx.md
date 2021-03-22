## index.js 解析

```js
import React from "react"; // 引入React是为了能支持我们写jsx
import ReactDOM from "react-dom"; // 引入ReactDOM是为了使用里面的render方法，将React组件渲染到真实DOM中

function App() {
  return <div>hello world</div>;
}

// render函数接收两个参数，第一个是要渲染的react函数，第二个是要挂载渲染的目标DOM节点
ReactDOM.render(<App />, document.getElementById("root"));
```

对于上面的函数组件 App，有必要说一说，`<div>hello world</div>`是一段 jsx 代码，它会被 babel 转化成`React.createElement("div", null, "hello world")`。没错，babel 除了转 es6 为 es5，也可以转 jsx 代码。

所以 jsx 的本质就是`React.createElement`函数，这个函数依次接收三个参数：标签名、传入的属性对象、标签里的内容。

这个`createElement`函数会返回一个类似下面的对象，被叫做`ReactElement`，也就是**React 元素**。

```js
{
    type: 'div',
    props: {
        children: 'hello world'
    }
}
```

害，其实就是 vnode 对象，它首次渲染时将调用 patch，然后渲染到页面上。

## jsx 的特点

jsx 的特点说来也简单，我们可以总结以下三点：

- js 内容要用`{}`包起来
- 组件名要以大写字母开头，如`App`
- 属性名要写成驼峰式，如`dataIndex`

在 onClick 事件监听方面，应该始终传入一个函数，而不是一个函数的执行结果，如：

```js
function App() {
    const sayHello = () => {
        console.log('hello')
    }

    return (
        // 正确✅
        <Button onClick={sayHello}>问候</Button>

        // 正确✅
        <Button onClick={() => sayHello()}>问候</Button>

        // 错误❌
        <Button onClick={sayHello()}>问候</Button>
    )
}
```

## 关于 props

```js
// 在真实业务中应使用业务id而不是index作为key
[1, 2, 3].map((item, index) => (
  <Todo content="图雀" from="图雀社区" key={index} />
));
```

对于如上这个组件，在组件内部它接收到的 props 会是这样：`{ content: "图雀", from: "图雀社区" }`，这里的 key 属性不会并入到 props 对象中，因为这里 key 的作用是为了更高效地更新虚拟 DOM，并不是提供给这个组件内部使用。

顺带一提，在 react 中处理列表循环基本上都是用 map 方法。

## React 中的插槽

其实 React 并不需要插槽这种概念，因为 React 组件的 props 属性是可以接收`JSX.Element`的，没错，就是这么灵活。
