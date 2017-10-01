---
title: 妄想 Paranoia 歌词 API 文档
tags:
  - API
  - VOCALOID
  - 妄想者系列
  - Hitokoto
categories:
  - 实验室
date: 2017-04-04 16:26:00
updated: 2017-08-03 16:24:00
thumbnail: https://blog.nfz.yecdn.com/img/thumbnails/delasaka-paranoia-api.png!blogth
---

> 封面：β 
> 取自 [妄想症系列专辑预热宣传](http://www.bilibili.com/video/av8264026/) 视频封面

<!-- more -->

# 妄想症 Paranoia API

妄想症 Paranoia API 是一个类似于 Hitokoto 随机返回一句话的 API。

> API 内收录所有歌词，版权归 妄想症系列 策划/作词 [雨狸](http://weibo.com/sakacastle) 所有！

- 问题反馈：neofelhz@gmail.com
- 调用实例：数据获取
- 数据条数：242

# 数据获取方式

- 请求地址：https://api.nfz.moe/paranoia/ （仅支持 HTTPS，HTTP 请求将会 301/307 强制跳转 HTTPS，域名已启用 HSTS 响应头）
- 请求方式：GET
- 请求参数：
  - ~~charset：字符集，支持 GBK/UTF-8~~ 现仅支持 UTF-8，该参数已被取消
  - encode：数据可返回函数名为 `paranoia` 的 JavaScript 脚本用于同步调用

# 实例

## 直接请求

- 请求：https://api.nfz.moe/paranoia/
- 返回：`被抛弃的女孩 深渊中乞愿被爱 无法失去陪伴 被自己的愿望加害——《妄想·Reality》`

## Javascript + HTML

脚本地址：`https://api.nfz.moe/paranoia/?encode=js`

在 HTML 内引用 JavaScript，建议放在 `</head>` 之前：

```html
<script type="text/javascript" src="https://api.nfz.moe/paranoia/?encode=js"></script>
```

> API 响应时间平均为 200ms，可对域名 `api.nfz.moe` 做 `preconnect` 提前完成 TCP 连接。

在你需要展示一句话的地方加上：

#### 显示来源

```html
<div id="paranoiaapi"><script>paranoia(true)</script></div>
```

#### 不显示来源

```html
<div id="paranoiaapi"><script>paranoia(false)</script></div>
```

支持其它 CSS 样式。

> [HTML 调用实例](https://api.nfz.moe/paranoia/example.html)

> 返回的 JavaScript 会返回一个 `paranoia` 的函数，同步调用。该脚本实质为使用 document.write 的脚本。
> 是否显示来源取决于 `paranoia()` 传递的参数：`true` 为显示，`false` 为不显示。

# 更新日志

- 2017 年 4 月 4 日：正式上线
- 2017 年 6 月 2 日：第一次重构
- 2017 年 8 月 3 日：第二次重构、更新数据
