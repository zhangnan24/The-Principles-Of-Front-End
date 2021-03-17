## 概述

在对于小型页面共享数据时，我们一般会有诸如“状态提升”这样的开发约定，也就是说，我们会将共享的状态放到上层最近的公共父级。但是当页面数量一多，组件拆分粒度变细，这种“共享状态”的机制变得很脆弱，很冗余。

redux 的机制就是为了解决这个问题，redux 有几个非常明显的特点：

1. 数据的唯一真相来源；
2. reducer 纯函数；
3. 单项数据流。

redux 的单项数据流，可以概括为三个部分：`View`，`Reducers`，`Store`。

`View`视图层发起更新动作（`dispatch`），会抵达更新函数层（`Reducers`），更新函数执行并返回最新状态，抵达状态层（`Store`），状态层更新后将通知视图层更新。

![redux](https://static.powerformer.com/c/4ada16faecf470bf265f52276bdc9170/chapter_1_1.jpg)

其实我觉得，无论是 vuex 也好，redux 也好，它的设计理念都是类似一个“前端数据库”。

redux 中，大体流程是根组件定义`createStore`，子组件中使用`useSelector`获取状态，使用`useDispatch`更新状态。

## useReducer + useContext 能否代替 redux？

不能，`useReducer` + `useContext`实际上是制造了一个“穷人版的 redux”。而且我们必须花费额外的心思去避免性能问题（`React.memo`、`useCallback`等），然而这些烦人的 dirty works 其实 React-Redux 等工具已经默默替我们解决了。除此之外，我们还会面临以下问题：

- 需要自行实现 combineReducers 等辅助功能
- 失去 Redux 生态的中间件支持
- 失去 Redux DevTools 等调试工具
- 出了坑不利于求助……

腾讯的这篇文章写的可以：[Redux with Hooks](https://juejin.cn/post/6844903903981469703)
