# 概念

很喜欢一句话：大千世界无奇不有，但实际上不过是由一百多种元素组成。

所谓自定义hook，就是基于官方的几种hook，通过各种排列组合+实际业务场景得到的独立逻辑体。自定义hook就像是hooks中的歌曲，只要有创造力，脑洞够大，就能写出令人惊叹的自定义hook。

# 原理

其实跟之前的useState和useEffect调用的方式就一样，无论是生成链表还是读取链表，这个过程都完全一致。因为我们要明白自定义hook的本质：**它不过就是把几个官方内置hook的调用过程封装成了一个可复用的函数，并没有增加新的内容。**

# 用法

如下是一个简单的示例：

```js
function useBodyScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    document.addEventListener('scroll', handleScroll);
    return () =>
      document.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
}
```

注意一个问题，那就是自定义hook的命名格式一定要为`useXXX`。后面的单词首字母还必须得大写，如果尝试违反这种命名规则，编辑器会报错：`React Hook "useState" is called in function "xxx" which is neither a React function component or a custom React Hook function`。也就是说：react官方的hook只能用在函数式组件（通过首字母大写+返回ReactElement来判断）里面、或者自定义hook里面。