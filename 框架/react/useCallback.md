# 概念

缓存一个函数，并将指向这个函数的指针return出来，避免每次重渲染的的时候都去不断声明式地创建同样的函数。

如果这个函数在useEffect中用到了，并作为一个依赖项存在deps数组里面，试想，这样是多么危险的事情！下次重渲染的时候，这个依赖项假如是函数，用`Object.is`去比较，是必然认为变化的。于是会出现：

初次渲染完 --> 运行useEffect --> effectFn里面修改了状态 --> 触发重渲染 --> 再次运行useEffect --> 对比上一次渲染的deps，存在引用类型则必然不相等 --> 又运行effectFn --> effectFn里面修改了状态 --> 触发重渲染 ...陷入无限循环。

所以useCallback的作用是啥？就是重渲染时，在对比上一次渲染的deps依赖时，假如遇到引用类型，因为用useCallback会返回这个函数的引用，两个引用对比是相等的，就不会再次运行effectFn了。

注意这里用了useCallback后，存储的函数是独立出去函数式组件的每次渲染的。也就是说，每次渲染运行useCallback钩子拿到的函数引用都是一样的，都指向堆内存的同一个地址。

# 用法

useCallback的用法如下：

```js
const memoFn = useCallback(fn, deps);
```

像如果一个纯粹的声明式函数，我们可以这样定义让它只在初次渲染的时候创建一次：

```js
function showUA() {
    console.log(navigator.userAgent)
}

const memoShowUA = useCallback(showUA, [])
```

这里的memo，就是`memorize`的意思，也就是记忆。这样这个引用就可以放心放入useEffect的deps依赖数组中了。

所以我们才常常说要十分注意deps依赖数组里面的元素，尤其是里面出现引用类型时。

# 原理

关于useCallback的运行原理，它仍然是初次渲染时去添加到一张hooks链表中，然后在重渲染时将读取hooks链表，这个过程并没有啥不同。

但是说到useCallback的实现原理，我们目前还没有看到react的源码相关的一些文章或者说视频。大体来说，也是用缓存实现那一套：deps为键，fn为值。执行的时候先读取，如果有缓存指针返回就直接返回，如果没有就创建存入再返回。下一次再取的时候，以deps为key来查询，key没变，返回的结果也就没变。都是类似的套路。