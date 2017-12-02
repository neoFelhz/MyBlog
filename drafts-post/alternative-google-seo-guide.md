﻿---
title: 另类 Google SEO 技巧
tags:
  - SEO
  - Google
categories:
  - 分享镜
date: 2017-10-13 18:17:00
updated: 2017-10-13 18:17:00
---

SEO 是很多站长追求的目标，因为做好 SEO，就可以从搜索引擎带来更多的访客，意味着更多的 PV/UV。不少站长费劲心思做 SEO，也有不少专做 SEO 的付费服务。对于那些常见的 SEO 技巧，我便不必再赘言，我就来谈谈另类的 SEO 技巧让 Google 的 SEO 更上一层楼。

<!-- more -->

# 改善网站体验

Google 评判一个网站的权重，最重要的还是网站的访问体验。所以做 Google 的 SEO，你需要改善这些内容：

- 最基本的，你的网站不能有安全性问题
- 网站的加载速度
- 移动端用户体验
- 无障碍基本措施

你可以通过 Google Search Console 的 `安全问题` `抓取-抓取统计信息` `搜索流量-移动设备易用性` 等来检查上述标准。

# 站点地图

很多站长都知道，提交 `sitemap.xml` 给搜索引擎是很重要的。但是，你的站点地图也需要 SEO Friendly。
以我使用的 Hexo 为例。Hexo 官方提供了一个 [`hexo-generator-sitemap`](https://github.com/hexojs/hexo-generator-sitemap)，但是生成的站点地图并没有包括 `priority` `changefreq` 参数。这些参数对爬虫爬取网站和回访来说是很重要的。所以我博客使用的是 `hexo-generator-seo-friendly-sitemap` 插件。这个插件能生成 `priority` `changefreq` 参数。
在启用新的站点地图以后，Google 每天的爬虫爬取量和我博客的收录量都翻了将近一倍。

# 数据展现

过去，搜索引擎使用 meta tag 来获得一个页面的关键信息，所以一般的 SEO 建议就是给页面加一个较长而且详细的 description，同时添加大量 meta keyword 用于匹配；现在 Facebook、Twitter 还有 Telegram 的爬虫已经开始优先采集页面中使用 OpenGraph 标记的信息，Google 搜索引擎爬虫也已经~~无视~~ 弱化了 meta 中的 keyword，并且开始推崇使用结构化数据。所以，做 Google 的 SEO 已经不需要再用传统的 meta tag。

对于搜索结果呈现来说，过去 SEO 优化技巧就在强化语义化 HTML 和 meta description，因为这些信息将会被搜索引擎用来在搜索结果页面展示你的网站。而现在，如果

# 数据标注



# Meta Tag 优化

# 搜索结果展示