---
title: 为博客启用 PWA 支持
date: 2017-04-08 19:30:27
updated: 2017-07-07 23:10:27
categories:
  - 博客栈
tags:
  - PWA
  - Web
  - Service Worker
thumbnail: https://s.nfz.yecdn.com/img/thumbnails/pwa-support-for-my-blog.png!blogth
---

> 对于 native app 和 PWA 的纷争我不想发表太多看法，但是有一件事是确定的——PWA 极大改善了移动端用户的体验。

<!-- more -->

好消息是改造你的网站为 Progressive Web Apps（PWAs）并不困难。这就是本文想介绍的——我是如何改造我的博客使之成为 PWA 的。

# 启用全站 HTTPS

这是使用 PWA 的第一步。
这是由于一些显而易见的原因（其中，PWA 需要借助 ServiceWorker 是最主要的原因）
我旗下所有网站都已经启用了 HTTPS 支持。

# 创建一个 Service Worker

ServiceWorker 是一个可以拦截和响应你的网络请求的编程接口，具备有可以高效的缓存、提供通知和离线访问的特性。
Service Worker 很复杂，你可以修改示例代码来达到自己的目的。[这里](https://gist.github.com/neoFelhz/50800b701d00dc6d874be95da2cd7655)是一个标准的 Web Worker，浏览器用一个单独的线程来下载和执行它。它没有调用 DOM 和其他页面 API 的能力，但它可以拦截网络请求，包括页面切换，静态资源下载。你要做的不过是启用它。
关于如何用上述示例代码启用一个最简单的 ServiceWorker，你可以阅读[《Web 性能优化（2）——浅尝 Service Worker》](https://blog.nfz.moe/archives/wpo-by-service-worker.html)。

# 创建 Web App Manifest

manifest 文件提供了一些我们网站的信息，例如 name，description 和需要在主屏使用的图标的图片，启动屏的图片等。
manifest 文件是一个 JSON 格式的文件，位于你项目的根目录。它必须用 `Content-Type: application/manifest+json` 或者 `Content-Type: application/json` 这样的 HTTP 头来请求。

```json
{
  "name"              : "PWA Website",
  "short_name"        : "PWA",
  "description"       : "An example PWA website",
  "start_url"         : "/",
  "display"           : "standalone",
  "orientation"       : "any",
  "background_color"  : "#ACE",
  "theme_color"       : "#ACE",
  "icons": [
    {
      "src"           : "/images/logo/logo072.png",
      "sizes"         : "72x72",
      "type"          : "image/png"
    },
    {
      "src"           : "/images/logo/logo192.png",
      "sizes"         : "192x192",
      "type"          : "image/png"
    },
    {
      "src"           : "/images/logo/logo256.png",
      "sizes"         : "256x256",
      "type"          : "image/png"
    },
    {
      "src"           : "/images/logo/logo512.png",
      "sizes"         : "512x512",
      "type"          : "image/png"
    }
  ]
}
```

这是一个 PWA Manifest 的示例。你可以通过简单修改它后在自己的网站上启用。
可选的属性有：

- name —— 网页显示给用户的完整名称
- short_name —— 当空间不足以显示全名时的网站缩写名称
- description —— 关于网站的详细描述
- start_url —— 网页的初始 相对 URL（比如 /）
- scope —— 导航范围。比如，``/app/`的 scope 就限制 `app` 在这个文件夹里。
- background-color —— 启动屏和浏览器的背景颜色
- theme_color —— 网站的主题颜色，一般都与背景颜色相同，它可以影响网站的显示
- orientation —— 首选的显示方向：any, natural, landscape, landscape-primary, landscape-secondary, portrait, portrait-primary, 和 portrait-secondary。
- display —— 首选的显示方式：fullscreen, standalone (看起来像是native app)，minimal-ui (有简化的浏览器控制选项) 和 browser (常规的浏览器 tab)
- icons —— 定义了 src URL, sizes 和 type 的图片对象数组，用来定义 PWA 的 icon。

> 你可以在 [MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest) 中找到对 `manifest` 详细说明。
> 另外，你也可以通过[这个网站](https://app-manifest.firebaseapp.com)快速生成一个 `manifest.json` 和各种大小的图标。

最后，在 HTML 内引用这个文件。

```html
<link rel="manifest" href="/manifest.json">
```

# 调试

现代浏览器都提供了完善的调试工具。本文以 Chrome 为例。

## 调试 Manifest

在开发者工具中的 `Application` 选项卡左边有 `Manifest` 选项，你可以验证你的 manifest JSON 文件，并提供了 `Add to homescreen`。执行操作，检查控制台日志是否有报错。

![0000085.png](https://bbs-static.nfz.yecdn.com/i/0000085.png)

## 调试 ServiceWorker

在开发者工具中的 `Application` 选项卡左边的 `Application` 选项中你可以轻松地调试你的 ServiceWorker。

![0000086.png](https://bbs-static.nfz.yecdn.com/i/0000086.png)

点击 `Offline`，检查你的离线页面是否正常工作。

> 在 `Clear storage` 选项中你可以清除 ServiceWorker 的缓存。
>
> 技巧一：用 隐身窗口 来测试你的 PWA，这样在你关闭这个窗口之后缓存就不会保留下来。
> 技巧二：在 Chrome 新版本的开放人员面板中新增了功能 [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?utm_source=chrome-app-launcher-info-dialog) 可以快速调试 PWA。Lighthouse 还内置了 `pagespeed` 可以测试页面的加载性能。

## 让 PWA 安装提示在首次访问时弹出

你可以在页面中加入下述 JavaScript，可以让访客首次访问你的页面时弹出 PWA 安装下图所示的提示弹窗。

<img src="https://bbs-static.nfz.yecdn.com/i/0000156.jpg" alt="0000156.jpg" style="width:50%" />

```javascript
window.addEventListener('beforeinstallprompt', event => {
  event.userChoice.then(result => {
    console.log(result.outcome)
  })
})
```

不过我还是比较喜欢 Chrome 默认的做法，即首次访问并不一定弹出对话框，只有用户在 24 小时内多次访问页面（次数是根据会话数统计的）才弹出安装对话框。我认为，这样做也是对访客负责——固然安装 PWA 能吸引访客回访——但是不是所有人都愿意安装一个 PWA，尤其是不频繁访问网站的。

-----

上述调试都通过了？把你的网站部署上生产环境吧！

---

> 本文更新于 2017.7.7 日，根据[《在博客上完全实现PWA支持》](https://siyuanlau.github.io/2017/06/08/在博客上完全实现PWA支持/)提到的细节进行了完善。