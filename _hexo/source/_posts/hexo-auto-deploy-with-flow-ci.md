---
title: 用 Flow.CI 让 Hexo 持续集成
tags:
  - CI
  - Hexo
  - 持续集成
  - Flow.CI
categories:
  - 博客栈
date: 2016-12-01 13:40:16
updated: 2016-12-01 13:40:16
thumbnail: https://s.nfz.yecdn.com/img/thumbnails/hexo-auto-deploy-with-flow.ci.png
---

[Flow.CI](https://Flow.CI) 是一个由著名移动应用公测平台 [Fir.im](https://fir.im) 推出的持续集成（CI）的 saas 服务平台，感觉就是中国的 Travis.CI，作用是把你 Github 或者 Coding 上的代码拉过来，通过容器技术自动化完成代码的构建、测试、交付和部署。整个对 Flow.CI 使用下来的感受就是简洁和美观，配置方便，速度很快。

<!--more-->

虽然内测阶段我没有拿到邀请码，但是我至少参加了公测。~~目前 Flow.CI 依然在公测，所以依旧免费~~公测早就结束了，现在要付费了。
跟 Daocloud 的代码构建相比，Flow.CI 是更纯粹的持续集成/部署平台。

# 基本思路

- 关闭 Daocloud 持续集成功能
- 配置 Flow.CI 持续集成
- 增加触发器
- 在本地提交 Hexo 主项目修改的`git commit`进行测试。

# 准备工作

如果之前用的是 Daocloud 的持续集成服务，首先是禁用 Daocloud 的持续集成，在 Daocloud 的控制台关掉持续集成。
如果以后再也不用 Daocloud 了，那么建议你把`daocloud.yml`和`dockerfile`两个文件删除。虽然不删除也不影响部署，但是这两个配置文件并没有起任何作用。

# 创建持续集成项目

这一步很简单，按照 Flow.CI 控制台里面的按钮顺着点“创建项目”->选择 CODING 代码托管库->选择你的用户->选择你的项目。完成！

这时 CODING 里面的项目会有两处变化：

- 新增了 Flow.CI 的 webhook
- 新增了项目下的部署公钥（只读）

# 创建并设置工作流
![0000035.png](https://i.nfz.yecdn.com/i/0000035.png)
接下来点击“创建你的第一个工作流”，开始设置部署流程。
由于Hexo的所需环境是Node.js，所以选择Node.js，版本选择最新的6.6.0。

接下来就会进入到工作流定义界面。

![0000036.png](https://i.nfz.yecdn.com/i/0000036.png)

## 触发器
触发器自然是选择对所有分支的Push、对所有的Tag进行匹配。当然你也可以设置每天定时运行。

## 初始化
保持默认即可，初始环境变量（Flow.CI提供）和Node.js的组件版本等信息。

## Git 仓库克隆
保持默认即可，拉取你的仓库。

## 缓存
保持默认即可，使用缓存可以大大加快下一次部署的速度。

## 安装
保持默认即可。使用 `npm install` 指令安装依赖项，而安装的依赖项基于你仓库中的 `package.json`

## 自定义脚本
在左侧的工作流定义的“安装”与“测试”之间的 + 号，添加一个节点“自定义脚本”

![0000037.png](https://i.nfz.yecdn.com/i/0000037.png)

我们的脚本要执行的有：

- Hexo 命令行的安装
- Hexo 静态站点的生成和部署

在这个节点输入以下脚本：

```yaml
# 安装 Hexo 命令行工具
flow_cmd "npm install hexo-cli -g" --echo
# 准备并安装私钥
flow_cmd "cp .daocloud/id_rsa ." --echo
flow_cmd "chmod 600 ./id_rsa" --echo
flow_cmd "eval $(ssh-agent)" --echo
flow_cmd "ssh-add ./id_rsa" --echo
# 执行 Hexo 生成和发布
flow_cmd "hexo clean" --echo
flow_cmd "hexo g" --echo
flow_cmd "hexo d" --echo
```

## 测试
在右上角把这个节点删除。我们不需要执行 `npm test`。

## 完成后
如果你打算让Flow.CI每次部署成功后都给你发邮件，可以在这里设置。默认会给你的注册时用的邮箱发邮件。

# 手动测试
回到构建列表，点击手动构建，选择你的分支开始构建，之后会看到整个工作流的执行过程和日志信息（绿色为成功，蓝色为正在执行，灰色为等待，红色为停止或失败）。
然后写一篇博客（庆祝一下你配置了 Flow.CI 嘛），然后用 `git commit` 和 `git push` 推送到你的仓库，看一下你的Flow.CI是否开始了自动运行。

# 小结
本文介绍了从 Daocloud 进行持续集成/部署改造为 Flow.CI 进行集成/部署的过程，今后的使用和之前的方式一样，向仓库提交 push 就可以触发自动部署。
和 Daocloud 的代码构建相比，Flow.CI 的优点如下：

- 更简单、直观的方式，更容易理解（但是并不像配置一个 yml 那样 Geek，对吧？）
- ~~更加丰富的触发方式（比如支持正则表达式匹配 commit 信息）~~其实这个优势并不明显
- 方便地配置环境（而不需要像 Daocloud 一样，需要先生成一个带着 node.js 和 hexo 的 image，用来搭建一个 docker 作为运行环境）
- 控制台界面比 Daocloud 要漂亮得多（美，才是驱动开发的第一生产力！）
