# 简介

因为 koa 之前已经玩过了，所以，就搞搞 express。

## 项目中安装

```powershell
npm i express
```

## 基础配置

```js
const express = require("express");

const app = express();

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
  res.send("hello express");
});

app.listen(app.get("port"), () => {
  console.log(`server is running on port ${app.get("port")}`);
});
```
