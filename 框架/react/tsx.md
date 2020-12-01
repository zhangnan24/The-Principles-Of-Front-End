# 为函数式组件定义类型

其类型在 React 里面已经有了，即为`React.FC`，`FC`也就是`FunctionComponent`的缩写。示例如下：

```ts
const DeatilCard: React.FC = () => {
  return (
    <>
      <div className="card">卡片</div>
    </>
  );
};
```

如果需要传参数，则需要定义一下这个函数式组件接收的参数格式，如下：

```ts
const Age: React.FC<{age: number}> = (props) => {
    return(
        <>
            <div>年龄为{props.age}岁</div>
        </>
    )
}
```

注意哈，这里的定义是对props对象进行定义，组件的入参在这里会被包装成一个对象。

然后在这里，props不用再定义interface了。
