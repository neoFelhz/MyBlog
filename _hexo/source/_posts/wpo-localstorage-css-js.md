---
title: Web 性能优化（4）——localstorage 存储静态文件的意义
tags:
    - 前端优化
    - localstorage
    - Web
categories:
    - 实验室
date: 2017-05-10 17:27:00
updated: 2017-05-10 17:27:00
toc: false
---

localstorage 并不仅仅只是”狂拽酷炫吊炸天“的黑科技。在一些特殊场景下，甚至可能会有意想不到的收获。

<!-- more -->

# 缘由

之前阅读 JerryQu 的博客时，看到他在介绍他的博客的优化方案时提到说：

> 我将常规外链转成了 inline 输出，同时存入 localStorage，之后不再输出。

2015 年在知乎上时，localstorage 技术就已经被热烈地讨论过了（[静态资源（JS/CSS）存储在localStorage有什么缺点？为什么没有被广泛应用？](https://www.zhihu.com/question/28467444)）。在知乎上，很多前端大牛都对 localstorage “颇有微词”。所以，我决定简单地研究这一方案，并表达一下我个人的看法。

# localstorage 的优点

在知乎对于该问题的回答中，最激烈的反对意见是这样的：

> 浏览器都帮你缓存好了，干嘛多此一举缓存到 LS 里？

很好，那就让我们从浏览器的缓存开始说起。

对于 css/js 传统的优化方法，最常见的便是将小的静态文件直接 inline 减少请求，大的文件、甚至全站都完整的接入 CDN，直接将文件就近推送以加快加载速度。

> 相对于 inline，HTTP2 协议下的多路复用的特性和 Server Push 的支持（Server Push 即是将一些资源文件和 HTML 在同一请求内同时从服务端推送给浏览器），可以使 inline 变得不那么重要。

CDN 除了可以就近分发，还可以设置缓存头提示浏览器缓存一些静态文件，这样当页面二次加载便不需要发起 HTTP 请求。但是，外链资源即使合理配置了强缓存头，**浏览器依然会在用户主动刷新时发起协商请求（响应码通常是 304，虽无响应正文，但依然需要建立连接）**；会在强刷时发起 `cache-control:no-cache` 和 `pragma:no-cache` 的 Request Header，忽略所有缓存，触发服务端的 200 响应。虽然用户不一定都会强制刷新，但在网络环境较差的环境下，使用 304 协商响应依然颇花费时间。

> 微信内置的 X5 内核的 WebView 当中有其它的坑：WebView 退出 10 分钟后，js/css 缓存便会失效，触发 304；WebView 进程一旦退出和重新进入后，缓存便会作废，触发 200。

所以，使用 localstorage 等效于无视用户主动刷新行为的本地强缓存，而且可以存储较大体积的数据（最小是 2M），而且永久有效。如果把 js 和 css 存储在 localstorage 中，可以省去发送 HTTP 请求从而改善用户的浏览体验。

# localstorage 的缺点

前端大牛们当时主要关心的时 localstorage 方案的响应速度：网络环境优秀时，localstorage 的响应速度会超过 304 响应的速度么？

理论上，使用 localstorage 和使用 `from disk cache` 和 `from memory cache` 的速度应该是不相上下的（当然，这需要进一步的验证和测试）。在较差的网络环境下，读取 localstorage 至少要快于 304。而且移动端由于存储大小问题，手机浏览器的缓存经常会被清理，但 localstorage 被清理的几率会低一些。

当然，使用 localstorage 最大的问题，在于 XSS 的安全问题。一旦用户的 localstorage 被篡改，那么危险将会是持久的，即使漏洞已经被修复。这是由 localstorage 的生命周期决定的。

> 关于保护 localstorage 内代码的安全，可以阅读 JerryQu 的[《使用 SRI 增强 localStorage 代码安全》](https://imququ.com/post/enhance-security-for-ls-code.html)

除此以外，大面积使用 localstorage 还需要考虑其他的问题，比如版本控制。只要一个项目还在迭代开发，就难以避免需要更新资源文件。普通的资源请求，可以根据 md5 或者在资源链接后面加上后缀 query 做标识来判断是否需要更新资源。如果用localStorage做，则需要一套新的缓存更新机制。

# 小结

CDN 方案是加速静态文件访问的一种优秀方式，但是必须要面临缓存刷新和 CDN 的压力、回源的压力的问题。
localstorage 是优秀的强缓存方案，因为 localstorage 被清空的概率不大。但是要专门注意安全问题。SRI 和 CSP 都是不错的保护 localstorage 里的代码的方案。

所以，localstorage 的方案适合以下情况：

- 同域下的每个页面都会用到的、频繁请求的文件
- 文件本身不需要经常更新，如 jQuery、一些字体
- 为移动端或较差网络环境下的特殊加载优化
- 降低源站和 CDN 的压力
- 用 base64 存储一些小的图片减少请求并缓存

# hexo-theme-material 的应用方案

在 hexo-theme-material 的开发过程中，我们参考了 [LsLoader](https://github.com/sexdevil/LSLoader) 方案，设计了一套 localstorage 的使用方案，将项目的 css 和 js，以及 footer-sns-icon 的 svg 转换成 base64 储存在 localstorage 中，利用 localstorage 强缓存的特性加快页面加载速度，以及减少页面的 HTTP Request，达到页面优化的目的。
为了避免 css 加载先后出现页面抖动等问题，我们让页面默认 `display: none` 来阻止页面渲染，在 css 中写入 `display: block`，这样在 css 加载出来前，页面不会进行渲染，也不会抖动，改善了显示体验。不过在网络环境较差环境下 css 无法及时加载，就会导致页面持续白屏。
