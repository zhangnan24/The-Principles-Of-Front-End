# 开始

貌似从4.0.0以后，就不支持全局安装create-react-app了。

```powershell
npx create-react-app [项目名] --template typescript
```

# 关于typescript的配置

要想在项目中使用tsx，需要将tsconfig.json里面的`jsx`的值设为`react`。

jsx的几个值含义如下：

- preserve。 保留jsx，输出.jsx
- react-native。保留jsx，输出js
- react。 直接输出编译成ReactElement的js

因为这里是ts项目，完全不需要保留jsx，所以设置其值为`react`。
