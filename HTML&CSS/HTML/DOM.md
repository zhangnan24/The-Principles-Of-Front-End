## e.target 和 e.currentTarget 的区别

- `e.target`，表示谁触发的，这个非常常用。
- `e.currentTarget`，表示绑定在谁身上，这个很少用。

在有些情况中，它们可能是不一样的，比如说一个常用的事件委托场景（冒泡）：

```html
<ul @click="logEvent">
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```

```js
// 比如点击第二个li元素,则会打印如下：
logEvent(event) {
  console.log(event.target); // <li>...</li>
  console.log(event.currentTarget); // <ul>...</ul>
}
```
