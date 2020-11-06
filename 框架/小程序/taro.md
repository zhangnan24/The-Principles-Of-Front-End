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

4. 新建一个包含默认模板的页面

```powershell
taro create [页面名]
```

5. taro项目中的app.config.js或者app.config.ts，就相当于小程序中的app.json，用来配置全局的tabBar、主题颜色、页面路由之类