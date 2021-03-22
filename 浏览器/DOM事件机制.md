## 概述

1. 捕获（capture）阶段，事件从 window 对象传播到目标阶段。当用 addEventListener 监听事件时的最后一个参数为 true 时可以在捕获阶段触发事件；

2. 目标（target）阶段，目标节点处理事件的函数在此时执行；

3. 冒泡（bubble）阶段，事件从目标节点传播到 window 对象
