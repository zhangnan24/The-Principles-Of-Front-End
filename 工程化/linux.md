# 常用命令大全

## NPM部分

1. 查看npm全局安装过的插件

```powershell
npm ls -g -depth=0
```
这里的-depth=0是为了只看第一个层级的插件，如果不限制depth的层级，将默认展示全部层级，这样阅读起来就很困难。
在linux中，ls也就是list的简写。

2. 查看npm的配置（比如当前npm用的是哪个镜像源等）

```powershell
npm config ls
```

3. 删除当前目录下的所有文件和子目录

```powershell
rm -rf *
```

这里的rm是remove的意思，-r是recursive，也就是递归，加上递归后就可以删掉一些子目录的文件；-f是force的意思，表示强制删除。
如果我们只用`rm -f *`，不递归删除，那么子目录及子目录里面的内容仍将不会被删除，亲测如此。

4. 创建新的目录

```powershell
mkdir [目录名]
```
这是个很有名的命令，mkdir即是make directory的简写。

5. 创建新的文件

```powershell
touch [文件名]
```

注意这里是要加上文件类型的，如`touch a.js`。