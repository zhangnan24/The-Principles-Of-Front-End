## 概念

缓存一个函数，并将指向这个函数的指针 return 出来，避免每次重渲染的的时候都去不断声明式地创建同样的函数。

如果这个函数在 useEffect 中用到了，并作为一个依赖项存在 deps 数组里面，试想，这样是多么危险的事情！下次重渲染的时候，这个依赖项假如是函数，用`Object.is`去比较，是必然认为变化的。于是会出现：

初次渲染完 --> 运行 useEffect --> effectFn 里面修改了状态 --> 触发重渲染 --> 再次运行 useEffect --> 对比上一次渲染的 deps，存在引用类型则必然不相等 --> 又运行 effectFn --> effectFn 里面修改了状态 --> 触发重渲染 ...陷入无限循环。

所以 useCallback 的作用是啥？就是重渲染时，在对比上一次渲染的 deps 依赖时，假如遇到引用类型，因为用 useCallback 会返回这个函数的引用，两个引用对比是相等的，就不会再次运行 effectFn 了。

注意这里用了 useCallback 后，存储的函数是独立出去函数式组件的每次渲染的。也就是说，每次渲染运行 useCallback 钩子拿到的函数引用都是一样的，都指向堆内存的同一个地址。

## 用法

useCallback 的用法如下：

```js
const memoFn = useCallback(fn, deps);
```

像如果一个纯粹的声明式函数，我们可以这样定义让它只在初次渲染的时候创建一次：

```js
function showUA() {
  console.log(navigator.userAgent);
}

const memoShowUA = useCallback(showUA, []);
```

这里的 memo，就是`memorize`的意思，也就是记忆。这样这个引用就可以放心放入 useEffect 的 deps 依赖数组中了。

所以我们才常常说要十分注意 deps 依赖数组里面的元素，尤其是里面出现引用类型时。

## 原理

关于 useCallback 的运行原理，仍然是初次渲染时被写入到一张 hooks 链表中，然后在重渲染时读取该 hooks 链表，这个过程并没有啥不同。

但是说到 useCallback 的实现原理，我们目前还没有看到 react 的源码相关的一些文章或者说视频。大体来说，也是用缓存实现那一套：deps 为键，fn 为值。执行的时候先读取，如果有缓存指针返回就直接返回，如果没有就创建存入再返回。下一次再取的时候，以 deps 为 key 来查询，key 没变，返回的结果也就没变。都是类似的套路。
