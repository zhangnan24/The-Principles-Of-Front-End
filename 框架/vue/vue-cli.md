# 新经验

## 模式与环境变量

原来运行vue-cli有三个模式，也就是`development`模式、`production`模式、`test`模式。

- 运行`vue-cli-service serve`会进入`development`模式，`process.env.NODE_ENV`会被设置为`development`；
- 运行`vue-cli-service build`会进入`production`模式，`process.env.NODE_ENV`会被设置为`production`；
- 运行`vue-cli-service test:unit`会进入`test`模式，`process.env.NODE_ENV`会被设置为`test`；
