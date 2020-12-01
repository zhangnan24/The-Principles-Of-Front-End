# 常用命令

## 全局更新某个安装包

```powershell
npm update -g [依赖名]
```

如执行`npm update -g yarn`来更新yarn到最新版本。

## 查看npm全局安装过的插件

```powershell
npm ls -g -depth=0
```
这里的-depth=0是为了只看第一个层级的插件，如果不限制depth的层级，将默认展示全部层级，这样阅读起来就很困难。
在linux中，ls也就是list的简写。

## 查看npm的配置（比如当前npm用的是哪个镜像源等）

```powershell
npm conf ls
```

## 卸载某个安装包

install是安装，对应的卸载命令为uninstall。

如果我们需要全局卸载某个东西，那就可以执行：

```powershell
npm uninstall -g [依赖名]
```

```!
tips：在linux中，ls就是list的意思，也就是以列表形式展开。
```