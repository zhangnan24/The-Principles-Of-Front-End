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

所谓纯函数，说白了就是一种 I/O 模型，输入数据、输出 UI。这就是纯函数的特点：计算。除了 I/O 之外，函数内部与外部发生的任何交互都算副作用，比如打印个日志、开启一个定时器，发一个请求，读取全局变量等等等等。

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

useEffect 的执行机制，是在初次渲染时，执行到 useEffect 就将内部的 effectFn 放到两个地方：一个是 hooks 链表中，另外一个则是 EffectList 队列中。在渲染完成后，会依次执行 EffectList 里面的 effectFn 集合。

所以，说白了，要不要 re-render，完全取决于链表里面的东西有没有变化。

```!
另外我们很容易发现：我们并不需要把 useState 返回的第二个 Setter 函数作为 Effect 的依赖。实际上，React 内部已经对 Setter 函数做了 Memoization 处理，因此每次渲染拿到的 Setter 函数都是完全一样的，不需要把这个Setter函数放到deps数组里面。
```

## 用法

useEffect 的用法，无非是为了模拟三个生命周期：`componentDidMount`、`shouldComponentUpdate`、`componentWillUnmount`，相当于三个生命周期合并为一个 api。

当我开始深入理解 hooks 的原理之后，我才明白为什么一线大厂如此偏爱于 react，因为这种简洁的思想，带来的就是如诗般优雅的代码。

不同于 vue 离里面有`async mounted`，在 useEffect 里面的 effectFn，应该始终坚持一个原则：要么不返回，要么返回一个 cleanUp 清除函数。像下面这样写是不行的：

```js
// 错误的用法❌
useEffect(async () => {
  const response = await fetch("...");
  // ...
});
```

所谓`shouldComponentUpdate`，我们可以这样使用：

```js
useEffect(() => {
  // xxx
});
```

这个副作用的 effectFn 会在首次渲染之后和每次重渲染之后执行，相当于模拟了 shouldComponentUpdate 这一生命周期。

所谓`componentDidMount`，则是这样：

```js
useEffect(() => {
  // xxx
}, []);
```

因为当有 desp 数组时，里面 effectFn 是否执行取决于 deps 数组内的数据是否变化，而传入空数组

所谓`componentWillUnmount`，则是这样：

```js
useEffect(() => {
  // 执行副作用
  // ...
  return () => {
    // 清除上面的副作用
    // ...
  };
}, []);
```

此外我们应该始终遵循一个原则：那就是*不要对 deps 依赖撒谎*，否则会引发一系列 bug。当然编辑器的 linter 也不会允许我们这样做，这一点非常关键。
