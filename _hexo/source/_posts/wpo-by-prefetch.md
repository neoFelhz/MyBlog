---
title: Web 性能优化（2）——分析 Prefetch
tags:
    - HTTPS
    - 前端优化
    - Web
    - Prefetch
    - Resource Hint
categories:
    - 实验室
date: 2017-03-26 15:22:18
updated: 2017-09-01 12:48:18
---

对于文件的预加载的作用并不是直接加快网站的加载速度。预加载是提前准备好你所需要的资源，然后当需要的时候即可直接调用、直接完成页面的渲染，不造成阻塞。

<!--more-->

# 常见 Prefetch 用法

资源预加载是另一个性能优化技术，我们可以使用该技术来预先告知浏览器某些资源可能在将来会被使用到。如果我们正确使用这些预获取技术，可以显著提升用户的体验。

## DNS 预解析 Prefetch

DNS 预解析告诉浏览器将来我们可能会从哪里获取文件，从而提前完成 `DNS Look Up` 的操作。这意味着当浏览器真正请求该域中的某个资源时，DNS 的解析就已经完成了。
实现 DNS-Prefetch 只需要在 `<head>` 内加入：

```html
<link rel="dns-prefetch" href="//example.com">
```

> 实际上，单纯执行 DNS-Prefetch 只能够微小的提升浏览性能，因为大部分现代浏览器也都内置了预解析的功能，~~甚至在你在地址栏输入域名时就完成了预解析。开启这个优化算是聊胜于无吧。~~
> 更正一下，后来我阅读了 Chormium 的文档，得到以下信息：
> - 不用对超链接做手动 dns prefetching，因为 chrome 会自动做 dns prefetching
> - chrome 会自动把当前页面的所有带 href 的 link 的 dns 都 prefetch 一遍
> - 但是。对于一些需要跳转的域名做好预解析，最多可以减少 300~500ms 的加载时间
> 2017.09.01 更新：查了一些有关文档，Chrome 在一个域下最多只会对 8 个域名做预解析。

## 预连接 Preconnect

和 DNS 预解析有些类似，不过 Preconnect 的预连接的特点在于不仅完成 DNS 预解析，同时还将进行 TCP 握手和建立传输层协议，预先建立 socket 连接，从而消除昂贵的 DNS 查找、TCP 握手和 TLS 往返开销。
实现 `Preconnect` 只需要在 `<head>` 中加入：

```html
<link rel="preconnect" href="http://example.com">
```

> 2017.09.01 更新：在最近的测试中，Chrome 似乎不会对 Chrome 预先完成 TLS 握手。

## 预获取 Prefetching

如果我们确定某个资源将来一定会被使用到，我们可以让浏览器预先请求并下载该资源并放入浏览器缓存中。
Prefetching 有两种用法。其中 `prefetch` 为将来的页面提供了一种低优先级的资源预加载方式，而 `subresource` 为当前页面提供了一种高优先级的资源预加载。所以，如果资源是当前页面必须的，或者资源需要尽快可用，那么最好使用 `subresource`。用法如下：

```html
<link rel="prefetch" href="image.png">
<link rel="subresource" href="styles.css">
```

# Can I Use?

- DNS Prefetch

http://caniuse.com/#feat=link-rel-dns-prefetch

![0000074.png](https://i.nfz.yecdn.com/i/0000074.png)

- Preconnect

http://caniuse.com/#feat=link-rel-preconnect

![0000075.png](https://i.nfz.yecdn.com/i/0000075.png)

- Prefetching

http://caniuse.com/#feat=link-rel-prefetch

![0000076.png](https://i.nfz.yecdn.com/i/0000076.png)

> 连 IE 都支持了，Safari 和 iOS 你个辣鸡~

- Subrecource

http://caniuse.com/#feat=subresource-integrity

![0000077.png](https://i.nfz.yecdn.com/i/0000077.png)

# 实际意义

介绍了这么多，预加载和预解析有什么用呢？

首先，大家通常知道 `<script>` 标签有必要放在 `<body>` 的尾部，css 要尽可能早的加载，这已经是“业界规范”了。

但无论如何不可否认，CSS 严重影响网站的渲染，所有 CSS 尽早加载是减少首屏时间的最关键。那么在浏览器加载 DOM 树时预加载 CSS 文件可以加快网站加载速度。
既然 Web 性能优化的手段并不是非黑即白的，对于 JS 的意见不一，预加载也不是什么坏事，尤其是使用了 CDN 从引用 JS。

还有 Fonts。Fonts 大部分都是 DOMLoad 以后才会开始加载的。所以我们可以通过预加载的方式获取到字体，这样 DOMLoad 完用字体对页面进行重新渲染时就不需要再发起请求加载字体。

> 在 Preload 草案提出和得到支持以前，WebView 优化的各种奇技淫巧中中有专门在首次加载时建立一个 1px 的 iframe 专门用于放置 Prefetch 标签的，服务端通过 cookie 进行判断。

实际运用时，要根据实际情况使用预加载和预解析的技巧，可以有效加快网站访问速度。

---

本文参考资料

- [前端性能优化 - 资源预加载](http://bubkoo.com/2015/11/19/prefetching-preloading-prebrowsing/)
- [预加载系列一：DNS Prefetching 的正确使用姿势](http://delai.me/code/dns-prefetching/)
- [Google Web Fundamentals](https://developers.google.com/web/fundamentals/)
