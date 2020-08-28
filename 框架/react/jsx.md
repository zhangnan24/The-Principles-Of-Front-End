# index.js解析

```js
import React from 'react'; // 引入React是为了能支持我们写jsx
import ReactDOM from 'react-dom'; // 引入ReactDOM是为了使用里面的render方法，将React组件渲染到真实DOM中

function App() {
    return <div>hello world</div>
}

// render函数接收两个参数，第一个是要渲染的react函数，第二个是要要挂在渲染的目标DOM节点
ReactDOM.render(<App />, document.getElementById('root')) 
```

对于上面的函数组件App，有必要说一说，`<div>hello world</div>`是一段jsx代码，它会被babel转化成`React.createComponent("div", null, "hello world")`。没错，babel除了转es6为es5，也可以转jsx代码。

所以jsx本质上最后还是调用React内部的createElement函数，这个函数依次接收三个参数：标签名、传入的属性对象、标签里的内容。

这个createElement函数会返回一个类似下面的对象，被叫做`ReactElement`，也就是**React元素**。

```js
{
    type: 'div',
    props: {
        children: 'hello world'
    }
}
```

所以，ReactDOM的render函数的功能就很明确了：**将React元素转化为真实的DOM元素，并渲染到页面上。**

# jsx的特点

jsx的特点说来也简单，我们可以总结以下三点：

- js内容要用`{}`包起来
- 组件名要以大写字母开头，如`App`
- 属性名要写成驼峰式，如`dataIndex`

在onClick事件监听方面，应该始终传入一个函数，而不是一个函数的执行结果，如：

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

# 关于props

```js
[1, 2, 3].map((item, index) => <Todo content="图雀" from="图雀社区" key={index} />)
```

对于如上这个组件，在组件内部它接收到的props会是这样：`{ content: "图雀", from: "图雀社区" }`，这里的key属性不会并入到props对象中，因为这里key的作用是为了更高效地更新虚拟DOM，并不是提供给这个组件内部使用。

顺带一提，在react中处理列表循环基本上都是用map方法。


