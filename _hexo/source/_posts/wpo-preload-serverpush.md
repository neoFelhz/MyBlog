---
title: Web 性能优化（5）——Preload 和 Server Push
tags:
  - Web
  - HTTP2
  - Preload
  - 前端优化
  - Resource Hint
categories:
  - 实验室
date: 2017-6-23 18:17:00
updated: 2017-9-1 1:10:00
thumbnail: https://s.nfz.yecdn.com/img/thumbnails/wpo-preload-serverpush.png!blogth
---

相比使用 Prefetch 之类的技术让浏览器提前准备好将来需要的资源，Preload 是让浏览器在加载页面时提前准备好这个页面所需要的资源。

<!-- more -->

在之前的[《Web 性能优化（2）——分析 Prefetch》](https://blog.nfz.moe/archives/wpo-by-prefetch.html)中，我介绍了 Prefetch 对于前端优化的重要性。

在开发过程中，我们经常会碰到这样的情况，有些资源由于依赖管理、条件加载、加载顺序控制等等的原因，不需要立即在页面上执行，但是又需要尽早获取。
应对这类问题的传统的解决方案是：

- 用 JS 动态地插入元素
  - 缺陷：script 不能延迟执行
- XMLHttpRequest 异步加载
  - 缺陷：浏览器无法根据资源类型进行预判并优化加载，造成性能问题；大量加载脚本会 Block 页面的加载进程。

> 我在[《Web 性能优化（2）——分析 Prefetch》](https://blog.nfz.moe/archives/wpo-by-prefetch.html)中，还介绍了一种针对 WebView 的奇技淫巧：服务端根据 cookie 判断页面是否为首次加载，如果是则会返回的 HTML 中包含一个 1px 的 iframe 用于承担 Prefetch 的代码片段。

# Preload

Preload 是解决文首的问题的一个新的解决方案：

- 与页面逻辑分离，基本不阻塞加载

> 指不影响页面加载进程。实际上 Preload 资源时会占用一部分带宽，在移动端上尤为明显

- 资源提前加载但不会被使用
- 优先级高，不像 Prefetch/Subresource 那般模棱两可

## 使用方法

使用 `<link>` 标签设置需要的预加载的元素。

- rel：`preload`
- href：用来定义需要 Preload 的资源。
- as：用来指定资源的类型，使浏览器能够确定优先级、根据资源类型发送合适的 `Accept headers`、判断资源能否复用。

> 具体用法，可以查看一下 [ W3C 关于 Preload 的标准](https://w3c.github.io/preload/)

## 使用场景

- 加载”隐性“资源

一些非标签资源，比如在 css 内定义的资源如图片。由于“隐藏”在 css 中，大部分浏览器不能判断资源优先级，所以导致 css 中的资源优先级不够高、被“搁浅”。

```html
<link rel="preload" href="logo-island.png" as="image">
```

- 加载字体

加载字体的规则异常复杂。有些重要的字体等到真正加载的时候已经晚了。

```html
<link rel="preload" href="MaterialIcons-Regular.woff2" as="font" type="font/woff2" crossorigin>
```

> 需要注意，字体即使符合同源策略也需要加上 crossorigin 属性。

- JS 的只加载而不执行

```javascript
var preload = document.createElement('link');
preload.href = 'https://cdn.bootcss.com/fullPage.js/2.9.4/jquery.fullpage.min.js';
preload.rel = 'preload';
preload.as = 'script';
document.head.appendChild(preload); 
```

```html
<link rel="preload" as="script" href="https://cdn.bootcss.com/fullPage.js/2.9.4/jquery.fullpage.min.js">
```

- 基于标签实现的 css 异步加载

```html
<link rel="preload" as="style" href="async_style.css" onload="this.rel='stylesheet'">
```

> 渲染页面框架的重要 css 不建议异步引入；如果 css 加载过慢或者 onload 不能及时触发会导致页面抖动。
> 这是一个很有意思的设计，是比 loadcss 更简单的 css 异步加载方案。比如使用这种方法加载谷歌字体库的字体 css，可以避免因为访客连通性不佳而彻底影响页面内容的渲染。

- 响应式加载

```html
<link rel="preload" as="image" href="map.png" media="(max-width: 600px)">
<link rel="preload" as="script" href="map.js" media="(min-width: 601px)">
```

# Server Push

Server Push 是 HTTP2 的一项新特性。当客户端请求 HTML 文件时，服务端同时将其它重要资源随 HTML 在同一个资源中一并发送给用户。这样不仅节省了请求，还避免了重要资源阻塞了页面渲染和加载。

![0000123.png](https://i.nfz.yecdn.com/i/0000123.png)

在目前 W3C 的草案中使用了 Link Preload 响应头标记 Server Push。你可以看到页面响应类似如下所示的 Header：

```
Link: </app/script.js>; rel=preload; as=script
```

> 目前 Nginx ~~尚不~~ 没有直接支持 Server Push，在 Apache 中支持 Server Push 但是需要 `mod_http2` 的配置中 `H2Push On`，然后通过添加 Header  `Header add Link "</css/styles.css>;rel=preload"` 的方法启用 Server Push。在不支持 Server Push 的 WebServer 上添加该响应头，不过是通过让服务端响应头、而不是通过 HTML 标记 Preload、从而可以让浏览器提前执行预加载罢了。

从某种意义上讲，Server Push 就是更激进、更主动的 Preload。

# 兼容性

![0000124.png](https://i.nfz.yecdn.com/i/0000124.png)

根据 CanIUse 上的数据表明，目前支持 Preload 的浏览器并不多，只占到了 53% 。但是试想在 2015 年、Preload 的草案刚刚出来时、甚至还没有任何浏览器表态支持这项技术，我们不得不感叹 Web 技术的日新月异啊。

----

参考资料：

- http://stackoverflow.com/questions/36641137/how-exactly-does-link-rel-preload-work
- https://blog.cloudflare.com/http-2-server-push-with-multiple-assets-per-link-header/
- https://httpd.apache.org/docs/2.4/mod/mod_http2.html