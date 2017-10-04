---
title: 本博客对 sw-toolbox 的实践
tags:
  - Web
  - 前端优化
  - 博客
  - ServiceWorker
categories:
  - 实验室
date: 2017-8-3 18:06:00
updated: 2017-8-30 18:06:00
description: 本文简单介绍了 Google 的 sw-toolbox 和本博客对于 sw-toolbox 的实践，希望对大家使用 sw-toolbox 提供一些参考。
thumbnail: https://s.nfz.yecdn.com/img/thumbnails/sw-toolbox-practice.png!blogth
---

Service Worker 可能是前端的一场革命。Service Worker 开放了众多 API，是 PWA 的基石。同时，Service Worker 开放的操作 Cache Storage 的 API 更是给了一个极其方便的控制浏览器缓存的工具。

<!-- more -->

# What & why sw-toolbox

我曾经在 《[Web 性能优化（1）——浅尝 Service Worker](https://blog.nfz.moe/archives/wpo-by-service-worker.html)》一文当中介绍了 Service Worker 的离线加载特性，并且给了一份使用 Service Worker 原生 API 的样例代码。那份代码实现了基于白名单一个拦截所有请求并存储进 Cache Storage。
这份样例代码有很多缺陷：比如说不能针对路径、文件类型控制资源缓存，仅支持通过版本号管理全部缓存，对于频繁更新的内容不能起到很好的缓存效果等等。
针对动态缓存的需求，Google 推出了 [sw-toolbox](https://googlechrome.github.io/sw-toolbox/)。
Google 的 sw-toolbox 提供了一套专门为动态缓存使用的通用策略。它使用了一套类似 Express.js 路由的语法专门用于编写缓存策略。
对于加载，sw-toolbox 提供了以下选项：

* networkFirst（网络加载优先，无法返回正确状态码后 fallback 到缓存）
* cacheFirst（优先从缓存加载，cacheTank 中没有再发起网络请求）
* networkOnly（每次加载都在线加载资源）
* cacheOnly（仅使用缓存，或者不加载。可以搭配 precache 使用）
* fastest（同时发起网络请求和读取缓存，谁快就用谁。一般缓存都先于网络请求）

除了对于资源的加载来源提供了上述选项，sw-toolbox 还提供了可以便利的在 Cache Storage 中添加或删除缓存、控制缓存数量和有效期的 API；提供了一套可以快速利用 Service Worker 发起请求的 API；等等。

# How to use sw-toolbox

简单介绍了一下 sw-toolbox 以后，我介绍一下本博客对 sw-toolbox 的实践。

```javascript
var cacheVersion = "-170816";
var staticImageCacheName = "image" + cacheVersion;
var staticAssetsCacheName = "assets" + cacheVersion;
var contentCacheName = "content" + cacheVersion;
var vendorCacheName = "vendor" + cacheVersion; var maxEntries = 100;
```

首先是定义一些 Cache Storage 名称的有关变量。首先是 Cache Version，强制刷新缓存时会用的到。我将要缓存的内容分别分类为 图片(image)，静态资源(assets)，网页内容(content)和其它(vendor)。


```javascript
self.importScripts("https://cdnjs.cat.net/ajax/libs/sw-toolbox/3.6.1/sw-toolbox.js");
self.toolbox.options.debug = false;
self.toolbox.options.networkTimeoutSeconds = 3;
```

从 css.net 的公共 CDN 库载入 sw-toolbox.js、关闭 sw-toolbox 的 debug 模式、将加载方式从 Network 超时 fallback 到 Cache 的时长设置为 3s。

-----

```javascript
/* staticImageCache */
self.toolbox.router.get("/img/(.*)", self.toolbox.cacheFirst, {
    origin: /blog\.nfz\.yecdn\.com/, 
    cache: {
        name: staticImageCacheName,
        maxEntries: maxEntries
    }
});
self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
    origin: /p0\.ssl\.qhmsg\.com/,
    cache: {
        name: staticImageCacheName,
        maxEntries: maxEntries
    }
});
self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
    origin: /i\.nfz\.yecdn\.com/,
    cache: {
        name: staticImageCacheName,
        maxEntries: maxEntries
    }
});
self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
    origin: /i\.loli\.net/,
    cache: {
        name: staticImageCacheName,
        maxEntries: maxEntries
    }
});
```

对于可以缓存的图片部分，全部采用 cacheFirst 的原则，节省用户流量，提升页面二次加载速度。我总共匹配了所有可能遇到的图片的域名，包括 `s.nfz.yecdn.com` `img1.nfz.yecdn.com` `img2.nfz.yecdn.com` `i.loli.net` 等等。

------

```javascript
/* StaticAssetsCache */
self.toolbox.router.get("/css/(.*)", self.toolbox.networkFirst, {
    origin: /blog\.nfz\.yecdn\.com/,
});
self.toolbox.router.get("/js/(.*)", self.toolbox.networkFirst, {
    origin: /blog\.nfz\.yecdn\.com/,
});
self.toolbox.router.get("/static/(.*)", self.toolbox.networkFirst, {
    origin: /blog\.nfz\.yecdn\.com/,
});
self.toolbox.router.get("/fonts/(.*)", self.toolbox.cacheFirst, {
    origin: /blog\.nfz\.yecdn\.com/,
    cache: {
        name: staticAssetsCacheName,
        maxEntries: maxEntries
    }
});
self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
    origin: /cdnjs\.cat\.net/,
    cache: {
        name: staticAssetsCacheName,
        maxEntries: maxEntries
    }
});
```

我的博客对于 css 和 js 使用了基于 localstorage 的缓存机制；我不想在刷新缓存时，同时刷新 CDN、localstorage 和 Cache Storage 的缓存，所以针对 css js 都做了 `networkOnly`。

> 这样一来，我的博客会存在一个 Bug，即当用户处于离线模式时，本地 Cache Storage 缓存了对当前页面的离线、同时用户的 localstorage 已经损坏，这时候会引起页面的渲染错误。但是发生这种错误的可能性微乎其微，因为 localstorage 的缓存强度比 Cache Storage 要强。

对于字体和从公共 CDN 库上调用的文件，都是不会经常改动的（准确说几乎不会改动），全部使用 `cacheFirst`。

-----

```javascript
/* ContentCache */
self.toolbox.router.get("/archives/(.*).html(.*)", self.toolbox.networkFirst, {
    cache: {
        name: contentCacheName,
        maxEntries: maxEntries
    }
});
self.toolbox.router.get("/(tags|about|gallery|archives|links|timeline)(.*)", self.toolbox.networkFirst, {
   cache: {
        name: contentCacheName,
        maxEntries: maxEntries
    }
});
self.toolbox.router.get("/$", self.toolbox.networkFirst, {
    cache: {
         name: contentCacheName,
         maxEntries: maxEntries
    }
});
self.toolbox.router.get("/\?(.*)$", self.toolbox.networkFirst, {
    cache: {
        name: contentCacheName,
        maxEntries: maxEntries
    }
});
self.toolbox.router.get("/", self.toolbox.networkFirst, {
    cache: {
        name: contentCacheName,
        maxEntries: maxEntries
    }
});
```

根据 URI 匹配我博客的页面，采用 `networkFirst`，这样当访客在线时可以及时收到页面更新，访客离线时也能正常加载已经缓存的版本。

------

```javascript
/* VendorCache */
self.toolbox.router.get("/next/config.json", self.toolbox.networkOnly, {
    origin: /disqus\.com/,
});
self.toolbox.router.get("/api/(.*)", self.toolbox.networkOnly, {
origin: /disqus\.com/,
});
self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
    origin: /disquscdn\.com/,
    cache: {
        name: vendorCacheName,
        maxEntries: maxEntries
    }
});
self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
    origin: /referrer\.disqus\.com/,
    cache: {
        name: vendorCacheName,
        maxEntries: maxEntries
    }
});
self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
    origin: /(www\.google-analytics\.com|ssl\.google-analytics\.com)/,
    cache: {
        name: vendorCacheName,
        maxEntries: maxEntries
    }
});
```

对于 Disqus 几个域名，分别做了不同的安排。我的博客使用 `disqus.com/next/config.json` 作为访客 Disqus 连通性测试的探针，所以这个请求一定不能被缓存，只能 `networkOnly`。对于需要实时更新的一些 Disqus API 数据，也用 URI 正则匹配的方式加以 `networkOnly`。对于 Disqus CDN 的域名（主要用于加载用户头像和评论框的 css）也全部 `cacheFirst`，加快访客的 Disqus 评论框二次加载速度。
我对于 Disqus 引入的 Google Analytics 和 `referrer.disqus.com` 没有好感，同样全部缓存处理，反正并不影响我自己网站的访问统计（我自己的 Google Analytics 实现方式不同）

------

```javascript
/* NoCache */
self.toolbox.router.get("/sw.js",self.toolbox.networkFirst),
self.toolbox.router.get("/(.*).php(.*)", self.toolbox.networkOnly),
```

最后是不缓存部分和预缓存部分。对于博客中的动态部分不做任何缓存；对于 `sw.js` 采取 `networkFirst` 策略，使访客网络状态正常时更新 `sw.js`，离线时也能正常使用 Service Worker。

------

```javascript
self.addEventListener("install",
function(event) {
    return event.waitUntil(self.skipWaiting())
});
self.addEventListener("activate",
function(event) {
    return event.waitUntil(self.clients.claim())
})
```

`sw.js` 结尾部分设置 `skipWaiting` 和 `clients.claim` 以便实现每次页面加载时 Service Worker 都要强制更新。
