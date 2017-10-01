---
title: Web 性能优化（1）——浅尝 Service Worker
tags:
    - Service Worker
    - 前端优化
    - Web
categories:
    - 实验室
date: 2017-03-26 13:01:18
updated: 2017-09-01 12:48:17
thumbnail: https://blog.nfz.yecdn.com/img/thumbnails/speedy-by-service-worker.png!blogth
---

静态内容非常适合做缓存来加速页面的访问，除了使用 CDN 实现加速之外，通过客户端也可以实现更好的访问体验。本文就利用 Service Worker 来探讨基于静态资源的加速方案。

<!--more-->

> ~~ServiceWorker 对动态页面依然有效，但是效果不如静态站效果显著。~~
> 对于动态页面，Google 推出了 sw-toolbox，借助 Service Worker 的一系列接口实现了更强的缓存 API 和网络加载请求处理，使其能适合动态页面缓存。我也在《[本博客对 sw-toolbox 的实践](https://blog.nfz.moe/archives/sw-toolbox-practice.html)》一文中介绍了 sw-toolbox。我推荐无论是静态站还是动态站，都使用 sw-toolbox。

Service worker 是 PWA 这类 WebApp 的重要支持，因为可以使 web 支持离线体验。除此以外，Service Worker 还支持通知推送和后台同步。当然这里我们用的是它离线加载的特性来优化网站体验。

# 启用 Service Worker 支持

## 在首页添加 Service Worker 注册代码

```html
<script>
if ('serviceWorker' in navigator) {
 navigator.serviceWorker.register('/sw.js');
}
</script>
```

这段代码向下兼容 Service Worker，检测浏览器是否支持 Service Workers。如果支持就会根据 `sw.js` 注册 Service Workers 服务。如果浏览器不支持就不会注册。

## 添加 Service Workers 所需文件

你可以从[这里](https://gist.github.com/neoFelhz/50800b701d00dc6d874be95da2cd7655)下载到所需的文件，将其放在网站根目录下。

- `sw.js`
- `offline.svg`
- `offline.html` 你可以用 Hexo 生成一个独立页面，也可以自己写一个。

> 由于 Service Worker 的离线加载特性，在浏览者离线以后依然可以访问已经缓存了的页面。但是对于没有缓存的页面和图片，你可以通过 `offline.svg` 和 `offline.html` 加以提示。

修改 `sw.js` 中的下述内容。

```javascript
const ignoreFetch = [
  /https?:\/\/cdn.bootcss.com\//,
  /https?:\/\/www.google-analytics.com\//,
  /chrome-extension:\/\//,
];
```

这部分定义了你不需要缓存的资源，用的是正则表达式对资源进行匹配。这里给出了按域名进行排除的例子。如果你无法判断哪些资源不需要缓存，请用 F12 打开 Dev Tools 的 Source 选项卡逐个加以筛选；如果还不会，就把你看到的所有不是源站的域名统统输进去。

# 加速效果

这是第一次访问的效果。

![0000071.png](https://i.nfz.yecdn.com/i/0000071.png)

可以看到，第一次访问不能算太理想，花费 1.39s 才完成了 DOMLoad，所需资源全部加载完实际上花了 1.69s。

> 可以看到，实际上网络资源花费了 3.11s 才加载完。我特意截图了最后加载的几个有齿轮标识的资源。~~这些是 ServiceWorker 在 `sw.js` 里加载的资源——offline.svg 和 offline.html。~~博客更新以后，离线提示页面被下线，不会再加载 offline.svg 和 offline.html。

![0000072.png](https://i.nfz.yecdn.com/i/0000072.png)

这是第二次访问的效果。DOMLoad 只花费了 571ms，全部资源加载只需要 608ms。可以看到，很多资源 `from  ServiceWorker`。说明 ServiceWorker 拦截了请求，直接从 ServiceWorker 获得资源。

> 看见没有？连 `blog.nfz.moe` 都被 ServiceWorker 拦截了，现在你知道为什么可以离线加载了吧。

# 先决条件

## HTTPS

你的网站必须 **完整使用  HTTPS 进行加密**！ServiceWorker 一旦被注册，除非有进行定义、或者访问者手动在 Dev Tools 内 Unregister 了 ServiceWorker，否则你的资源都将被 ServiceWorker 接管，一旦访问者第一次加载资源时被攻击或者被劫持，后果则不堪设想。在开发过程中，可以通过 `localhost` 予以调试，但是生产环境必须高度可靠。

## Can I Use?

http://caniuse.com/#feat=serviceworkers

![0000073.png](https://i.nfz.yecdn.com/i/0000073.png)

根据 Google 的文档表明，Chorme、Firefox 和 Opera 都支持；Microsoft Edge 现在表示公开支持。Safari 也暗示未来会进行相关开发。

-----

参考文章：

- [使用Service worker实现加速/离线访问静态blog网站](https://yangbo.tech/2017/01/15/2017-01-15-speedy-and-offline-site-by-service-worker/)
- [Service Workers 实现网站加速和离线缓存](https://www.anotherhome.net/2954)
- [Service Workers 与离线缓存](https://segmentfault.com/a/1190000008491458)

以及 Google 的 [ServiceWorker](https://developer.google.com/web/fundamentals/getting-started/primers/service-workers) 有关文档。
