# 初始化一个taro项目

1. 全局安装taro脚手架

```powershell
npm i -g @tarojs/cli
```

2. 进入某个文件夹，然后初始化一个项目

```powershell
taro init [项目名]
```

3. 检查当前项目存在的问题

```powershell
// 进入项目根目录，运行此命令
taro doctor
```

4. 在当前项目的src/pages目录下快速生成一个新的模板页面目录

```powershell
taro create [页面名]
```

5. taro项目中的app.config.js或者app.config.ts，就相当于小程序中的app.json，用来配置全局的tabBar、主题颜色、页面路由之类

# 如何预览微信小程序？

通过以下命令，会将项目编译打包编译呈小程序代码，并输出到dist目录。

```powershell
yarn dev:weapp
```

打开微信开发者工具 --> 导入项目 --> 目录填写该dist目录即可。

