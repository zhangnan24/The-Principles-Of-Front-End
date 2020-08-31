# 概念

如果说useCallback是用来缓存一个函数，返回一个函数的引用。那么useMemo就是用来缓存一个函数的执行结果。这非常类似于vue中的computed计算属性。

# 用法

```js
const memoValue = useMemo(() => { return a * b }, [a, b]);
```

我们知道: useMemo实际上是useCallback的超集，它不仅能缓存一个函数的执行结果，也能缓存一个函数。也就是说下面两种写法是等价的：

```js
const memoFn = useCallback(() => count * 2, [count])

const memoFn2 = useMemo(() => {
    return () => count * 2
}, [count])
```

但是在实际使用中，我们仍然觉得第二种写法有些繁琐，用useMemo返回函数的计算结果更加方便，如下：

```js
const memoFn = useCallback(() => count * 2, [count])

const memoValue = useMemo(() => count * 2, [count])
```

让useCalback缓存函数引用，useMemo缓存函数执行结果吧！各司其职，岂不美滋滋。