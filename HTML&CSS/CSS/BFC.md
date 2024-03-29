# 外边距塌陷问题

在谈BFC之前，我们先看一个由BFC引发的经典bug：外边距合并。

外边距塌陷问题会发生在两种场合：相邻盒子之间、父子盒子之间。*而且只会出现在垂直方向*。

> 注意，是父子盒子之间，不是隔代盒子之间。

父子盒子的外边距塌陷表现为：子元素的外边距会被放到父元素外面去，父子元素内部没有外边距。

怎样做可以避免边距塌陷呢？

- 父子盒子之间：*父元素有padding、border、BFC特性*，都可以避免边距塌陷。

- 相邻元素来说: margin不要直接硬碰硬，其中一个元素用一个BFC盒子包起来就行。

让我们想一想🤔外边距合并的本质：**边距与边距之间没有隔断，导致融合在一起，也就是合并。**

或者说：**外边距合并会发生在同一BFC的块级元素之间**。

对于父子元素来说，我们为父元素设置BFC属性，其实是将子元素的外边距“包裹”住了，不外溢到父元素外部。对于相邻元素来说，用一个BFC盒子包裹住其中一个元素，也是为了将这个元素的外边距“包裹”住，避免与相邻元素的外边距直接接触。

相邻元素解决之道：

```html
<div class="bfc">
    <div class="test test1">test1</div>
</div>

<div class="test test2">test2</div>
```

```css
.bfc {
    overflow: auto;
}

.test {
  width: 300px;
  height: 300px;
}

.test1 {
    margin: 40px;
    background-color: red;
}

.test2 {
    margin: 50px;
    background-color: blue;
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
    overflow: auto;
    /* padding: 1px;  */ 
    /* border: 1px solid #ccc; */
}

.sub {
    margin-top: 50px;
}
```

# float布局及清除浮动

float引发的经典bug，莫过于**跟随浮动**。

float其实是一个元老级的属性，旧到IE6也支持这个属性。

它的诞生是为了解决图文排列的问题，也就是文字绕图排列。

设置为float的元素，其后面的元素就会跟着浮动，即使为这个float元素加一层html容器也无济于事。

解决的方案有以下几个：

- 在浮动元素后面加个html元素（业内通常将其类名命名为clearfix），设置这个元素的`clear: both;`。（增加同级html元素）
- 给浮动元素加个容器，给容器的after伪元素设置`clear: both;`。（增加父级html容器）
- 给浮动元素加个容器，并为容器开启BFC特性。（增加父级html容器）

对于第二种方法，完整代码为：

```css
.container::after {
  display: block;
  content: "";
  clear: both;
}
```

其实这三种方式都会增加html元素。只不过第一种是一定会专门为float增加一个元素，第二三种可能凑巧本身就需要一个元素去包裹，然后在这个包裹的元素上增加特定伪元素/设置BFC。

优雅？三种方案都不怎么优雅。

# BFC是啥

现在我们可以来看看BFC是啥。

BFC又称“块级格式化上下文”，它会包含创建者内部的所有元素的样式，并且隔绝BFC内部样式对外部的影响。

创建BFC的方法主要有以下几种：

- overflow不为visible。这里有个只能设置为hidden的误解，其实设置auto也是可以的
- flex容器的直接子元素
- 行内块级元素（inline-block）
- 绝对定位/固定定位元素（absolute/fixed）
- 浮动元素（float）

其中最常用的就是第一个，设置`overflow: auto`或者`overflow: hidden`，因为这种方法不需要改变元素的定位方式，可以无伤创建BFC。

> 注意：这里的overflow属性有个很特别的地方，即它的默认值并不是auto，而是visible。

那么看完上面两个经典bug，我们可以总结出BFC的两个主要作用：

- 包裹容器内部元素的外边距，使其不溢出；
- 清除容器内部元素的浮动，使其不影响外部。

其实无论是清除浮动还是清除外边距，本质都是在“清除内部元素的样式对外面的影响”。



