---
title: 从 Material 主题学习开源项目管理的一点技巧
date: 2017-02-13 19:35:12
updated: 2017-02-13 19:35:12
categories:
    - 异闻堂
tags:
    - 开源
    - 项目管理
    - Git
    - GitHub
thumbnail: https://s.nfz.yecdn.com/img/thumbnails/learn-how-to-manage-a-open-source-project-from-material.png!blogth
---

我是我博客用的 Material 主题的 `collaborater` 之一。[hexo-theme-material](https://material.viosey.com) 现在在 [Github](https://github.com/viosey/hexo-theme-material) 有 [![GitHub stars](https://img.shields.io/github/stars/viosey/hexo-theme-material.svg?style=flat-square)](https://github.com/viosey/hexo-theme-material/stargazers) 和 [![GitHub contributors](https://img.shields.io/github/contributors/viosey/hexo-theme-material.svg?style=flat-square)](https://github.com/viosey/hexo-theme-material)，即将成为 Hexo 上 star 数前三的主题。
现在我把我从参与这个主题里学到的开源项目的管理技巧分享出来给大家作为参考。

<!--more-->

> 本文的缩略图分别包含了 Material 主题的项目分支网络、图标，以及用主要贡献者的名字拼出来的 Material 字样。

# Git

首先，Material 主题是在 Github 上开源的，所以 Material 主题的版本管理系统自然是 Git 。
目前公认的是，Git 是目前、也是未来很长一段时间、甚至有可能永远的是世界上最先进的分布式版本管理系统。

> 另一种著名的版本管理系统，SVN，世界上著名的集中式版本管理系统，也在向分布式发展。但可以预见的是，在未来的很长一段时间，SVN 依然不能撼动 Git 的分布式版本管理的地位。

Git 的几大特点包括使用于分布式模式、可以记录每次文件的改动、可以实现协同开发、无需管理不同版本的不同文件。如果想查看某次改动，只需要检索日志即可。
下面提到的这些项目管理的技巧全部基于 Git 的特点。

# Commit 信息格式

Git 的特点是可以记录你文件的往期动态改动记录。对于代码进行版本管理、代码追溯、质量管理时，检索 commit 日志是非常重要的。所以，如果你的 commit 信息是整齐和有条理的，那么就会方便很多。

（而且，如果你的 commit 信息记录整齐，那么别人对你的项目印象也会好很多。新来的人参与开发时，也能很快理清楚你过去的开发脉络，更好地融入开发）

我们的 commit 记录分别记录了提交的类型（新特性、修复还是重构）、改动部分（侧边栏、页脚、图标还是文章页面）和改动和目的。所以我们可以现在很轻松的进行 Code Review（以及精准地抓人来背锅），在发布新版本时也明确知道这个版本都干了什么。

> 这是 [typecho-theme-material](https://github.com/viosey/typecho-theme-material) 的 commit 日志记录。

![000067.png](https://i.nfz.yecdn.com/i/0000067.png)

> 之前只有 viosey 在开发，所有 commit 日志记录只有版本号，根本无法追溯哪一版本干了什么。后来我接坑了这个主题的开发，所以 commit 日志里简单写了这个提交干了什么。

![000065.png](https://i.nfz.yecdn.com/i/0000065.png)

> 到了开发 [hexo-theme-material](https://github.com/viosey/hexo-theme-material) 时，我们从 [`40278ed1292e782cabaaec76b6d88d7a2ce8ac12`](https://github.com/viosey/hexo-theme-material/commit/40278ed1292e782cabaaec76b6d88d7a2ce8ac12) 开始使用了新的 commit 信息规范。这是之后的 commit 记录。

![000066.PNG](https://i.nfz.yecdn.com/i/0000066.png)

想要知道我们的 commit 信息规范，可以阅读 [hexo-theme-material - Contributing Wiki - Commit message format](https://github.com/viosey/hexo-theme-material/wiki/Commit-message-format)，了解我们每一次 commit 记录的详细含义和规范。

# Branches 管理

有的时候，我们不得不面临一点“危机”——新加的功能或者特性实在太过冒险，最后出了严重的问题。
虽然 Git 提供了 Revert 功能，可以方便的直接回归某条 commit 时的代码状态。但是有一点问题就是你之前的成果都被推倒。
如果不 Revert，那么在你一条条 commit 来修复 Bug 和 push 到远程仓库之前你云端的仓库上的代码都是有问题的，而且对别人的协同开发造成不必要的麻烦。

正确做法是把有风险和较大的改动都要新建一个分支进行管理，在新的分支里进行提交。当功能已经完善以后，把分支 Pull Rquest 合并回主分支。这样，就算其它分支改残了，主分支依然是合理和完美的。而且，不同的人协同开发时，可以尽量用不同的分支，互不冲突。

> 从 [`7cd11ad840317991bdee7997bf66157634b17950`](https://github.com/viosey/hexo-theme-material/commit/7cd11ad840317991bdee7997bf66157634b17950) 开始，Material 主题的开发中，我们学习谷歌 Chrome，引入了 `canary` 的概念。在 Material 主题的仓库中，`master` 分支被高度保护，所有 PR 都必须经过 两个以上的项目参与者 Review 后才能入库，所以 `master` 分支是高度稳定的正式版本。以 `master` 为基础，我们 fork 出一份 `canary` 分支，用来存放所有未经过完善测试的代码。然后当需要作出较大改动或者重做一个新功能时，再以 `canary` 分支为基础 fork 一份新的分支进行开发，开发完毕以后再 Pull Request 合并回 `canary` 分支。当一定阶段的开发结束以后，会有项目参与者参与对 `canary` 分支的代码进行功能性测试。当验收完毕以后，`canary` 分支最后再会合并回 `master`。

想要知道我们的 Branch 命名的含义，可以阅读 [hexo-theme-material - Contributing Wiki - Branch Name Format](https://github.com/viosey/hexo-theme-material/wiki/Branch-Name-Format)。

# 更新日志

当一个阶段的开发以后，我们就会推出更新日志。对于开发者，这是对过去一段时间自己开发的总结；对于用户，更新日志是他们了解你开发成果的渠道。
一个好的更新日志可以清楚地展现你这一段时间的成果，应该包括你修复的 Bug、你新增的 Feature、你做的改动。如果有必要，你还需要列出你的突破性变更（Breaking Changes，一般这类改动会改变用户过去的操作习惯、或者需要用户对其作出新的配置，以及其它包含不向下兼容的改动）。

> 从 [1.2.5](https://github.com/viosey/hexo-theme-material/releases/tag/1.2.5) 开始，Material 主题开始采用新的更新日志格式（灵感来自于我过去制作 ROM 写发包帖的经验）。然后 viosey 参考 [Angular Changelog](https://github.com/angular/angular.js/blob/master/CHANGELOG.md) 完善了更新日志格式。我们用成熟了的更新日志格式发布了 [1.2.6](https://github.com/viosey/hexo-theme-material/releases/tag/1.2.6)。

如果想学习 Material 的更新日志规范，你可以阅读 [hexo-theme-material - Contributing Wiki - Change log format](https://github.com/viosey/hexo-theme-material/wiki/Change-log-format)。
