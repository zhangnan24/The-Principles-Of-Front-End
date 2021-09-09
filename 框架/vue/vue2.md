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

无论是监听\$route 变化还是 beforeRouteUpdate 导航守卫，它们其实都是懒执行的，也就是说，第一次从其他页面进来的时候不会执行。当我们已经处于当前页面，跳往其他页面时，才会被触发。

当然这两个也有细微的区别，监听\$route 变化是在跳转成功之后，而 beforeRouteUpdate 则是在跳转到下一个页面之前（执行 next 的时候才是真正执行跳转动作）。

## vue2 生命周期（父子组件情况）

其实 vue 的生命周期，我们可以归纳为如下三个阶段：

1. 挂载阶段（`beforeCreate`、`created`、`beforeMount`、`mounted`）
2. 更新阶段（`beforeUpdate`、`updated`）
3. 销毁阶段（`beforeDestroy`、`destroyed`）

其中比较典型的两个声明周期可以拿出来说一下：

- `created`，表示 vue 组件已经实例化完成，但是页面还没有渲染
- `mounted`，页面已经渲染完成

至于有父子组件的情况，我们可以归结为这样的规律：

- 调用（`beforeXXX`）、创建（`created`）是从外到內的；
- 执行（`mounted`、`updated`、`destroyed`）是从內到外的。

## vue2 怎么实现监听数组？

我们知道，vue2 使用的`Object.defineProperty`对数组并没有任何监听作用，所以实际上，vue 的数组监听也真的没有用到这个 api 来做数据劫持（拦截 getter/setter）。

vue2 主要是重写了数组的一些常用方法，在数组调用这些方法时，同时调用 vue 内置的`notify`方法通知视图更新。

它的大体实现如下：

```js
const oldArrProperty = Array.prototype;
// 用Object.create是为了生成一个新的原型对象，以便于我们魔改，但是又不影响原生的Array.prototype
const arrProprty = Object.create(oldArrProperty);
["push", "pop", "shift", "unshift", "splice"].forEach((methodName) => {
  arrProprty[methodName] = function () {
    // 调原生的api，同时绑定当前调用的上下文
    const res = oldArrProperty[methodName]();
    // 通知视图更新
    dep.notify();
    // 把原生的执行结果返回出去，不要影响原生的功能
    return res;
  };
});
```

## Vue.\$nextTick 怎么实现的？

首先，nextTick 用来获取更新后的 DOM 元素。

简单来说，其内部实现是优先微任务，如果浏览器不支持再换成宏任务。

实际上来说，`nextTick`的实现大致如下：

```js
if (typeof Promise !== "undefined") {
  // Promise.resolve()
} else if (typeof MutationObserver !== "undefined") {
  // new MutationObserver()
} else if (typeof setImmediate !== "undefined") {
  // setImmediate(flushCallbacks)
} else {
  // setTimeout()
}
```

也就是说：vue 会优先检测微任务（`Promise.resolve`、`MutationObserver`）是否可用，如果不行，才用宏任务（`setImmediate`、`setTimeout`）。

在这里我们刚好也复习一个知识点：**微任务是语言本身自带的，宏任务是宿主环境提供的。**

为什么要这要设计呢？这是因为在执行微任务时，虽然页面没有重新渲染，但是 DOM 结构已经更新了，这时候是能获取到更新后的 DOM 节点信息的。

（但是感觉 vue 对微任务做了一些额外的处理，到 nextTick 的回调执行时，不仅 DOM 数据更新了，页面确实也重新渲染了）

如果放到宏任务，因为在同步代码和微任务队列都执行完毕后，执行栈清空，这时候 GUI 会检查页面是否需要重新渲染，如果需要的话 GUI 会渲染完再归还主线程给 JS，继续执行宏任务队列里面的任务。

所以：放到宏任务队列需要等待检查渲染/渲染，这样 nextTick 的回调执行会有点偏慢，而且没必要等待页面渲染完成再取 DOM 节点信息。

关于验证 GUI 的介入时机，代码如下：

```js
// 用原生JS+html来试，不要用vue，vue会做额外处理
document.body.style.backgroundColor = "red";
Promise.resolve().then(() => {
  console.table(document.body.style);
  document.body.style.backgroundColor = "yellow";
});
Promise.resolve().then(() => {
  console.table(document.body.style);
  document.body.style.backgroundColor = "blue";
});
this.$nextTick(() => {
  console.warn(document.body.style.backgroundColor, "nextTick");
  document.body.style.backgroundColor = "aqua";
});
setTimeout(() => {
  console.table(document.body.style);
  document.body.style.backgroundColor = "green";
  console.table(document.body.style);
}, 0);
```

## provide/inject 的最佳使用姿势

实际上是没必要用`Vue.obsevable`。

我们知道：vue 在实例化的时候，会对 data 函数里面返回的对象，通过使用`Object.defineProperty`做递归的属性劫持，如果子元素为引用类型，会被处理成响应式对象。

`provide/inject`本身返回的对象不是响应式的，但是如果它返回的对象本身已经被处理成了响应式对象，那就没有问题。

```js
// 父组件
  data() {
    return {
      msg: '',
      shareData: {
        name: 'zhang',
        age: 26
      }
    };
  },
  // 这里用provide函数是为了让this指向变得正确
  provide() {
    return {
      share: this.shareData
    }
  }



// 子孙组件
<template>
  <div class="hello">
    <h4>子孙组件</h4>
    <h3>{{share.age}}</h3>
    <input type="text" v-model="share.name" />
  </div>
</template>

<script>
export default {
  inject: ['share']
</script>
```

这样写的话，无论父组件和子孙组件都可以对这个`shareData`做任意修改，相当于父组件提供了一个共享的响应式对象。

## vue 中的 diff 算法

