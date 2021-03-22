## Webpack 简介

Webpack 就是一个打包工具，webpack 能做什么事情，就取决于我们配置了什么 loader 和 plugin。

所以对于 webpack 来说，我们更多的是关心其使用而非原理。因为它是一个只在开发环境使用的，线上环境不会去运行的东西。

## Webpack 起步

一个项目要配置 webpack，首先要安装 webpack 相关的东西，最基本的就是`webpack` + `webpack-cli`。

`webpack`可以让我们打包一个项目，也就是我们常说的`run build`。而要本地起一个项目(`run dev`)，则需要用到`webpack-dev-server`这个插件，所以我们在开发环境依赖中安装它。

```powershell
npm i webpack-dev-server -D
```

## 拆分配置和 merge

一般情况下，我们的 webpack 配置会拆分成三部分，放在根目录的 build 文件夹，如下：

- webpack.common.js _公共配置文件_
- webpack.dev.js _开发环境专有配置文件_
- webpack.prod.js _线上环境专有配置文件_

而将配置合并起来，我们需要用到一个专有的插件：`webpack-merge`。

## webpack 配置基本结构

一份 webpack 配置，通常会包含如下基本结构：

```js
module.exports = {
  // 打包入口文件
  // 可以直接写一个字符串，默认chunk名为main，还是不建议这样写吧
  // entry: "./src/index.js"
  entry: {
    // 可以配置多入口，key为chunk名
    index: "./src/index.js",
    subPage: "./src/sub.js",
  },

  // 打包出口文件
  output: {
    path: path.resolve(__dirname, "./dist"), // 输出的文件目录在哪儿
    filename: "[name].[chunkhash].bundle.js", // 包名，这里的[name]即入口文定义的chunk名
    publicPath: "/", // 资源引用的相对路径，这个要和服务器结合
    library: "myLib", // 打包成一个第三方库
    libraryTarget: "umd", // export 的 library 的规范，有支持 var, this, commonjs,commonjs2,amd,umd
  },

  // 模式 （webpack4+开始有）
  // 可以是 none、development、production，默认为 production
  // 设置了mode后，process.env.NODE_ENV会同步更新为 development 或 production
  mode: "production",

  // 自定义配置解析，多用于配置alias
  resolve: {
    "@": path.resolve(__dirname, "./src"),
  },

  // 模块处理，基本上就是各种loader
  module: {
    rules: [
      {
        test: ".(js|jsx)$",
        loader: {
          use: "babel-loader",
          options: {
            cacheDirectory: true, // 缓存转换结果，也是性能优化的一种手段
          },
        },
        exclude: /node_modules/, // 减小文件搜索范围，用来做性能优化
      },
    ],
  },

  // 各种自定义插件
  plugin: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("test"),
    }),
    new HtmlWebpackPlugin({}),
  ],

  // 配置优化-主要有两方面的内容：最小化包和拆包
  optimization: {
    // TerserJSPlugin就是用来替代uglifyJSPlugin的，现在已经弄成webpack官方内置了
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },

  // 本地服务-定义一些接口转发规则，用来绕开浏览器的同源策略
  devServer: {},

  // 持久化缓存-默认会将缓存文件输出到node_modules/.cache文件夹內
  cache: {
    type: 'filesystem',
  },
};
```

## 关于“零配置”

webpack4+开始支持零配置使用，这里的零配置就是指，其中关键点就是`mode`，webpack 会针对不同的 mode 内置相应的优化策略。

## 关于 splitChunks

`splitChunks`是`optimization`的一个子项。

假如我们设置其`chunks: all`，表示无论是同步导入的还是异步导入的，都会做代码分割处理。

```js
module.exports = {
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
  },
  optimization: {
    splitChunks: {
      // 对所有的包进行拆分，无论顶层导入还是异步import()导入
      chunks: "all",
      // 缓存分组
      cacheGroups: {
        // 第三方模块单独打包出去
        vendor: {
          name: "vendor", // chunk名称
          priority: 1, // 数值越大，优先级越高
          test: /node_modules/, // 这也是肯定的操作
          minSize: 0, // 大小限制，设为0表示只要是第三方模块一律单独打包
          minChunks: 1, // 最少复用过几次
        },

        // 我们自己写的公共模块也要单独打包
        common: {
          name: "common", // chunk 名称
          priority: 0, // 优先级
          minSize: 0, // 公共模块的大小限制，生产环境不要写0
          minChunks: 2, // 公共模块最少复用过几次，只要被复用两次及以上就单独打包
        },
      },
    },
  },
};
```

## 颇为不错的 webpack.DefinePlugin 与旧时代王者 cross-env

`DefinePlugin`现在是 webpack 自带的一个东西，用来设置客户端变量，用法如下：

```js
plugin: [
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify("test"),
  }),
];
```

其本质还是去设置`process.env.NODE_ENV`，这与旧时代的`cross-env`是一样的。

`cross-env`一直被用于兼容性地进行跨环境设置客户端变量（`linux`/`windows`等通吃），也没有犯过什么错，`DefinePlugin`的出现，估计是 webpack 为了生态整合，将一些通用的插件弄成官方内置。

## 前端代码为什么要进行打包构建？

