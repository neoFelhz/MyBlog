---
title: 本博客的优化汇总
tags:
  - 前端优化
  - Web
  - 博客
  - Hexo
categories:
  - 博客栈
date: 2017-04-23 16:25:00
updated: 2017-08-12 1:07:00
toc: false
thumbnail: https://blog.nfz.yecdn.com/img/thumbnails/optimization-of-my-blog.png
---

![0000087.png](https://i.nfz.yecdn.com/i/0000087.png)

我一直在关注我的博客的浏览体验，其中，网站的加载速度对于浏览体验来说是非常重要的。<!--more-->我见过很多菊苣的博客，他们的博客加载速度却很一般（偷笑）我现在也在写一些 WPO 方面的文章，我并不想在写如何做好优化性能的同时，自己的博客却十分缓慢。
除了 Pageseed、YSlow 常见提到的颇有些老生常谈的一些优化手段以外，我的博客也用了其它一些零散的优化点。我把它们列举在这里。

## 静态资源优化

如果你打开 Dev Tools，你会发现我的博客加载时~~除了一个用于网站统计的 `piwik.js` 以外，~~ 没有~~再~~引用任何大段的 css、js。

> 博客已经弃用 Piwik 统计服务，不再加载 `piwik.js`。

这是 `hexo-theme-material` 的一个实验性特性，首次加载利用 XMLHttpRequest 从外部加载资源并异步执行，同时将其存入 localstorage，以后加载都通过 localstorage 加载，不再发起请求。
这样做的好处有：

1. 后续访问减少连接数
2. 不怕刷新和强刷

同时，我把这些文件部署在了又拍云的 CDN，这样在页面首次加载时也不会阻塞页面的加载。

> localstorage 这项特性在 `hexo-theme-material` 1.4.0 版本中发布。

## 图片优化

`hexo-theme-material` 是很漂亮的、图文并茂的主题，这就意味着主题需要加载大量图片资源。不加载用户看不见的图片是一项最基本的优化（图片采用 lazyload）。这是老生常谈的话题，`hexo-theme-material` 也已经实现，在这里略过不谈。
除了 lazyload 博客首页的缩略图以外，博客很多小而碎的图片都使用了 `date URI` 的方式来减少小资源的引用，避免增加 Request。~~比如博客侧边栏抽屉的又拍云的 svg 格式的 logo、~~ 比如页脚的 SNS 的几个图标（页脚的图标则是将 svg 格式 ~~转码成 base64~~ 直接 inline 在 css 予以输出）

## Piwik 统计优化

Piwik 的统计和一般的统计不同在于，他们的 JS 是剥离出来的，统计时 `piwik.js` 可以不和架设 Piwik 的 WebServer 同源加载。所以我将 JS 托管在了又拍云的 CDN 上，同时改造了我的站点统计代码部分，将 JS 改到了又拍云上的 URI。以下是我修改过的示例代码。

```javascript
var _paq = _paq || [];
_paq.push(["setDomains", [ "*.example.com"]]), _paq.push(["enableCrossDomainLinking"]), _paq.push(["trackPageView"]), _paq.push(["enableLinkTracking"]), function() {
	_paq.push(["setTrackerUrl", "https://piwik.nfz.moe/piwik.php"]), _paq.push(["setSiteId", "2"]);
	var e = document,
		a = e.createElement("script"),
		p = e.getElementsByTagName("script")[0];
	a.type = "text/javascript", a.async = !0, a.defer = !0, a.src = "//cdn.example.com/piwik/piwik.js", p.parentNode.insertBefore(a, p)
}()
```

> 除此以外，和其它统计代码不同，我直接将其放在了页面底部。相比放在 `<head>` 标签之内，将 Piwik 统计代码放在页脚直接使 DOMContentLoaded 提前了 70ms 触发（大雾）

> **注：博客已经撤掉了 Piwik 统计服务，转而使用 Google Analytics。优化方案参见《[Google Analytics 异步优化方案](https://blog.nfz.moe/archives/google-analytics-optimize.html)》**

## Service Worker

静态内容非常适合做缓存，来加速页面的访问。我的博客使用了 Service Worker 技术，利用 sw-toolbox 获取和 “劫持” 请求，可以大大改善博客的二次加载的时长，还可以实现离线访问已经被缓存的页面，改善了用户的体验。

> 我的博客已经在使用 sw-toolbox 代替原生 Service Worker。我在《[本博客对 sw-toolbox 的实践](https://blog.nfz.moe/archives/sw-toolbox-practice.html)》一文中介绍了 sw-toolbox。我推荐无论是静态站还是动态站，都使用 sw-toolbox。

-----

实际上，我的博客加载不逊于 BAT 主流网站，使用了 Hexo 静态博客框架也是一个很重要的原因。Hexo 是一款基于 NodeJS 的快速、简洁且高效的博客框架，能在几秒内渲染出上百个静态页面。静态博客相对于使用动态的博客，不需要查询数据库、动态生成页面等后端延迟，可以大大提升网站加载所需的时间。
