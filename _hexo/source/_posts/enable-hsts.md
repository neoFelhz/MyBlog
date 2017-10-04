---
title: 全站开启 HSTS
tags:
  - 安全
  - HSTS
  - SSL
  - HTTPS
categories:
  - 博客栈
date: 2016-10-15 20:39:00
updated: 2017-8-25 15:36:00
thumbnail: https://s.nfz.yecdn.com/img/thumbnails/enabled-HSTS.jpg!blogth
---

HSTS 是 HTTP Strict Transport Security （HTTP 严格安全传输）的缩写。开启了这项设置以后，大部分浏览器会强制性地使用 HTTPS 来请求资源，能够更加有效地保护网站和用户的数据安全。

<!--more-->

一般情况（未启用 HSTS），浏览器会允许用户在了解了安全风险之后继续使用不安全的连接来访问，但如果启用了HSTS，则不允许忽略，所以如果你要启用 https ，得一定要**很长期使用HTTPS**，或者像我一样，成为一个 https 控。

# 启用HSTS

HSTS 是一个响应头，格式如下：

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload;
```

- max-age，单位是秒，用来告诉浏览器在指定时间内，这个网站必须通过 HTTPS 协议来访问。也就是对于这个网站的 HTTP 地址，浏览器需要先在本地替换为 HTTPS 之后再发送请求。
- includeSubDomains ，可选参数，如果指定这个参数，表明这个网站所有子域名也必须通过 HTTPS 协议来访问。
- preload ，可选参数，预加载到浏览器缓存。

> [RFC 6797](https://tools.ietf.org/html/rfc6797) 对 HSTS 进行了详细说明。

# 配置 HSTS
HSTS 这个响应头只能用于 HTTPS 响应；网站必须使用默认的 443 端口；必须使用域名，不能是 IP。而且启用HSTS之后，**一旦网站证书错误，用户无法选择忽略。**（这意味着你需要及时给证书续命）
添加 HSTS 支持其实很简单，修改一下 Web 服务器的配置，增加一个 HTTP 头就行。
> 举个例子，这个域名目前使用的是：

```
Strict-Transport-Security: max-age=15552000; includeSubDomains; preload max-age=15552000
```

告诉浏览器缓存这条规则 180 天；includeSubDomains 对子域名也使用相同的规则；preload 允许将这条规则内置进浏览器。

# WebServer 配置 HSTS

对于 Apache，只需在 .htaccess 加入以下代码即可

```apache
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" env=HTTPS
```

对于 Nginx，可以在站点配置文件中添加

```conf
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

# 申请 HSTS Preload List
HSTS 必须要在浏览器访问过你的网站一次以后才会生效，如果希望提前生效，需要申请 HSTS Preloading List。
目前这个 Preload List 由 Google Chrome 维护，Chrome、Firefox、Safari、IE 11 和 Microsoft Edge 都在使用和不断更新。
如果要想把自己的域名加进这个列表，首先需要满足以下条件：

- 拥有合法的证书（如果使用 SHA-1 证书，过期时间必须早于 2016 年）
- 将所有 HTTP 流量重定向到 HTTPS
- 确保所有子域名都启用了 HTTPS
- 输出 HSTS 响应头
- max-age 不能低于 18 周（10886400 秒）
- 必须指定 includeSubdomains 参数
- 必须指定 preload 参数

觉得妥了可以去 [HSTS Preload List](https://hstspreload.org) 这个页面申请。
我的域名已经去申请加入预加载列表了。如果能通过，将会是很吼的！

> 特别提醒：对于 HSTS 以及 HSTS Preload List ，如果你不能确保永远提供 HTTPS 服务，就不要启用。因为一旦 HSTS 生效，**你再想把网站重定向为 HTTP ，之前的老用户会被无限重定向，唯一的办法是换新域名。**

----

本站已经加入了 [HSTS Preload List](https://cs.chromium.org/chromium/src/net/http/transport_security_state_static.json?q=nfz.moe&sq=package:chromium&maxsize=5625974&l=24044)。

![0000150.jpg](https://i.nfz.yecdn.com/i/0000150.jpg)
