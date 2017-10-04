---
title: HexoKit——为国内环境优化的 Hexo 一键安装方案
tags:
  - Hexo
  - 博客
  - HexoKit
categories:
  - 实验室
date: 2017-6-06 18:37:00
updated: 2017-6-06 18:37:00
thumbnail: https://s.nfz.yecdn.com/img/thumbnails/hexokit-intro.png!blogth
---

最早萌生这个想法，是因为 Material 主题的群里有人不会安装 Hexo，亦或者是因为卡在安装过程太久。所以，我决定解决 Hexo 安装过慢的问题，向大众“普及” Hexo。

<!-- more -->

首先让我们重新阅读 Hexo 的官方文档，重新了解如何安装 Hexo，就可以了解是哪一步出了问题。

# 依赖下载太慢

安装 Hexo 的第一步自然是全套的依赖。Git 和 NodeJS 一个都不能少。在 Linux 上，实在不行直接换包管理器的源就可以解决 Git 的安装问题。不过对于异端的 Windows，就是另一个故事了。

对于 Git for Windows，现在 Hexo 官方文档是这么说的：

> 由于众所周知的原因，从上面的链接下载 git for windows 最好挂上一个代理，否则下载速度十分缓慢。

不过这个问题好解决。Github 上[这个项目](https://github.com/waylau/git-for-win)有 Git for Windows 的国内镜像。

# NPM 源半墙

`https://registry.npmjs.org/` 是 NPM 的官方源镜像，部署在 Fastly CDN 上。嗯，别看 Fastly CDN 的节点的超时过得去，实际上却时刻处于半墙状态。这也就是是为什么从 NPM 官方源下载并安装依赖非常缓慢了。
当然解决方案就是使用国内的镜像源。淘宝或者 CNPM 的源都挺好；中科大的源次之。我们可以使用 `npm config set registry` 指令换源。

# GitHub 半墙

据说在严重抗议下，Github 也算是解封了。不过，直连并使用 HTTPS 协议 `git clone` 时的速度依然让人难以忍受。
Hexo 默认主题 landscape 是托管在 Github 上的，clone 的指令是内置在 `hexo-cli` 的 `install.js` 中的。这个时候就算 npm 换源，这一步也绕不过去。看着 5kb/s 的 clone 速度也足够让我们对着 GFW 爆粗了。

# 解决方案

所以，知道了是哪里出了问题，解决方案就很简单了。
对于 Git 下载服务器被墙的问题，我们可以用镜像站解决；NPM 源被墙的问题，我们可以通过换源的方法解决；但是从 Github Clone 默认主题倒是一个很难绕过去的坎。

所以，让我们分析下 `hexo init` 会执行哪些操作。
执行 `hexo init` 时，`hexo-cli` 会在指定目录生成 Hexo 工程文件所需要的目录，如 `scaffolds`、`drafts`、`public` 等目录、`.gitignore`、`db.json`、`_config.yml` 等文件，并生成依赖列表 `package.json`。然后会根据 `package.json` 安装 Hexo 自身、安装基本插件和其它依赖如 markdown 解析器、主题语言解析器、页面生成器等。然后就是 clone 主题到 `theme/landscape` 目录下，Hexo 初始化过程结束。

所以，根据之前改造 Hexo 的工程文件实现 CI 持续集成的经验，我们会发现之前生成目录到生成依赖列表 `package.json` 这些文件都是可以直接从 Repo 中拉下来直接用的。

> 因为 `hexo init` 中 `install.js` 过程不能被介入，所以我们只能绕过 `hexo init`。

我在本地执行完 `hexo init`，在初始化好了的 Hexo 工程文件目录下执行 `git init`，分别推送到 Github 和 OSChina 的公共 Repo 中。
所以，现在 `hexo init` 将会被下述指令替代：

```bash
git clone https://git.oschina.net/neoFelhz/hexokit.git
npm install
```

现在我把所有步骤写进一个 shell 中，用户只需要在 Git Bash 中执行下述指令即可快速完成 Hexo 的全部安装：

```bash
curl http://git.oschina.net/neoFelhz/hexokit/raw/master/install.sh | sh
```

这个脚本中包含了了以下指令：

```bash
npm config set registry https://registry.npm.taobao.org
npm install hexo-cli -g
git clone https://git.oschina.net/neoFelhz/hexokit.git
rm install.sh
cd hexokit
npm install
npm config set registry https://registry.npmjs.org/
hexo version
```

这一步将完成 `hexo-cli` 的安装和初始化一个 Hexo 工程文件的操作。用户只需要安装好 NodeJS 和 Git 后即可在需要安装 Hexo 的目录下执行即可。

> HexoKit 项目 Repo 地址：
> - Github：https://github.com/neoFelhz/HexoKit
> - OSChina：https://git.oschina.net/neoFelhz/hexokit

HexoKit 需要我每月定时在本地执行一次 `hexo init`，以更新 Repo 中的目录结构和 `package.json`。
