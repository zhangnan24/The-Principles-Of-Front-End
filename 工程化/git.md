# 如何比较两个分支的差异

- 完整列出所有代码差异：`git diff 分支1 分支2`。（一般不会这么列，太多了）
- 列出有差异的文件路径：`git diff 分支1 分支2 --stat`。（比较常用，看看哪些文件不同）
- 对比两个分支的同一个文件代码片段有何不同：`git diff 分支1 分支2 文件路径`

示例如下：

```shell
git diff bugFix dev

gif diff bugFix dev --stat

git diff bugFix dev src/utils/validator.js
```