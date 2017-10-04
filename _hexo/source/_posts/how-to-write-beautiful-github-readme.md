---
title: 如何写好一个开源项目的 README
tags:
  - README
  - GitHub
  - Coding
  - Markdown
categories:
  - 分享镜
date: 2017-10-2 14:07:00
updated: 2017-10-2 14:07:00
thumbnail: https://s.nfz.yecdn.com/img/thumbnails/how-to-write-beautiful-github-readme.png!blogth
---

README 是一个项目的门面。如果你想让更多人使用你的项目或者给你的贡献 PR、丢 star，你就应该写一个吸引人的 README。

<!-- more -->

# Logo

无论如何，项目有一个 logo 是一个加分项。一个生动活泼的 logo 能吸引很多人的注意。如果没有 logo，那么就学习 Material 主题、把一张漂亮的预览图丢在 README 开头吧~

> 就像这样 ↓↓

<p align="center">
<img src="https://i.nfz.yecdn.com/i/0000180.png" alt="Material Render Phone" width="80%">
</p>

logo 当然需要居中放置，所以我们不能使用 markdown 语法来添加图片，而应该使用 html。正确做法就像这样：

```html
<p align="center">
<img src="https://i.loli.net/2017/09/07/59b1367f76fdb.png" alt="Material Render Phone">
</p>
```

# 项目名称

同样的，如果想要突出项目的名称，应该同样让其居中。带上 `<a>` 标签链接到项目的官网（如果有的话）那也是极好的。

```html
<h1 align="center"><a href="https://material.viosey.com" target="_blank">Material Theme</a></h1>
```

# Slogan

然后是 slogan。slogan 要么耍帅要么优雅。我列举几个项目的 slogan 吧~

> - Nature, Source | 原之质，物之渊 —— [hexo-theme-material](https://github.com/viosey/hexo-theme-material/tree/2.x-develop)
> - 🍭Wow, such a powerful music API framework —— [Meting](https://github.com/metowolf/Meting)
> - A magical documentation site generator. —— [docsify](https://github.com/QingWei-Li/docsify)

需要注意的是，你的项目 README 中的 Logo 和名称应该要能够完整地出现在手机版 GitHub 页面内。当然，如果 slogan 也在那就更好了。

![0000181.png](https://i.nfz.yecdn.com/i/0000181.png)

# Badge

README 里面一定不能缺少 Badge。Badge 可以形象的把大部分项目的信息、比如版本号、依赖、构建状态等等展示出来。
比如说，hexo-theme-material 添加了这几个 badge：

- Version
- Author
- Hexo Version
- NodeJS Version
- Travis Build Status
- Download

![](https://i.nfz.yecdn.com/i/0000182.png)

这里当然要推荐 [Shields.io](https://shields.io)，绝大部分常见的 GitHub Badge 都是用这个网站生成的。

# 介绍

接下来就应该是对项目的介绍了。README 需要解答下面这些问题：

- 这个开源项目是做什么的
- 项目维护、CI、依赖更新状态
- 项目可用版本及其他版本、并且应该如何下载它们
- Demo 或官网地址（如果有）
- License

这就是对项目的简单介绍。当然，除了需要上述信息能对用户对你的项目有一个简单的印象，你还需要在 README 中写一些关于项目的介绍。

- 如何下载这个项目
- 项目依赖
- 安装方式
- 部署方法（如果项目可以被部署的话）
- Debug 方法
- 文档

由于 Material 是 Hexo 的一个主题，所以我们在 README 中只介绍了下载方式，然后我们提供了一个链接通往我们的文档。

-----

基本这就是一个 README 需要包括的内容了。当然，书写项目 README 时候还需要遵守排版规范。这里是 [Neko-Dev 的文案风格 GUIDELINE](https://neko-dev.github.io/GUIDELINE/#/others/copywriter)


