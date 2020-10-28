# 单纯更新 prop

如果只是单纯更新 prop，父组件不需要做额外的事情，那么用官方提供的`.sync`和`update:xxx`就挺香的。

```js
// parent.vue
<child :title.sync="titleFromParent"  />
```

```js
// child.vue
export default {
  props: {
    title: String,
  },
  methods: {
    handleTitleChange(val) {
      this.$emit("update:title", val);
    },
  },
};
```

# 路由跳转传参

vue 中的跳转页面传参可以分为两种：

- path + query
- name + params

## path 搭配 query

第一种也是最常用的，在 router 的配置中类似这样：

```js
{
    path: '/detail',
    component: () => import(/* webpackChunkName: 'detail' */ "../views/detail" )
}
```

跳转的时候使用方法如下：

```js
$router.push({
  path: "/detail", // 这里的斜杠要不要都可以
  query: {
    name: "zhangnan",
  },
});
```

跳转到详情页时 url 格式为`/detail?name=zhangnan`,在详情页可以通过`$route.query.name`来拿到值。

## name 搭配 params

第二种在 router 中配置类似这样：

```js
{
    path: '/detail/:name',
    name: 'Detail',
    component: () => import(/* webpackChunkName: 'detail' */ "../views/detail" )
}
```

如上面代码所示，需要在 path 中添加“动态路径参数”, 它使用冒号 : 标记，一个 path 可以添加多个动态路径参数。

其实这个名字取得挺好的，所谓动态路径，就是动态地去改变这个组件对应的 path。而 path 路由匹配模式匹配的是全路径，忽略 queryString。`/detail`是匹配不到配置为`/detail/:name`的组件的，因为后者的完整 path 一定不等于`/detail`

而且 params 属性一定是搭配 name 来使用的，如果搭配 path，params 会被忽略。

这就是为什么在路由配置中经常会加一个 name 属性，这个属性在用 path 匹配时，可以说是没卵用的，但是在包含动态路径参数的路由配置中，它是必须的。

我们这时候会这样来使用：

```js
$router.push({
  name: "Detail",
  params: {
    name: "zhangnan",
  },
});
```

跳转到详情页时 url 格式为`/detail/zhangnan`,在详情页可以通过`$route.params.name`来拿到值。

注意 ⚠️：

关于动态路径参数，如果在路由配置中没有写，形如`$router.push({ name: 'Detail', params: { name: zhangnan } })`也是可以跳转到详情的，在详情页面也可以通过`$route.params.name`来拿到值，但是，由于没有配置动态路径参数，参数值并未写入到 url 中，也就是说此时的 url 其实只是`/detail`而已，只要页面一刷新，`$route.params.name`就取不到值了。

## 组件复用

在页面跳转的时候，还需注意一下组件复用的问题，比如如下情况，vue 就会进行组件复用。

- 从`/detail?name=zhangnan`跳转到`/detail?name=wanger`

- 从`/detail/zhangnan`跳转到`/detail/wanger`

这两种情况都有一个共同的特点：在路由配置中，**跳转前和跳转后对应的其实是同一个 component**。

组件会被复用，意味着这时候生命周期不会重新跑一边。即使进行了跳转，实际上仍处于当前已经实例化的实例中，而且这个实例还是有状态的，简而言之，这次跳转动作完成前后，router-view 渲染出口内的 component 还是同一个。

所以，如果真的有这种情况，只能手动去监听一下路由变化，并做出相应更新动作了。常用的有如下两种：

```js
watch: {
    $route(to, from) {
      // 更新一下数据之类
    }
},
beforeRouteUpdate(to, from, next) {
    // 更新一下数据之类
    next();
  }
```
无论是监听$route变化还是beforeRouteUpdate导航守卫，它们其实都是懒执行的，也就是说，第一次从其他页面进来的时候不会执行。当我们已经处于当前页面，跳往其他页面时，才会被触发。

当然这两个也有细微的区别，监听$route变化是在跳转成功之后，而beforeRouteUpdate则是在跳转到下一个页面之前（执行next（）的时候才是真正执行跳转动作）。
