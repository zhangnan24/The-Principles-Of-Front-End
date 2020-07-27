# 单纯更新prop

如果只是单纯更新prop，父组件不需要做额外的事情，那么用官方提供的`.sync`和`update:xxx`就挺香的。

```js
// parent.vue
<child :title.sync="titleFromParent"  />
```
```js
// child.vue
export default {
    props: {
        title: String
    },
    methods: {
        handleTitleChange(val) {
            this.$emit('update:title', val)
        }
    }
}
```

# 不需要响应式的长列表性能提升

比如说有个列表有几十个上百个条目，属于比较大的，如果它本身不需要动态改变，比如文章列表、品牌列表等等。此时如果直接处理成响应式数据会比较耗性能，因为它需要逐个逐个地定义`getter`，`setter`这些。这时候针对这种静态长列表，我们可以用`Object.freeze`来优化。

```js
```