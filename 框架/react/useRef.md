# useRef有啥用

useRef主要有两个作用：

- 用来引用DOM；
- 用来保存变量到当前函数式组件的外部hook list。

我们先来看看前者怎么用吧：

```tsx

useRef将会创建一个ref对象，并把这个ref对象保存在函数式组件外部的hookList。这样有个好处是：我写错了
