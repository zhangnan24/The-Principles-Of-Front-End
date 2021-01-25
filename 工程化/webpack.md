# Webpack简介

Webpack就是一个打包工具，所以对于webpack来说，我们更多的是关心其使用而非原理。因为它是一个只在开发环境下使用的，线上环境下不会去运行的东西。

# Webpack起步

一个项目要配置webpack，首先要安装webpack相关的东西，最基本的就是`webpack` + `webpack-cli`。

`webpack`可以让我们打包一个项目，也就是我们常说的`run build`。而要本地起一个项目(`run dev`)，则需要用到`webpack-dev-server`这个插件，所以我们在开发环境依赖中安装它。

```powershell
npm i webpack-dev-server -D
```

# 拆分配置和merge

一般情况下，我们的webpack配置会拆分成三部分，放在根目录的build文件夹，如下：

- webpack.common.js  *公共配置文件*
- webpack.dev.js  *开发环境专有配置文件*
- webpack.prod.js  *线上环境专有配置文件*

而将配置合并起来，我们需要用到一个专有的插件：`webpack-merge`。

# 各种loader有啥用

# loader和plugin有啥区别

# module、chunk、bundle有什么区别？

# Webpack怎么实现多页配置

# Webpack怎么实现懒加载

