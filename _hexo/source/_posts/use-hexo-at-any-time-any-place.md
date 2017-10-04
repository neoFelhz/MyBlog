---
title: 随时随地 Hexo——我是如何使用 Hexo 的
date: 2017-05-01 12:58:27
updated: 2017-09-01 12:53:27
categories:
  - 博客栈
tags:
  - Hexo
  - Git
  - 博客
thumbnail: https://s.nfz.yecdn.com/img/thumbnails/use-hexo-at-any-time-any-place.png
---

Hexo 是一个使用 Node.js 作为构建引擎的极速、简单且强大的静态博客架构。但 Hexo 只有在安装了 Hexo 的环境上才能运行。于是我设计了一套实现 Hexo 随时随地部署、随时随地发布的方案。

<!--more-->

# 同步 Hexo 工程

Hexo 和基于数据库的动态博客或者动静分离的博客不同，博客的文章等并不是储存在数据库中，而是由主题仓库、配置的 yml 文件，还有文章的 markdown 文件组成。这些我们称作是 Hexo 的工程文件。

## 初始化 Hexo 工程文件

安装完 Hexo 后，博客的目录中会包括以下内容：

```bash
$ ls -la
total 2043
drwxr-xr-x 1 Admin 197121       0 5月   1 09:28 ./
drwxr-xr-x 1 Admin 197121       0 4月  30 19:45 ../
drwxr-xr-x 1 Admin 197121       0 5月   1 11:03 .git/
-rw-r--r-- 1 Admin 197121      65 4月   5 03:16 .gitignore
-rw-r--r-- 1 Admin 197121    2124 4月  30 23:03 _config.yml
-rw-r--r-- 1 Admin 197121 1725099 5月   1 10:39 db.json
-rw-r--r-- 1 Admin 197121   45375 4月  22 13:04 debug.log
drwxr-xr-x 1 Admin 197121       0 4月  28 22:31 drafts/
drwxr-xr-x 1 Admin 197121       0 5月   1 09:19 node_modules/
-rw-r--r-- 1 Admin 197121     796 5月   1 09:27 package.json
drwxr-xr-x 1 Admin 197121       0 5月   1 09:28 public/
drwxr-xr-x 1 Admin 197121       0 4月   5 03:16 scaffolds/
drwxr-xr-x 1 Admin 197121       0 4月  29 12:08 source/
drwxr-xr-x 1 Admin 197121       0 4月  30 23:03 themes/
```

这就是博客工程文件了。

同步文件的方法有很多种，常见的就是通过 云盘 同步和通过 Git 管理。
在这里我介绍的是通过 Git 管理和同步博客的工程文件。

> 当然，Git 是 Hexo 的 dependencies，如果你装好了 Hexo，你肯定也装好了 Git。

在你的 Hexo 的目录下使用 `git init` 初始化一个 Git 仓库。并在 `.gitignore` 中填入以下内容来排除不需要同步的部分：

```
.DS_Store
Thumbs.db
db.json
*.log
node_modules/
public/
.deploy*/
```

然后自然是 `git remote add` `git add .` `git commit -m` `git push` 将你的博客工程文件推送到远端 Repo 当中。我的博客工程文件托管在 Coding 和 Gitlab 的私有库中。

## 同步 Hexo 到另一台设备

一般教程上介绍的都是需要在远端重新安装一遍完整的 Hexo 并也初始化一个 Git 仓库，还需要 `git reset --hard` 来重置。。。我介绍另一种办法。

首先，在另一台终端上，使用 `npm install hexo-cli -g` 安装 Hexo 的基本命令行。这个是需要全局安装的。

> 如果你安装了其它辅助工具，如我使用了 gulp 压缩 html，这时候就又需要额外全局安装 gulp。

新建一个目录，并使用 `git clone` 将你的博客远端文件拉下来。cd 到你 clone 下来的目录里，直接使用 `npm install` 安装依赖。

> 这一步中 npm 会使用 `package.json` 安装依赖。`package.json` 里面已经保存了Hexo 的必备资源包信息,包括基本的 Hexo、你曾经安装过的插件等等。`npm install` 后 Hexo 环境就建立起来了。

等安装完了以后，迁移就完成了。以后在不同的设备上管理 Hexo 就像和管理 Git Repo 一样，使用 `git pull` `git add` `git commit` `git push` 指令即可。

我后来编写了一个 shell 脚本，可以实现在任何安装了 Git、Nodejs 的终端上完成一键安装 `hexo-cli` `gulp` 和执行 `npm install`（懒喵）

