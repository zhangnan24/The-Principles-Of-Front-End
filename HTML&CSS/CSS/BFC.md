# 外边距塌陷问题

在谈BFC之前，我们先看一个由BFC引发的经典bug：外边距合并。

外边距塌陷问题会发生在两种场合：相邻盒子之间、父子盒子之间。*而且只会出现在垂直方向*。

> 注意，是父子盒子之间，不是隔代盒子之间。

父子盒子的外边距塌陷表现为：子元素的外边距会被放到父元素外面去，父子元素内部没有外边距。

怎样做可以避免边距塌陷呢？

- 父子盒子之间：*父元素有padding、border、BFC特性*，都可以避免边距塌陷。

- 相邻元素来说: margin不要直接硬碰硬，其中一个元素用一个BFC盒子包起来就行。

让我们想一想🤔外边距合并的本质：**边距与边距之间没有隔断，导致融合在一起，也就是合并。**

对于父子元素来说，我们为父元素设置BFC属性，其实是将子元素的外边距“包裹”住了，不外溢到父元素外部。对于相邻元素来说，用一个BFC盒子包裹住其中一个元素，也是为了将这个元素的外边距“包裹”住，避免与相邻元素的外边距直接接触。

相邻元素解决之道：

```html
<div class="bfc">
    <div class="test1">test1</div>
</div>

<div class="test2">test2</div>
```

```css
.bfc {
    overflow: hidden;
}

.test1 {
    margin: 40px;
}

.test2 {
    margin: 50px;
}
```

父子元素解决之道：

```html
<div class="bfc">
    <div class="sub">sub</div>
</div>
```

```css
.bfc {
    overflow: hidden;
    /* padding: 1px;  */ 
    /* border: 1px solid #ccc; */
}

.sub {
    margin: 50px;
}
```

# BFC是啥

现在我们可以来看看BFC是啥。



