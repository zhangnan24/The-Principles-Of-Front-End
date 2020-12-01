# 常用命令大全

1. 删除当前目录下的所有文件和子目录

```powershell
rm -rf *
```

这里的rm是remove的意思，-r是recursive，也就是递归，加上递归后就可以删掉一些子目录的文件；-f是force的意思，表示强制删除。
如果我们只用`rm -f *`，不递归删除，那么子目录及子目录里面的内容仍将不会被删除，亲测如此。

2. 创建新的目录

```powershell
mkdir [目录名]
```
这是个很有名的命令，mkdir即是make directory的简写。

3. 创建新的文件

```powershell
touch [文件名]
```

注意这里是要加上文件类型的，如`touch a.js`。