1. 通过 tree-shaking（删除无用的模块）、压缩合并（如 webpack5 中的 terser-webpack-plugin）、可以让我们的代码体积更小，加载更快；
2. 用一些比较高级的语法/API/框架可以提高开发效率，比如 ES6+（各种 API、箭头函数等），less/scss（嵌套写法），TypeScript（类型检查），ES_Module（导入导出），.vue 文件等，但是这些高级的东西在各种浏览器上支持度有差异，所以需要通过打包构建，使用 babel，polyfill、loader 等工具将代码打包成浏览器能够广泛支持的文件和代码；
3. 统一产出，规范一下前端工程化流程。

## hash、chunkhash、contenthash 的区别

- `hash`，每次打包构建，无论文件内容有没有变化，都会生成新的哈希值，且全部 bundle 文件共用一个哈希
- `chunkhash`，入口文件依赖的内容变化了，chunkhash 就变了
- `contenthash`，具体的文件内容变了，contenthash 才改变，我们一般生产环境就用这个

## 常用的 loader

- `vue-loader`：加载和转译.vue 格式文件
- `file-loader`：将文件上的 import/require 解析并替换为 url，并输出文件
- `url-loader`：算是 file-loader 的一个升级版，可以设置文件大小限制（limit），低于这个限制就会转成 base64 的 dataURL，高于限制则像 file-loader 一样正常工作
- `babel-loader`：用来将 ES6+的代码转成 ES5 甚至更低
- `less-loader`：加载和转译 LESS 文件
- `css-loader`：解析 CSS 文件内容，返回 CSS 代码
- `style-loader`：将 CSS 代码以 Style 标签的形式注入到 HTML 里面

## 常用的 plugin

- `DefinePlugin`：在编译时配置全局常量
- `DllPlugin`：生成 manifest.json，进行分离打包
- `html-webpack-plugin`：创建 HTML 文件
- `terser-webpack-plugin`：类似于 uglifyJsPlugin，用来压缩 js 代码，放在 optimization 选项里面。
- `mini-css-extract-plugin`：抽离 css
- `webpack-merge`：合并 webpack 配置

```js
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
```

## loader 和 plugin 有啥区别

- `loader`，就是一个转换器，用来处理文件格式转换（less-loader，vue-loader）、样式转换（css-loader）、代码转换（babel-loader）等
- `plugin`，是扩展插件，用来在 loader 转换完之后做一些扩展，比如 HtmlWebpackPlugin 就是用来将 css/js 文件注入到 html 中。

## module、chunk、bundle 有什么区别？

- `module`，就是项目中的各个源码文件，一切皆模块
- `chunk`，是一个在 webpack 打包过程中根据模块之间引用关系合成的代码块，临时存在内存中，不会输出到目录下
- `bundle`，webpack 处理好 chunk 后最终输出的文件

## Webpack 怎么实现多页配置

`entry`定义多个，`HtmlWebpackPlugin`调用多次。

```js
module.exports = {
  entry: {
    index: path.join(srcPath, "index.js"),
    other: path.join(srcPath, "other.js"),
  },
  plugins: [
    // 多入口 - 生成 index.html
    new HtmlWebpackPlugin({
      template: path.join(srcPath, "index.html"),
      filename: "index.html",
      // chunks 表示该页面要引用哪些 chunk （即上面的 index 和 other），默认全部引用
      chunks: ["index"], // 只引用 index.js
    }),
    // 多入口 - 生成 other.html
    new HtmlWebpackPlugin({
      template: path.join(srcPath, "other.html"),
      filename: "other.html",
      chunks: ["other"], // 只引用 other.js
    }),
  ],
};
```

## Webpack 怎么实现懒加载

这个简单，用 import 函数就行了，比如：`import(xxx)`，import 函数会返回一个 Promise。注意其 resolveValue 是一个键名为`default`的对象。

```js
import('../sub').then(({ default }) => {
  console.log(default)
});
```

## webpack 性能优化

webpack 的性能优化主要从两方面入手：

1. 降低打包构建时长。这个主要方便程序员本地开发，以及提升测试/生产环境的构建部署速度；
2. 减小打包产物的体积。这个才是重中之重，产物体积越小，页面加载速度越快，对于用户来说感知明显。

对于降低打包构建时长来说，切入点常见的无非这么几个：

- 对`loader`构建的结果做缓存
- 减少`loader`查找范围(一般都是排除`node_modules`)，尤其是`babel-loader`一定要减少查找范围
- webpack5 的持久化缓存，永远滴神！

下面可以来看看怎么配置：

```js
module.exports = {
  cache: {
    type: 'filesystem',
  },
}
```

持久化缓存是硬件级别的，它会将生成的缓存文件写进磁盘里，但是不同于`hard-source-webpack-plugin`那种不聪明的清除策略，当内存超过一定体积的时候，webpack5会对长期没用到的缓存文件做清除。

而对于减小构建产物体积来说，则要把重点放在拆包、压缩这些方面：最小化包用`terser-webpack-plugin`、`OptimizeCSSAssetsPlugin`等，而拆包则是配置`splitChunks`，一般都是拆分`vendor`和`common`。

## 其他实践经验

- `happyPack`经实践对于速度提升并没有什么用，开启线程池估计占了不少时间；
- `hard-source-webpack-plugin`，这个插件确实能大幅度提升打包构建的时间，其原理是在打包时将缓存结果放到磁盘里面。但是它也存在一些问题，比如没法针对旧缓存做删除策略配置，这样导致的结果就是每次编译都会挤占内存空间，一些很老的缓存也没有被智能删除，最终导致内存不足，编译报错。
