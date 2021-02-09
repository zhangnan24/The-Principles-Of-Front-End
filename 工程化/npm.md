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

tips：在linux中，ls就是list的意思，也就是以列表形式展开。

## 通过patch-package给node_modules某个包打补丁

这个操作，一般是用来修改第三方依赖库的错误。

我们安装一个依赖库，会将其代码下载下来，存放到本地项目的`node_modules`目录中，而在项目提交时，`node_modules`理所应当的是要被写进git忽略名单（`.gitignore`文件）中的。

这时候就会遇到一个尴尬的问题：我们修改了本地`node_modules`目录下的源码，但是我们的这次修改并不会被推送到远程。当远程需要拉取依赖库时，会根据我们项目的`package.json`文件重新去npm市场下载，于是又重新下载了一个错误的依赖。

当然，这种情况是很少的，而且实事求是来说，作为使用者去更改源码中的逻辑细节，往往容易触发一系列bug，因为我们只着眼于解决自己的需求，而忽略了对程序其他部位的兼容。

还是来简单看下patch-package的用法吧：

1. 通过`yarn add patch-package`安装打补丁工具；
2. 在node_modules目录中找到要更改的代码，如并更改它；
3. 本地通过`yarn patch-package <你刚刚更改的依赖名，如react>`;
4. 接着这个命令运行成功后会在项目根目录下创建一个patches目录，目录內包含一个.patch文件（这步在mac中似乎必须要有xcode才能成功运行）；
5. 在远程的依赖安装命令中，增加打入补丁的命令，如：`yarn && yarn patch-package`，用来在安装依赖完成后，将patch文件打入远程的node_modules中。

这里并不是很推荐重新定义postinstall，我们大体知道，一次install会经历**preinstall --> install --> postinstall**等阶段。但是在远程流水线的shell脚本中，为了确保安装顺利进行，常常会定义类似`npm install --ignore-scripts`的语句。这个时候我们照着官网重新在script中定义的`"postinstall" : "patch-package"`是会被忽略的。所以这里其实加多一条命令会是更好的做法。