-----

Hexo 有一个算不上坑的地方，`page.updated` 函数当没有在 `front-matter` 定义时，是会跟随本地文件的改动日期而变动的。所以在多设备间同步 Hexo 时，需要为每篇文章指定 `page.updated` 的 `front-matter`。

## 在移动端使用 Hexo

如果你想在移动端安装 Hexo，你可以读一读这篇文章：[《手机端部署hexo博客到GithubPage》](http://droid-max.github.io/2016/12/01/Share-1/)

但是，我并不建议这么做：手机端运行的速度远远不如电脑端，甚至不如 CI。我在手机端运行一次 `hexo g` 需要花费 37s，在 CI 只需要 11s，在我的电脑上是 2.7s。所以我在移动端依然是用 Git 管理 Hexo，然后，将页面生成的部分交给 CI 平台。这就是我接下来要讲的：

# 用 CI 实现 Hexo 持续集成

在一些情况下，你不能在某个设备上安装 Hexo，比如公共电脑之类的，有时你甚至只能在代码托管的网页端用 Web Editor 修改和发布博客。这样如何实现 Hexo 的发布呢？
你需要借助 CI，借助 CI 可以实现静态页面在远端生成和自动远端部署。

如何在 CI 平台上部署 Hexo，你可以阅读我的下列文章：

- [《Hexo 持续自动化部署》](https://blog.nfz.moe/archives/hexo-auto-deploy-with-daocloud.html)
- [《用 Flow.CI 让 Hexo 持续集成》](https://blog.nfz.moe/archives/hexo-auto-deploy-with-flow-ci.html)
- [《使用 Gitlab CI 实现 Hexo 持续部署》](https://blog.nfz.moe/archives/hexo-auto-deploy-with-gitlab-ci.html)
- [《使用 Travis CI 持续构建 Hexo》](https://blog.nfz.moe/archives/hexo-auto-deploy-with-travis-ci.html)

> 你也可以将持续集成移植到 Travis CI 或者其它 CI 平台中。在 CI 安装 Hexo 和同步工程文件的过程可以参考本文之前的“同步 Hexo 到另一台设备”。

# 部署 Hexo

如果你的博客是直接在部署到 Pages 服务上的话，那么就没什么需要担心的了。因为绝大部分 Pages 都支持 Git 部署。你只要根据文档配置 `hexo-deploy-git` 即可。
但是我的博客部署在自己独立的 WebServer 上，所以需要把生成的静态页面部署到我的 WebServer。为了安全，我没有直接在 WebServer 上部署 Repo，这样就不能直接一步到位地把静态页面 deploy 到 WebServer 上。

所以，这就是我的方案：
首先，我需要将我生成的页面部署到一个公开的 Git Repo 中，在这里我选择了 Github 新建一个 Repo。至于部署方式，我之前选择使用 SSH 连接 Github 的 Repo，后来改成使用 Github 的 `Personal access token` 来获得对 Repo 的写入权限。

通过 CI 的环境变量保管 SSH 或者 `Personal access token` 是最安全的选择。在 CI 的后台添加一个环境变量，将 `Personal access token` 写入其中。然后新建一个 `deploy.sh` 文件，写入以下内容：

```bash
cd ./public #生成的静态页面会存储在 public 目录下
git init
git config --global push.default matching
git config --global user.email "username@example.com" #填入 GitHub 的邮箱地址
git config --global user.name "username" #填入 GitHub 的用户名
git add --all . #提交所有内容
git commit -m "Site updated with CI" #自动构建后的内容将全部以此信息提交
git push --quiet --force https://{设置的环境变量名}}@github.com/你的GitHub用户名/你的代码仓库名.git master
```

> 使用 SSH 也可以通过类似的方案实现。

在 CI 的 workflow 中调用这个脚本即可实现 `hexo-deploy-git` 的效果。

> 由于我在使用 Gitlab 的私有库保管工程文件，使用 Gitlab CI 持续集成。所以我直接“肆无忌惮”地直接 `hexo d` 的目标 `{Personal access token}@github.com/neoFelhz/MyBlog.git` 写进了 `hexo-deploy-git` 的配置中。严格来讲，这是非常不安全的。

然后，在 WebServer 上部署一个 WebHook，然后在 Github 的 Repo 设定中添加该 WebHook，这样可以实现 Github 上 Repo 有更新时通知 WebServer 拉去静态页面的内容到 WebServer。
