# useEffect

## 原理

useEffect 的模型十分之简洁，如下：

```js
useEffect(effectFn, deps);
```

effectFn 就是当依赖变化时执行的副作用函数，这里的副作用，并不是一个贬义词，而是一个中性词。

回想一下我们在讨论函数式组件的“纯粹模式”时，我们有一个非常之简单的渲染函数：

```js
UI = render(data);
```

它表达了一种极简的对应关系：data 改变 ==> 会引起对应 html 视图改变。比如：data 由 1 变为 2，html 对应 DOM 节点的 innerText 的 1 会变为 2。

这种就是纯粹作用，data 的改变触发 render 执行，引起它对应的视图改变。这是最基本的作用，也是最安全的作用。除了这种作用，引起的其他变化（比如打印个日志、开启一个定时器，发一个请求等等等等）都属于“副作用”。

好，现在这个 effectFn 可以返回一个清理函数`cleanUp`，用于清除这个副作用。典型的清理函数，如：`clearInterval`、`clearTimeout`，如：

```js
useEffect(() => {
  const timer = setTimeout(() => console.log("over"), 1000);
  return () => clearTimout(timer);
});
```

useEffect 其实是每次渲染完成后都会执行，但是 effectFn 是否执行，就要看依赖有没有变化了。执行 useEffect 的时候，会拿这次渲染的依赖跟上次渲染的对应依赖对比，如果没变化，就不执行 effectFn，如果有变化，才执行 effectFn。

如果连依赖都没有，那 react 就认为每次都有变化，每次运行 useEffect 必运行 effectFn。

useEffect 有典型的三大特点：

- 会在每次渲染完成后才执行，不会阻塞渲染，从而提高性能
- 在每次运行 effectFn 之前，要把前一次运行 effectFn 遗留的 cleanUp 函数执行掉（如果有的话）
- 在组件销毁时，会把最后一次运行 effectFn 遗留的 cleanUp 函数执行掉。

deps 数组里面的各个依赖与上次的依赖是否相同，需要通过`Object.is`来比较，比如：

```js
Object.is(22, 22); // true

Object.is([], []); // false
```

这样就会有一个隐患，当 deps 数组里面的子元素为引用类型的时候，每次对比都会是 false，从而执行 effectFn。因为 Object.is 对比引用类型的时候，比较的是两个指针是否指向堆内存中的同一个地址。

## 用法

useEffect 的用法，无非是为了模拟三个生命周期：`componentDidMount`、`shouldComponentUpdate`、`componentDidUnmount`，相当于三个生命周期合并为一个 api。

当我开始深入理解 hooks 的原理之后，我才明白为什么一线大厂如此偏爱于 react，因为这种简洁的思想，带来的就是如诗般优雅的代码。

不同于 vue 离里面有`async mounted`，在 useEffect 里面的 effectFn，应该始终坚持一个原则：要么不返回，要么返回一个 cleanUp 清除函数。像下面这样写是不行的：

```js
// 错误的用法❌
useEffect(async () => {
  const response = await fetch("...");
  // ...
});
```
