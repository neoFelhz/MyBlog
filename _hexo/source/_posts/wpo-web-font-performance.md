---
title: Web 性能优化（6）——WebFont 字体优化
tags:
  - 前端优化
  - 字体
  - WebFont
  - localstorage
  - base64
categories:
  - 实验室
date: 2017-09-17 17:48:00
updated: 2017-09-17 17:48:18
---

WebFont 的加载是一个令人头疼的事情。除了跨域问题、还有 FOIT、FOUT 等等。为了提供更好的用户体验，我寻找了一些高效加载 WebFont 的简单解决方法，并对它们分别进行测试。

<!-- more -->

# 解决方案

常见的加速字体的方案有：

- 将字体部署在 CDN 并开启跨域头
- 使用第三方字体库加载字体
- 将字体以 base64 形式保存在 css 中并缓存下来
- 将字体以 base64 形式保存在 css 中并通过 localstorage 中进行缓存

> 参考阅读：
> - [《Web 性能优化（3）——探讨 data URI 的性能》](https://blog.nfz.moe/archives/wpo-data-uri-performance.html)
> - [《Web 性能优化（4）——localstorage 存储静态文件的意义》](https://blog.nfz.moe/archives/wpo-localstorage-css-js.html) 

# 测试

我写了四个测试页面，分别用来测试上述四种方案的字体加载性能。

- 测试字体：Roboto 的三个字重（300、400、500）
- 测试环境：完整 HTTP2
- 测试工具：[GTmetrix](https://gtmetrix.com)

## 将字体部署在 CDN 上

[测试页面](https://lab.nfz.moe/fonts-performance/default.html)

在这个页面中，我从 inline 在页面中的 `style` 标签通过 `@font-face` 引用了来自 `css.net` 的公共 CDN 库中的 Roboto 字体。

### 正常网络环境

![0000170.png](https://i.nfz.yecdn.com/i/0000170.png)

可以看到，只有在 DOMLoaded 触发以后，WebFont 才开始予以加载。WebFont 的优先级在加载中并不高。

[详细的测试报告](https://gtmetrix.com/reports/lab.nfz.moe/Ap69eYgs)

在测试报告中提供的视频里也可以清楚地看到，当页面整体框架出来以后，文字内容才被“一点点填充”进页面中

### 极限网络环境

![0000171.png](https://i.nfz.yecdn.com/i/0000171.png)

在 `Slow 3G` 的极端模式下，如果整个页面全部使用外源字体，那么就会严重影响主要内容的展现。

[详细的测试报告](https://gtmetrix.com/reports/lab.nfz.moe/geEKorku)

## 使用 Google Font 加载字体

[测试页面](https://lab.nfz.moe/fonts-performance/google-font.html)

在这个页面中，我用 `https://fonts.googleapis.com/css?family=Roboto:300,400,500` 加载 Roboto 字体。

### 正常网络环境

![0000173.png](https://i.nfz.yecdn.com/i/0000173.png)

可能是 Google 字体库的 Buff，GTmetrix 的测试中加载的字体非常快。但是加载字体 css 还需要新建立一个 TCP 连接，所以略微延迟了 DOMLoaded 触发。

[详细的测试报告](https://gtmetrix.com/reports/lab.nfz.moe/QI8daVFy)

### 极限网络环境

![0000174.png](https://i.nfz.yecdn.com/i/0000174.png)

在 `Slow 3G` 的极端模式下，Google 字体库不得不额外建立一个 TCP 连接的劣势被放大。

[详细的测试报告](https://gtmetrix.com/reports/lab.nfz.moe/FS9lebB8)

## 将 base64 字体 inline 在 HTML

[测试页面](https://lab.nfz.moe/fonts-performance/base64.html)

> 将字体转变为 base64 使用了 [embedded-google-fonts](https://amio.github.io/embedded-google-fonts/) 项目，下同。

![0000175.png](https://i.nfz.yecdn.com/i/0000175.png)

无需新增任何额外请求使这个页面的加载性能表现的很优秀，但是这无疑增大了 HTML 的体积，把字体这种不常更新的资源提升到了和 HTML 这种经常改变的资源同等的缓存地位，于性能是大大不利的。
而且，将将这么大的字体进行 base64 加码，可能会严重影响页面的渲染性能，因为解码 base64 也要消耗时间。

[详细的测试报告](https://gtmetrix.com/reports/lab.nfz.moe/cKJhnLnQ)

## 将 base64 字体 inline 在 css

[测试页面](https://lab.nfz.moe/fonts-performance/base64-css.html)

虽然很多人并不赞同将字体 base64 化后储存在 css 中，包括了 css 和字体的缓存等级的不同、影响 css 文件的加载从而影响渲染等等；但是 css 本身具有可以缓存的特点，而且使用 css 内建 base64 字体可以避免 FOIT。

> - Chrome 和 Firefox 的部分版本最多只能显示 3 秒钟内显示的文字。如果网络字体在这三秒内到达，文本从不可见切换到您的自定义字体。如果字体在 3 秒后仍未到达，则文本使用系统默认字体。这是 `FOIT`。
> - IE 会立即显示系统备用字体，然后在自定义字体到达时将进行替换。这是 `FOUT`。现在部分版本的 Chrome 也使用了这种方案。
> - Safari 会不显示字，直到字体到达。如果字体从未到达，它也没有备用字体。这是 `FOIT`，用户可能永远无法看到您网页上的任何文字。

[详细的测试报告](https://gtmetrix.com/reports/lab.nfz.moe/0yCct7SN)

## 将 base64 字体存储在 localstorage 中

[测试页面](https://lab.nfz.moe/fonts-performance/base64-lsloader.html)

> 这个页面使用了 Material 主题中专门开发的轮子 `lsloader`

无论文件是否可以缓存，总有特殊环境和辣鸡浏览器不能很好的缓存文件。这个时候将字体 base64 以后直接储存在 localstorage 中可以实现强缓存的效果。

![0000176.png](https://i.nfz.yecdn.com/i/0000176.png)

当二次加载以后，页面的主要拖延成为了从本地的 localstorage 中取出巨大体积的 base64 字体并将其解码、渲染。但是这一切操作均在本地完成，本身不需要发起网络请求，在移动端这种恶劣的网络环境下这不失为一种最佳选择。

# 最佳实践

- 尽量避免 Google 字体库，因为这不得不需要专门下载一个 `@font-face` 的 css 片段才能加载字体。直接内置在 css 片段中是一个不错的选择。
- 使用 base64 字体主要是为了避免跨域和 FOIT。如果只考虑现代浏览器，使用 `woff` 或者 `woff2` 这种内建压缩的现代的 WebFont 格式搭配 `Preload` 提升字体加载优先级别可能更适合常规选择。
- 最好的选择是不加载字体，尽量使用访客设备上默认的字体用于页面。毕竟各种系统默认的内置字体在对应系统上有最好的显示效果。
- 如果需要使用 base64 字体（比如外源的图标字体），建议对字体本身进行精简，然后 base64 转码后储存在 localstorage 中，可以有效改善缓存的效果、显著提升二次加载的性能。

在 Material 主题 2.0.0 重构的计划中，我们决定采用 [ANT.Design](https://ant.design) 的字体设定（稍作改造）以获得最好的显示效果和加载性能。选择 `woff` 或者 `woff2` 格式的 Material Icon 内联在 css 当中，并使用 Material 主题中已经成熟的 `lsloader` 储存字体 css，获得最好的性能。
