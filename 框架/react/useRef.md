# useRef有啥用

useRef主要有两个作用：

- 用来访问DOM；
- 用来保存变量到当前函数式组件的外部hook list。

## 访问DOM

我们先来看看前者怎么用吧：

```tsx
const inputRef = useRef(null);

const handleClick = () => {
  inputRef.current?.focus();
}

return (
  <input ref={inputRef} />
  <button onClick={handleClick}>点击</button>
)
```

这样就可以方便地访问DOM节点。

## 保存可变值

useRef将会创建一个ref对象，并把这个ref对象保存在函数式组件外部的hookList。这样有好处的：

1. 独立于`capture value`之外存储，不用担心获得过时变量的问题；
2. 可以同步修改状态。