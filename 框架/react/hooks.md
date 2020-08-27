# 函数式组件

函数式组件的生命周期可以分为以下三部分：

初次渲染 ---> 重渲染 ---> 销毁

# useState

形式:

```js
const [count, setCount] = useState(0)
```

当useState返回的初始值为数字或者字符串时，可以利用ts的自动类型推断去做，但是如果说是初始值是null或undefined时，则需要显式地指定其未来的值类型，如:

```js
const [str, setStr] = useState<string>();
```

当初始值为复杂引用类型的时候，就需要上接口了：

```js
interface IUserInfo {
    name: string;
    gender: string;
    age?: number
}

const [userInfo, setUserInfo] = useState<IUserInfo>({ name: '', gender: '男' })
```

# useEffect

useEffect一般被称为副作用，为什么叫它副作用呢？我说一下我简单的理解：

react设计是希望这样子：

```js
视图 = f(data)
```

f是一个把数据映射到视图的渲染函数，数据变了，就会引起视图变了，这是一种很纯粹的关系，一一对应。

但是实际情况是：有时候数据变了，我们希望去请求一个接口，或者在控制台打印一些东西，或者跳转路由。总之这些动作都跟这个数据对应的那部分视图没有关系，所以我们就称之为“副作用”。

副作用的运行时间是：数据改变 --> 对应视图改变 --> 对应副作用触发。

如果我们想用useEffect模拟一个ComponentDidMount的行为，我们只需要把它的依赖设为空数组即可。

```js
useEffect(() => {
    fetchData()
}, [])
```

# useMemo

useMemo中的memo，就是memorize的简写，也就是“记忆”的意思，它返回一个计算结果，它其实就相当于vue的computed，都是用来缓存依赖某个数据的计算结果，如果依赖的数据改变了，则重新计算。

```js
const [count, setCount] = useState(0);

const doubleCount = useMemo(() => count * 2, [count])
```

# useCallback

就是说每次渲染函数式组件的时候，里面的函数都会被重新创建一遍，为了避免重复创建函数节省性能开销，就出现了useCallback这个东西。所以我们可以把它归类为偏向于性能优化的一个hook，其实平常开发是没什么卵用。

# useContext

所谓Context，就是上下文，这个所谓的上下文，其实就是语文文章的上下文的意思。在软件开发领域我们可以这么理解：**上下文就是一个特定的环境**。

比如说：“哪里哪里”。在中国和汉语这个环境中，它表示谦虚；在欧美和英文环境中，它却表示在到处寻找某样东西。不同的外部环境，就是不同的上下文。

一个web项目是某一个页面的上下文，一个对象是里面某一个属性的上下文，诸如此类。


具体的用法后面再补吧。。

# useRef

关于ref的用法，我觉得最佳实践还是把作为一种DOM引用的方式比较合理。

案例也后面再补吧，这hook总算入了点门了，基本上搞清楚了大致的用法。



