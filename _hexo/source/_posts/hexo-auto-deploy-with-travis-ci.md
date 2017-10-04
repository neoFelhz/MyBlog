---
title: 使用 Travis CI 持续构建 Hexo
tags:
  - Hexo
  - CI
  - 持续集成
  - Travis
categories:
  - 博客栈
date: 2017-7-31 23:28:00
updated: 2017-8-20 12:51:00
description: 鉴于使用 Hexo 部署网站的繁琐性，我将通过本文介绍如何使用 Travis CI 来完成 Hexo 的持续构建。
thumbnail: https://s.nfz.yecdn.com/img/thumbnails/hexo-auto-deploy-with-travis-ci.png!blogth
---

我已经写了三篇关于如何使用 CI 持续构建 Hexo 的文章了，现在我将博客迁移到 GitHub 上托管，所以就需要使用 Travis CI 完成持续构建了。

<!-- more -->

> 相关阅读
> - 《[使用 DaoCloud 让 Hexo 持续集成](https://blog.nfz.moe/archives/hexo-auto-deploy-with-daocloud.html)》
> - 《[用 Flow.CI 让 Hexo 持续集成](https://blog.nfz.moe/archives/hexo-auto-deploy-with-flow-ci.html)》
> - 《[使用 GitLab CI 实现 Hexo 持续部署](https://blog.nfz.moe/archives/hexo-auto-deploy-with-gitlab-ci.html)》
> - 《[随时随地 Hexo——我是如何使用 Hexo 的](https://blog.nfz.moe/archives/use-hexo-at-any-time-any-place.html)》

# 建立 Repo

根据《[随时随地 Hexo——我是如何使用 Hexo 的](https://blog.nfz.moe/archives/use-hexo-at-any-time-any-place.html)》一文，你应该使用 Git 管理你的 Hexo 工程文件。
新建一个分支 `raw`，用来存放你的 Hexo 工程文件。将 `raw` 分支 push 到 GitHub 上。

如果你不想使用 SSH 的方式完成 Hexo 的 Deploy 的话，你可以使用——

# GitHub Personal Access Token

在 GitHub 上点击页面右上角你的头像，进入 `Settings`。

<img src="https://bbs-static.nfz.yecdn.com/i/0000151.jpg" alt="0000151.jpg" style="width:50%" />

在左侧菜单的最下面、`Developer Settings` 中最后一项就是 `Personal Access Token`。

<img src="https://bbs-static.nfz.yecdn.com/i/0000152.jpg" alt="0000152.jpg" style="width:50%" />

点击 `Generate new token`。GitHub 会让你输入密码，因为这是一个危险的操作。
你需要给 Token 取一个名字，建议使用一个容易辨别的名字。权限勾选 `repo` 的全部权限，即可生成一个新的 Token。

<img src="https://bbs-static.nfz.yecdn.com/i/0000153.jpg" alt="0000153.jpg" style="width:50%" />

确定生成后，Token 将会显示在页面上，强烈建议你将其复制并保存好，同时避免泄露。遗忘 Token 后不能找回，只能重新生成。

# 配置 Travis CI

打开 [Travis CI](https://travis-ci.com) 并用 GitHub 帐号登陆完成授权，同步一下你 GitHub 帐号下的 repo 到 Travis CI，找到你博客的 repo，把左侧的开关打开。
找到已经启用自动构建的 repo，并在右侧找到设置按钮，有两处需要设置。首先需要启用 `Build only if .travis.yml is present` 选项，以避免用于 deploy 的分支被构建和、陷入构建循环的问题；在下方的环境变量设置处，我们需要设置几组环境变量，并注意保持 `Display value in build log` 处于禁用状态（默认为禁用），以免构建日志泄露重要信息。

<img src="https://bbs-static.nfz.yecdn.com/i/0000155.jpg" alt="0000155.jpg" style="width:50%" />

```
GitHubKEY = 上文生成的GitHub Personal Access Token
GitHubEMail = 你绑定在 GitHub 上的邮箱地址
GitHubUser = 你的 GitHub 用户名
GitHubRepo = 静态页面 deploy 的目标仓库名称
```

# 定义构建流程

Travis CI 使用 repo 根目录下的 `.travis.yml` 来定义构建流程。

有关于 Travis CI 配置的详细解释可以查阅[文档](http://docs.travis-ci.com/)，下面是我使用的 `.travis.yml`：

```yaml
language: node_js
dist: trusty
node_js:
  - "7"
install:
  - npm install hexo-cli -g
  - npm install
script:
  - chmod +x ../deploy.sh
  - hexo clean
  - hexo g
  - ../deploy.sh > /dev/null
branches:
  only:
    - raw
```

其中，部署生成的静态页面我使用了一个 `deploy.sh`。接下来我就来介绍一下这个脚本是如何替代 `hexo d` 和 `hexo-deployer-git` 的。

```bash
cd ./public # Hexo 生成的目录默认在 public 下
git init # 初始化一个 Repo
git config --global push.default matching
git config --global user.email "${GitHubEMail}"
git config --global user.name "${GitHubUser}" # 利用在环境变量中定义的信息配置 Git
git add --all .
git commit -m "Auto Builder of ${GitHubUser}'s Blog" # commit 信息
git push --quiet --force https://${GitHubKEY}@github.com/${GitHubUser}/${GitHubRepo}.git master # 将生成的静态整站部署到指定 Repo 的 master 分支。
```

# 分支保护

为了防止你不小心将 Hexo 生成的静态整站覆盖了存放工程文件的分支，你需要对存放工程文件的分支开启写保护。
进入 Repo 的 `Settings`，在 `Branches` 选项卡中 `Protected Branches` 选中存放你的 Hexo 工程文件的分支，只勾选第一个勾 `Protect this branch` 即可。点击 `Save Changes` 保存。

> 因为在 Travis CI 构建时，是使用 `git push --quiet --force` 完成 deploy 的，所以对 Hexo 工程文件所在分支进行写保护（即禁止 Force Push）可以有效保护你的工程文件。

# 加密 Personal Access Token

Travis CI 的环境变量相对可靠。但 GitHub Personal Access Token 权限太大，不能轻易暴露出去。所以如果你对 Travis CI 不太放心，那么可以用 Travis 命令行工具对其进行加密。

在本地配置好 Ruby 环境后，执行

```bash
gem install travis
travis login
```

安装 Travis 命令行工具并登陆。

```bash
travis encrypt 'GitHubKEY=< 这里填入你生成的 Token >' --add
```

上面命令会在 `.travis.yml` 中添加如下内容：

```yaml
env:
  global:
    secure: QAH+/EIDC/Jg...
```

上面的一长串字符串就是加密后的环境变量。之后，在 Travis 执行脚本时，就可以直接使用该环境变量了。由于已经在 `.travis.yml` 里完成 `env` 的定义，你就不需要在 Travis CI 后台配置 `GitHubKEY` 变量了。
