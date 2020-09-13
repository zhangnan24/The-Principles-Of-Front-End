# 新经验

## 模式与环境变量

原来运行vue-cli有三个模式，也就是`development`模式、`production`模式、`test`模式。

- 运行`vue-cli-service serve`会进入`development`模式，`process.env.NODE_ENV`会被设置为`development`；
- 运行`vue-cli-service build`会进入`production`模式，`process.env.NODE_ENV`会被设置为`production`；
- 运行`vue-cli-service test:unit`会进入`test`模式，`process.env.NODE_ENV`会被设置为`test`；

## @vue/cli的组成

@vue/cli包括以下三个部分：

- cli。用来提供以`vue`开头的命令，如`vue create myProject`，`vue ui`等等
- cli服务。也就是`vue-cli-service`，这个是基于webpack和webpack-dev-server构建的，提供编译、打包等能力
- cli插件。一些附加的工具插件等，如Babel、Eslint、Jest等，以`vue-plugin-`开头

如果我们希望分析一下打包的文件大小，可以通过`vue-cli-service build --report`生成一个html文件来查看，由于vue-cli-service里面内置了`webpack-bundle-analyzer`，所以不需要额外去安装这个插件了。

## .browserlistrc文件是干吗的

这个文件是一个浏览器范围，被指定的浏览器会通过babel来转译ES6+代码，以及通过autoprefixer添加css浏览器前缀

## public/index.html里面的BASE_URL是咋回事

实际上`public/index.html` 这个文件并不是一个纯静态的html文件，而是一个模板，`html-webpack-plugin`在打包构建时会往里面注入很多东西。

正因为它是一个模板，所以我们可以在里面使用当前进程的环境变量（也就是process.env里面的东西），比如：

```html
<link rel="icon" href="<%= BASE_URL %>favicon.ico">
```

process.env被称作客户端环境变量，但是我更愿意称之为**当前所在进程的环境变量**，它最少会暴露出两个值：BASE_URL和NODE_ENV。

其中这个BASE_URL的值，也就是vue.config.js中publicPath的值。

## 配置多个模式

我们知道vue/cli里面内置了两个模式：development和production。

有时候我们可能需要更多的模式，这时候我们就可以在运行package.json文件时，显式地指定你希望运行的模式，如：

```shell
"serve": "vue-cli-service serve --mode dev"
```

这样就显式地指定了以dev模式来运行serve，但是这个dev模式对应什么样的配置呢？我们就需要在项目根目录下按照`.env.[模式名称]`的格式创建模式配置文件：

`.env.dev`

在这个文件里面我们可以进行如下配置：

```js
NODE_ENV=development
VUE_APP_ENV=dev
```

由于`NODE_ENV`是一个内置的保留字，它的值最好是`development`、`production`、`test`三个中的一个。我们可以在.env.dev文件中乱改它，但是这会引发一些一个尴尬的问题，那就是破坏了vue/cli内置的一些根据development和production进行的默认配置，就比如:`filenameHashing`。当你的`NODE_ENV`不等于`production`的时候，打包出来的文件根本就没有哈希值。

所以我们可以增加一个环境变量，没必要一定去做替换，在vue/cli中，可以通过`VUE_APP_[自定义字段]`这种格式来创建一个新的环境变量，这样配置会好很多。

## 关于devServer那些事

我们在调试的时候，如果后端设置`Access-Control-Allow-Origin`为指定的域名，那么本地我们起一个服务`http://localhost:xxxx`时就会因为同源策略的限制，遇到跨域的问题，从而无法访问。

```!
所谓同源策略，指的是浏览器在请求不同源（域名、协议、端口号任意一项不同）的http资源时，做出的一种安全防护措施。这里要明确一点：同源策略的对象是浏览器和服务器，换句话说：服务器和服务器之间通信是不会被限制的。
```

这正是代理的作用：当我们本地通过通过run serve跑起一个前端项目时，在localhost的相同端口（默认为8080）开启一个服务，这就相当等于我们本地的服务器，而这台服务器的名字，就叫做`devServer`。

我们为这台本地服务器配置一些两种规则：**匹配规则、转发规则。**

- 匹配规则。决定本地哪些请求的url会被发送到本地服务器上
- 转发规则。决定本地服务器接收到的url要转发到哪台远程服务器

devServer的配置可以直接写在vue.config.js中，一个普通的devServer配置如下：

```js
devServer: {
    proxy: {
        "^/api/": {
            target: "https://hefeng/weather.com",
            changeOrigin: true
        }
    }
}
```

其中： `^/api`为匹配规则，表示在代码中以`/api`开头的请求会被捕捉到。如果我们写成`/api`，那么这个匹配规则会相对不严谨，它表示一种包含关系：

- `/api` : `/xx/api`、`/apii`都可以匹配上，只要包含就行
- `^/api/`：只有`/api/xxx`这种格式的会被匹配上

target表示这个请求会被转发到哪台远程服务器，如本地请求路径为`/api/last-3-day`，实际请求地址将会是： `https://hefeng/weather.com/api/last-3-day`。

而`changeOrigin`则有点玄学：从webpack官网来看，设置为true在devServer的host为域名时可以覆盖掉一些host的默认怪异行为，和target时没有关系的。总之，设置为true比较好。



