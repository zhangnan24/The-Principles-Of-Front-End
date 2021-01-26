# 函数式组件入参的命名规范

在函数式组件的入参里面，通常我们会这样来命名一个组件的入参，即`[组件名]Props`，如下：

```ts
// 比如当前组件名为InfoCard
export interface InfoCardProps {
  name: string;
  age: number;
}
```

# 如果初始值能说明类型，就不用给 useState 指明泛型变量

```ts
// ❌这样写是不必要的，因为初始值0已经能说明count类型
const [count, setCount] = useState<number>(0);

// ✅这样写好点
const [count, setCount] = useState(0);
```

# 当参数键名不确定时，如下是一种很好的拓展方式

```ts
export interface InfoCardProps {
  // 表示键名不确定，键值限制为number类型
  [key: string]: number;
}
```

当键值也不确定时，以下接口对任何对象都是适用的。

```ts
export interface InfoCardProps {
  [key: string]: any;
}
```

但是这个操作太放纵了，慎用。

# 和React元素相关的类型（ReactNode/ReactElement/JSX.Element）

```ts
const MyComp = (props: { title: string; }) => {
  return <h2>{props.title}</h2>
}

typeof MyComp; // (prop: {title: string;}) => JSX.Element;

// ReactNode表示任意类型的React节点，这是个联合类型，情况非常多，兼容性也非常好
const a: React.ReactNode = null || undefined || <div>hello</div> || <MyComp title="world" /> || 'abc' || 123 || true;

// ReactElement和JSX.Element表现是一致的，都表示“原生的DOM组件”或“自定义的组件的执行结果”。
const b: React.ReactElement = <div>hello world</div> || <MyComp title="good" />

const c: JSX.Element = <div>hello world</div> || <MyComp title="good" />
```

# 和原生DOM相关的类型（Element/HTMLElement/HTMLxxxElement）

原生的DOM相关的类型，主要有以下这么几个：`Element`、 `HTMLElement`、`HTMLxxxElment`。

简单来说： `Element = HTMLElement + SVGElement`。而`HTMLxxxElement`属于`HTMLElement`的子类型，常见的有`HTMLDivElement`、`HTMLInputElement`、`HTMLSpanElement`等等。

因此，其关系为：`Element` > `HTMLElement` > `HTMLxxxElement`，原则上是尽量写详细。

```ts
const handleInputChange = (evt: React.ChangeEvent<HTMLElement>) => {
  console.log(evt);
}
```

# 和事件Event相关的类型（xxxEvent）

在React中，原生事件被处理成了**React事件**，其内部是通过事件委托来优化性能的。言归正传，React事件的通用格式为`[xxx]Event`，常见的有`MouseEvent`、`ChangEvent`、`TouchEvent`，是一个泛型类型，泛型变量为触发该事件的DOM元素类型。

示例：

```ts
const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
  console.log(evt);
}

const handleButtonClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    console.log(evt);
}

const handleDivTouch = (evt: React.TouchEvent<HTMLDivElement>) => {
  console.log(evt);
}
```

# 与hooks的结合
