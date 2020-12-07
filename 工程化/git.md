# 如何比较两个分支的差异

- 完整列出所有代码差异：`git diff 分支1 分支2`。（一般不会这么列，太多了）
- 列出有差异的文件路径：`git diff 分支1 分支2 --stat`。（比较常用，看看哪些文件不同）
- 对比两个分支的同一个文件代码片段有何不同：`git diff 分支1 分支2 文件路径`

示例如下：

```powershell
git diff bugFix dev

gif diff bugFix dev --stat

git diff bugFix dev src/utils/validator.js
```

# 打tag

## 为当前所在节点打tag

```powershell
git tag [tag名称] [当前所在节点]
```

其中，当前所在节点是一个可选项，如果不写的话，默认为当前HEAD所在节点。写的话，可以指定为某一次提交的commitID。

## 显示tag列表

```powershell
git tag
```

这样就可以展示出所有的历史tag。

## 展示某一次tag的详情

```powershell
git show [tag名称]
```

这个通常用来检查一下，打的tag对应的那次commit是否准确，以及列出一些文件更改差异等，主要是检查之用。

## 将tag推送到远程

```powershell
git push --tags
```
这个命令就是将本地打的tag推送到远程，非常重要。

## commit-message规范

主要就是type类型，盘点如下：

- feat 新功能
- fix 修复bug
- style 样式调整，不影响代码逻辑
- docs 新增/编辑了相关文档
- perf 代码/体验优化
- refactor 某一块彻底重构
- merge 代码合并

示例：

```powershell
git commit -m "feat: 新增了某某功能"
```

