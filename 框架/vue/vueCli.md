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