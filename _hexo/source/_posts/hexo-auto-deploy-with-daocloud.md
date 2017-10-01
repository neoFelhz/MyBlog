---
title: 使用 DaoCloud 让 Hexo 持续集成
tags:
  - 持续集成
  - CI
  - Hexo
  - DaoCloud
categories:
  - 博客栈
date: 2016-11-29 20:51:00
updated: 2016-11-29 20:51:00
thumbnail: https://blog.nfz.yecdn.com/img/thumbnails/hexo-auto-deploy-with-daocloud.png!blogth
---

用 Hexo 搭建好博客，使用起来算方便，而且静态页面使用起来很方便，但是每次还要在安装了 Hexo 环境的机器上才能写文章和发布。能不能在任何地方只要新增或修改了 post 就自动生成并部署 hexo 呢？

<!--more-->

# 实现思路

- 用 CODING 开源社区对 Hexo 项目的源码进行管理（master 分支，要配置好 Hexo 部署信息）
- 在 Daocloud 上进行 Hexo 环境的构建
- Daocloud 通过持续集成功能自动生成静态页面
- 通过 FtpSync 插件上传到我的虚拟空间

![0000029.jpg](https://i.nfz.yecdn.com/i/0000029.jpg)

# 需要的东西

- [Hexo](https://hexo.io)——静态页面生成器
- [CODING.NET](https://coding.io)——中国版 Github，可以拥有免费无限私有项目。
- [Daocloud](https://www.daocloud.io)——中国版 Docker hub，而且还能持续集成。

# 开始配置

首先自然是根据Hexo的官方文档对Hexo进行基本的配置。然后是创建一个**私有仓库**把Hexo文件夹push到你建好的私有仓库中。

## 通过`master`构建Hexo基础运行环境镜像
国内貌似也没找到什么合适的、支持Coding的CI平台，最后我找到了Daocloud。Daocloud可以根据dockerfile自动构建Docker私有镜像并同时进行持续集成的能力。所以可以把Hexo及其运行环境（node.js）打包成一个镜像。
1. 编写DockerFile。

```dockerfile
#Dockerfile
FROM node:slim
MAINTAINER 你的用户名 你的邮箱

# 安装git、ssh等基本工具
RUN apt-get update && apt-get install -y git ssh-client ca-certificates --no-install-recommends && rm -r /var/lib/apt/lists/*
# 设置时区，不知道为什么？
RUN echo "Asia/Shanghai" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata
# 只安装Hexo命令行工具，其他依赖项根据项目package.json在持续集成过程中安装
RUN npm install hexo-cli -g
EXPOSE 4000
```

2. 在Daocloud的控制面板内的代码构建选项卡内，选择“创建新项目”
 - 输入你的应用名
 - 设置代码源的地方绑定你的Coding或Github，并绑定你建立好的Repository。
 - 开启持续集成
 - 执行环境设在国外（The GirlFriend Wall越来越高了，有时连npm都执行不了）
 
![0000030.png](https://i.nfz.yecdn.com/i/0000030.png)

 - 镜像选择发布在“镜像仓库”中（这个镜像仓库是私有的）


## 通过 DaoCloud.yml 定义流程

```yaml
#Daocloud.yml
image: daocloud.io/<你的用户名>/<你的应用名>:latest  #使用已经在上一步创建好的Hexo基础环境镜像（并不包括博客项目源码）
install:
 - npm install
before_script:
script:
 - hexo clean
 - hexo g
 - hexo d
```

> yml当中有一段`before_script`，这个是用户自定义脚本。如果说你是在用Github
或者Coding的Pages服务，需要把生成的静态页面push到你的Repository中，你就需要用SSH使Daocloud和Repository连接。配置SSH的具体用法见文章最后附录。

> 在install过程中才进行了npm install，并没有在镜像构建时进行依赖项安装，这是因为依赖项安装过程根据不同用户的Hexo的配置和安装的功能不同而不同（`package.json`中记录的不仅仅是Hexo依赖项，还有用户装了的插件），并没有通用性，而且本身它就属于build过程，尽管花费时间稍长（平均耗时90秒），但是这样更科学。

接下来是对Daocloud进行配置。
- 在设置选项卡中设置用`daocloud.yml`定义流程。
- 镜像构建中两个勾都选上。

![0000032.png](https://i.nfz.yecdn.com/i/0000032.png)

- 触发规则按照如图所示的定义。

![0000031.png](https://i.nfz.yecdn.com/i/0000031.png)

## 大功告成
之后写文章发布就是使用`git commit`而不是`hexo g`和`hexo d`了。只要提交以后，持续集成平台就会自动生成静态网页并发布。



# 附录
## 关于daocloud.yml

Daocloud如今已经开始用daocloud YAML 2.0定义流程了（1.0版本的YAML于9月份停用了）,然而本篇博客中的依然是YAML 1.0，所以请自行按照网页提示进行YAML升级。

![0000033.png](https://i.nfz.yecdn.com/i/0000033.png)

## HexoAutoBuildScript项目

本文提到的有关的dockerfile和daocloud.yml（包括1.0和2.0）开源在Github上，并包括更加详细的使用教程

- [项目地址](https://github.com/neoFelhz/HexoAutoBuildScript)
- [使用教程](https://github.com/neoFelhz/HexoAutoBuildScript/wiki)
