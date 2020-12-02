# useState

## 基本原理

首先，useState 会生成一个状态和修改状态的函数。这个状态会保存在函数式组件外面，每次重渲染时，这一次渲染都会去外面把这个状态钩回来，读取成常量并写进该次渲染中。

通过调用修改状态的函数，会触发重渲染。到这里我们总结：props 的改变和 setState 的调用，都会触发 re-render。

由于每次渲染都是独立的，所以每次渲染都会读到一个独立的状态值，这个状态值，就是通过钩子钩到的 state 并读取到的常量。

这就是所谓的`capture value`特性，每次的渲染都是独立的，每次渲染的状态其实都只是常量罢了。

## 深入本质

让我们看深入一下本质，看看 useState 和 re-render 到底如何关联起来：

1. 函数式组件初次渲染，一个个的 useState 依次执行，生成 hooks 链表，里面记录了每个 state 的初始值和对应的 setter 函数
2. 这个链表会挂在这个函数式组件的外面，可以被 useState 或相应 setter 访问
3. 当某个时刻调用了 setSetter，将会直接改变这个 hooks 链表
4. hooks 链表其实就是这个函数式组件的状态表，它的改变等效于状态改变，会引起函数式组件重渲染
5. 这个函数式组件重渲染，执行到 useState 时，因为初次执行已经挂载过一个 hooks 链表了，这个时候就会直接读取链表的相应值

## 用法

形式:

```js
const [count, setCount] = useState(0);
```

当 useState 返回的初始值为数字或者字符串时，可以利用 ts 的自动类型推断去做，但是如果说是初始值是 null 或 undefined 时，则需要显式地指定其未来的值类型，如:

```tsx
const [str, setStr] = useState<string>();
```

当初始值为复杂引用类型的时候，就需要上接口了：

```js
interface IUserInfo {
  name: string;
  gender: string;
  age?: number;
}

const [userInfo, setUserInfo] =
  useState < IUserInfo > { name: "", gender: "男" };
```
