---
title: Disqus 评论加载模式思路分析
date: 2017-02-21 22:35:12
updated: 2017-02-21 22:35:12
categories:
  - 博客栈
tags:
  - 评论
  - 博客
  - Disqus
toc: false
thumbnail: https://s.nfz.yecdn.com/img/thumbnails/how-to-show-disqus-comment-in-gfw.png!blogth
---

Disqus 因为一些显而易见的问题，所以无法在一些 公正、平等、有序 的网络环境直接加载。

<!--more-->

> 为什么要使用 Disqus 而不使用多说，可以阅读我的另一篇博客——[《你好 Disqus，再见多说》](https://blog.neofelhz.space/archives/hello-disqus-and-goodbye-duoshuo.html)

> 现在为了博客的加载速度，你可以看到我博客底部评论区新增加了一个按钮，点击按钮以后才能加载评论。由于这个不主动加载 Disqus 的设计，我博客的 DOM Load 成功减少了 0.4s。这个功能在 hexo-theme-material 主题 1.3.0 时发布。

但是为了解决浏览者看评论的问题，由于 Disqus 的跨域加载限制，在中国国内的互联网环境下加载 Disqus，不得不另辟蹊径。

Disqus 提供了一套完整的 API，可以调用很多类型的数据，比如评论数量、评论内容等等数据。调用地址是 disqus.com/api，这里是 [Disqus API 的文档](https://disqus.com/api/docs)。
由于 API 返回的是字符或者 json 文件，所以这时我们就可以通过反代 API 的地址就可以成功地获取到 json 数据。接下来只需要通过 JS 解析 json，转义成列表，展现出来即可。

对于指定页面加载指定评论，可以在调用 API 时用参数加以限制。Disqus 的 shortname 和文章标识符可以不需要动态生成，用 Hexo 的函数和 ejs 调用即可。例如通过 `<%= theme.comment.shortname %>` 可以调用主题配置文件里的 Disqus Shortname，用 `<%- page.path %>` 获取当前页面的标识。

> 以下就是你可以获取到评论列表 json 的地址。

```
https://YOUR.DOMAIN/api/3.0/threads/list.json?forum=" + YOUR DISQUS SHORTNAME + "&thread=ident:" + "<%- page.path %>" + "&api_key= YOUR API KEY"
```

那么，什么时候用评论浏览模式，什么时候加载 Disqus，我们需要做一个判断。可以判断 Disqus 下的一些特定元素能不能加载（比如那个加载动画），一旦加载超时了，就切换到评论浏览模式。当然为了避免误判，我们可以保留那个按钮，做好切换功能。

当然，Disqus 的 API 的功能非常完善，除了可以加载评论列表，还可以回传评论。[屈哥（前端大菊苣）的博客](https://imququ.com)的 Disqus 评论就可以支持本地评论，然后服务器异步回传给 Disqus。
