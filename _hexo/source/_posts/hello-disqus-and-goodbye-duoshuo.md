---
title: 你好 Disqus，再见多说
categories:
    - 博客栈
tags:
    - 多说
    - Disqus
    - 评论
    - 博客
toc: false
date: 2017-01-26 11:18:34
updated: 2017-01-26 11:18:34
thumbnail: https://blog.nfz.yecdn.com/img/thumbnails/hello-disqus-and-goodbye-duoshuo.png!blogth
---

多说又双叒叕爆炸了！——这是我看到 `多说评论系统故障(9900015)，请联系客服人员` 报错信息时的想法。

<!--more-->

> 终于，多说关闭了。

# 多说

多说是国内一款常见的社会化评论系统，常用于给没有自带评论服务的如 Hexo、Jeykll、MediaWiki 等提供评论服务，或者是为自带评论服务的如 WordPress、Typecho 等提供社会化评论服务。多说最大的优点可提供 QQ、微博、人人网、开心网、豆瓣、谷歌等一干社交媒体账号的登陆服务。但是作为国内一大评论系统，多说还是有许多不足：

- 多说默认的样式实在太 $^[-@#(&^9{ . . .
- 多说的垃圾评论拦截功能形同虚设，广告、色情评论实在泛滥
- 一段时间以来多说的服务很不稳定，经常崩坏
- 多说已经停止开发，最后一次更新停步于 2016 年 5 月
- 社交媒体的头像不支持 HTTPS（虽然这个锅应该归 BAT 毒瘤背）

> 虽然多说头像 HTTPS 可以用七牛或者 PHP 反代得以实现，但是毕竟是多说一大黑点。

# Disqus

如果说国内有一家独大的评论系统多说，那么国外对应的就是 Disqus。与多说单纯仅提供评论服务不同，Disqus 提供一套完整的社区服务和推广功能（或许这是 Disqus 没有像多说一样面临困境的最大原因）。但是 Disqus 也有它的不足：

- Disqus 与多说不同，并不支持自定义样式（但是说实话，Disqus 的样式比多说的默认样式不知道高到哪里去了）
- Disqus 不建议游客参加评论——Disqus 会引导游客注册 Disqus 账户，除非评论者勾选`I'd rather post as a guest`
- Disqus 仅提供 Facebook、Twitter 等国外社交媒体的社会化登陆方式
- 由于 `The Girl Friend Wall` 的存在，Disqus 在国内 **开放、自由、有序** 的网络环境下是不能访问的。

# duoshuo2Disqus

尽管多说有丰富的国内社交登陆方式以及无访问障碍，但是 Disqus 服务毕竟稳定可靠（没办法，洋大人的东西确实是好），而且有一整套完善的垃圾评论屏蔽功能（不会像多说一样极其容易被垃圾评论攻陷。而且国内也没有针对 Disqus 设计的垃圾评论机器人），所以我依旧决定迁移到 Disqus。
这里我直接用了现成的轮子 [duoshuo-migrator](https://github.com/JamesPan/duoshuo-migrator) 转换的。这个 Python 程序可以把多说导出的备份文件转换成 Disqus 支持的 WXR 格式。具体使用方法在项目的 README 里写的很清楚了。
不过对之前评论过的小伙伴们表示很遗憾，你们的头像都没了. . .