首先，diff 就是对比的意思。

vue 中的 diff 算法，其实就是两颗新老`vdom tree`之间的对比。

首先，两颗树直接比较的时间复杂度`O(n^3)`：遍历 tree1 所有节点 \* 遍历 tree2 所有节点 \* 排序。这是一个完全不可用的算法。

而 vue 的 diff 逻辑如下，直接将复杂度蹭蹭降到了`O(n)`：

1. 只做同层级比较，不做跨层级比较；
2. tag 不相同，就直接删掉重建；
3. key 和 tag 都相同，就直接认为是相同节点，不做深度比较。

### patch 机制

- h 函数执行生成 vnode 函数，vnode 函数执行即可得到 vnode 对象；
- patch 函数用来比较两个新老 vnode 对象之间的差异，接收的参数包括 `oldVnode`+`vnode`。当然也可以接收 `domContainer`+`vnode`，用于首次渲染；
- patch 函数执行且比较两个 vnode 对象时，针对同级节点，会先进行 sameNode 比较，key 和 tag 都相同则认为是 sameNode，如果是 sameNode，则执行 patchVNode；
- sameVnode 只能说明 key 和 tag 相同，而节点里面的一些自身文本/子节点之类的是否有更新，则要进一步确定，这个“进一步”，就是 patchVnode 函数，可以说，patchVnode 函数就是一个“深度对比函数”；
- patchVnode 会根据新旧节点的变化情况，选择性地调用`updateChildren`/`addVnodes`/`removeVnodes`/`setText`等操作，用来更新新 vnode tree 上对应的节点。
- 如果不是 sameNode，就删掉重建。

总结流程如下：

1. h 函数 --> vnode 函数 --> vnode 对象 --> 开始 patch --> 比较是否 sameNode；
2. 不是 sameNode --> 删掉重建；
3. 是 sameNode --> patchVnodes --> 对比新老节点 --> 根据情况执行`updateChildren`/`addVnodes`/`removeVnodes`/`setText`（这些都是操作真实 DOM 的方法）。

让我们跳出来想想，对比新老 vnode 差异的目的，不是为了去改新 vnode 或者老 vnode。而是找出这些差异，然后根据这些差异去更新真实 DOM。

## v-for 中的 key 有啥作用

**在保证正确的前提下，尽可能地复用旧节点，减少渲染次数。**

因为 vue 的 diff 算法中的 patch 函数在判断 sameNode 的时候，会判断 tag 和 key 是否相同，如果循环体里面不写 key，那么 key 都为 undefined，加之 v-for 迭代的是同样类型的节点（tag 也相同），那么全部都会认为是相同节点，也就是所谓的“默认就地复用策略”。

这种策略在组件有自己状态的时候是很危险的，因为我们前面说了，只要 key 和 tag 一样，就会认为是相同节点，不做深度比较，这其实很容易引起错误，尤其是列表在有中间插入/删除的情况，直接就地复用就会导致错误。这也是不建议使用 index 作为 key 的原因。

使用 random 随机数不会引发错误，但是复用率直接为 0，渲染次数比较高，也不推荐使用。

## vue 的模版解析，渲染和更新的过程

我们先来看看初次渲染：

1. 触发响应式，对 script 里面的 data 的 getter/setter 进行劫持，递归处理成响应式对象，用 Watcher 观察起来。
2. 对 tempalte 模版进行编译，使用大量的正则表达式对 tempalte 里面的指令、语法、属性进行匹配，最终生成一个 render 函数；
3. 执行 render 函数以生成 vnode 对象，执行 patch，页面就渲染上了，注意这里其实会触发之前定义的各种 getter（只要模版用到了 data 里面的东西），这其实就是个收集依赖的过程啊。

至此，初次渲染已经结束，那么更新又如何呢？我们接着看：

1. 修改 data，触发 setter，然后会 notify 通知 Watcher；
2. 重新执行 render 函数（re-render），生成 newVnode，然后 patch，然后调 update 更新视图

以上这些，就是“**vue 的响应式原理**”，这里要做个区分：

- 响应式原理：`Object.defineProperty`、`getter/setter`、`Watcher`这些
- 双向绑定原理（v-model 原理）: 语法糖，`:value` + `@input` 的结合

## vue 的异步渲染

vue 在页面渲染时会将我们对 data 的修改做整合，多次 data 修改只会渲染一次。

## 前端路由原理

前端的路由模式，现在一般就分为哈希模式和 history 模式（需要后端支持）。

对于哈希模式来说，一般用于单页面应用，也就是 spa，会有如下特点：

1. hash 变化会触发网页跳转，即浏览器的前进、后退；
2. 不会刷新页面
3. hash 不会提交到服务端，完全由前端控制。

url 里面如果带了哈希，url 的变化（浏览器前进后退/直接通过 js 赋值 url）会触发`hashchange`事件，在事件处理函数里面可以获取到新的 hash 值。通过 vue-router 相关的配置，可以匹配出来某个`path`对应的`component`是哪个，然后通常会将这个组件异步加载进来并解析渲染到`<router-view>`出口。

## 常用的软件架构-MVVM、MVC、MVP

- MVC，主要特点是单向更新，只能由视图层 view 通过 controler 更新 model 层，不能反着来；
- MVP，双向通信，但是中间层 Presenter 逻辑太臃肿了，需要手动绑定 Model 和 View 完成通信，设计不科学；
- MVVM，中间层 ViewModel 设计科学，自动对视图层和逻辑层做双向绑定（其实就是用 Object.defineProperty/Proxy 等做了 getter/setter 劫持），数据驱动视图，重用度很高。

## Object.defineProperty 有什么缺点？

1. 不能监听数组变化（Proxy 天然能支持监听数组变化）；
2. 不能监听属性的新增/删除。
