---
title: 收集常见的公共图床
tags:
  - 博客
  - 图床
  - 公共图床
  - 免费资源
categories:
  - 分享镜
date: 2017-6-11 17:24:00
updated: 2017-8-16 12:19:00
---

为了节省带宽和流量、减少自己服务器的负载、加速网站图片的加载，站长一般会使用专门的图床或者 CDN 服务加载图片。本文就汇总介绍一下我所知道的公共图床，以及我对它们的评价。

<!-- more -->

如果你想查看一下以下图床是否适合你当地的网络环境，你可以访问这个[测试页面](https://lab.nfz.moe/image-hosting.html)

# 公共图床

> 注意！在使用这些公共图床之前，强烈建议阅读这些网站的 TOS（如果有的话）。公共服务运营不易，希望大家珍惜。

## 微博图床

微博图床堪称国内图床的中流砥柱，很多站长都在用。各种插件和在线上传都层出不穷，使用起来很方便。

- 速度：国内国外都非常快
- CDN：国内分别接入使用了蓝汛、网宿、阿里云 CDN、加速乐等，在国外使用了 Akamai CDN、Tierra.Net 的 CDN 等
- HTTPS：支持（不完全支持 HTTP2，得看你被解析到了哪个服务商的节点）
- 域名：
  - `ww1.sinaimg.cn` `ww2.sinaimg.cn` `ww3.sinaimg.cn` `ww4.sinaimg.cn`
  - `wx1.sinaimg.cn` `wx2.sinaimg.cn` `wx3.sinaimg.cn` `wx4.sinaimg.cn`
  - `ws1.sinaimg.cn` `ws2.sinaimg.cn` `ws3.sinaimg.cn` `ws4.sinaimg.cn`
  - 等等等等。。。


- [上传地址](http://photo.weibo.com/photos/upload)
- [Chrome 插件](https://chrome.google.com/webstore/detail/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E5%9B%BE%E5%BA%8A/fdfdnfpdplfbbnemmmoklbfjbhecpnhf/related)

> 微博图床会把你上传的图片转码成 jpg 格式；会提供三种 缩略图、中等大小、接近原图 三种尺寸的图片；通过 Chrome 插件方式上传需要用户登录才能上传；另外，渣浪微博也曝出过**在图片上加新浪 logo 水印的行为**（不过现在已经去除，但不排除使用了肉眼难以辨别的水印）；另外渣浪的图片鉴定服务容易让你上传的图片消失，所以使用起来还是需要谨慎一些~~比如不要上传什么维尼熊之类的图片~~。

## imgur

这是一家著名的老牌国外图床，2009 年就开始运行了。图片存储稳定可靠。

- 速度：国外真的挺快，不过国内半墙
- CDN：FastlyCDN（这家 CDN 的很多节点都被墙了）
- HTTPS：支持（不支持 HTTP2）
- 域名：`i.imgur.com`
- [上传地址](https://imgur.com)

> 追求国内访问速度的还是别用了吧，不过这家图床是真的足够稳定可靠。开放有 API（还有支持免费匿名上传图片的 ClientKey 可以申请），也有很多第三方插件可以用。

## sm.ms 图床

这是土豪兽兽建的图床，2015 年开始正式运营。

- 速度：~~现在估计是被滥用了没那么快了~~烧风购买了更多节点、修改了服务架构，现在全球速度还是不错的。
- CDN：烧风自建的 CDN，有香港阿里云、DigitalOcean 欧洲和 Linode 北美等节点
- HTTPS：HTTP 会被 301 跳转 HTTPS（支持 HTTP2）
- 域名：`ooo.0o0.ooo` `i.loli.net`
- [上传地址](https://sm.ms)

> 支持 API 操作，图片存储非常可靠，V2EX 钦点的图床。iOS 和 Android 应用~~即将开发完毕~~ 已经分别上架 [iTunes](https://itunes.apple.com/app/sm-ms/id1268411917) 和 [Play Store](https://play.google.com/store/apps/details?id=sm.ms)，甚至有第三方做的 Telegram Bot。在众多公共图床中最看好它和 imgur。

## V2EX 图床

这是 V2EX 推出的图床服务，需要付费才能使用。

- 速度：全球的速度都还挺不错
- CDN：V2 自建的 CDN，东亚地区会解析到台湾节点、国内速度不错。
- HTTPS：支持（支持 HTTP2）
- 域名：`i.v2ex.co`
- [上传地址](https://www.v2ex.com/i)

> V2 图床需要付费才能解锁使用可能会使一些人望而却步，不过这样可以避免被滥用，所以 V2 图床质量还是挺高的。
> 我把必须保证高度可靠外链的图片托管在上面，比如我的友链信息提供的供大家调用的头像和 favicon，都托管在 V2 图床。

## 贴图库（不推荐）

这个图床曾经被严重滥用，几年前还承诺免费，如今想要长期保存图片已经需要付费了。

- 速度：~~国内还是足够快的，国外速度很一般~~ 现在只剩下 CloudFlare，还能说什么呢？
- CDN：~~之前用过百度云加速 CDN，现在接入了 CloudXNS 牛盾 CDN 和五五互联的 CDN 服务~~ ~~现在又重新启用百度云加速了~~ 现在穷的都开始用 CLoudFlare 了
- HTTPS：~~现在重新接入了百度云加速以后没有启用 HTTPS，怕是为了降低运营成本。~~ 又重新支持了 HTTPS 和 HTTP2，不过是 CloudFlare 的功劳。

> 免费套餐上传图片只能保存 ~~6 个月~~ 7 天（应国家上级有关部门要求），上传任何图片都需要登录，而且需要付费才能长时间保存。

贴图库接入的 CDN 很不咋地，天天换域名到处各种蹭云加速，我估计只有傻子才会去买他们的服务。祝愿贴图库早日倒闭。

## ONJI 图床

- 速度：国内速度可以，国外就不行了
- CDN：百度云加速
- HTTPS：支持（不支持 HTTP2）
- 域名：`cdn.onji.cn` `api.onji.cn`

ONJI 图床的架构很特殊。~~这个图床有两种使用方式~~现在只剩下一种了。

- ~~在 [pic.onji.cn](https://pic.onji.cn) 上上传图片，获得链接~~
- 事先将图片上传到安全可靠的位置，然后使用 API URI：`https://api.onji.cn/img/?url=<原图片的 URL>` 加载图片。

> ~~这个图床的架构是，将用户的图片上传到贴吧或者新浪微博的图床（指第一种使用方法）、或者~~用户自己将图片存储在安全可靠、外网可直接访问的地方，并把原图地址填入 API URL；后端会将图片抓取下来分发、缓存到 CDN 上。
> ~~由于第一种方法相当于将图片交到百度或者渣浪手里，所以也需要谨慎。~~

由于这个图床被滥用，站长把第一种使用方式关闭了。目前图片抓取和分发的 API 还可以继续使用，大家且用且珍惜吧。

## VIM-CN 图床（elimage）

- 速度：国外速度挺快，国内就不行了
- CDN：CloudFlare
- HTTPS：支持（支持 HTTP2）
- 域名：`img.vim-cn.com`

这是 [vim-cn](http://vim-cn.com) 提供的图床服务，支持 API 和在线上传，所用程序开源。不过由于使用了 CloudFlare，国内速度就慢多了。图床官网颇有一些年久失修的历史沧桑感，希望不要挂掉。

## OOXX

V2EX 上找到的一家老牌图床，2013 年就开始运营了，不过 2017 年年初才在 V2EX 上发帖。

- 速度：CloudFlare 的网络特点，大家都懂
- CDN：CloudFlare
- HTTPS：支持（支持 HTTP2）
- 域名：`i.ooxx.ooo`
- [上传地址](https://ooxx.ooo/)

V2EX 上的介绍说最早是为了收集一些网络图片作为大数据分析和机器学习用的，所以借用机器闲置的带宽搞了这个图床。运营了四年，看起来还会继续运营下去。

## PostImage

- 速度：国外速度杠杠的，国内别被墙就好
- CDN：AdvancedHosted CDN
- HTTPS：支持
- 域名：`s1.postimg.org` `s2.postimg.org` 等。
- [上传地址](https://postimages.org)

PostImage 图床的介绍说是为了方便用户在 Facebook 和 Twitter 上传图。这个图床用的 CDN 服务商不太有名。

## UPLOAD.CC

- 速度：看下面一条用的 CDN
- CDN：CloudFlare
- HTTPS：支持
- 域名：`upload.cc`。
- [上传地址](https://upload.cc)

这个图床是香港人开的，TOS 写的挺详细的。提供了 Android 版 APP（Google Play 上可下载），还提供有 Chrome 和 Firefox 的插件，挺方便的。

## ImgSafe

- 速度：看下面一条用的 CDN
- CDN：CloudFlare
- HTTPS：支持
- 域名：`i.imgsafe.org`。
- [上传地址](https://imgsafe.org)

国外一家图床，网站首页有写着累计有图片托管在这个图床。不过 *据说* 偶尔会发生图片丢失的情况；大家自己权衡一下吧。还有要注意的就是这个图床仅能通过拖动的方式上传图片，所以手机上就没法传图了。

## ImgBox

- 速度：实在不敢恭维，估计只有在北美地区的访客才能保证最快的速度
- CDN：两台位于美国的 Leaseweb 的服务器
- HTTPS：支持
- 域名：`i.imgbox.com`。
- [上传地址](https://imgbox.com)

虽然用的服务器挺一般，但是毕竟也是一家国外老牌图床了。自 2010 年起开始运营以来，已经托管了上百万张图片，看起来还是令人放心的。

# 非“公共”的图床

> 由于是“非公共”图床，被滥用的可能性比公共图床要小很多，服务质量自然也相对较高。不过正因为这种灰色地带，让你上传的图片的安全和稳定性得不到保证。自行权衡一下吧。

## 奇虎图床

发现这个“图床”纯属偶然，我打开 `firekylin.org` 以后习惯性的按下 F12。然后我发现页面的背景图片所在的域名是 `p3.ssl.qhimg.com`
我知道 FireKylin 是奇虎 360 最大的前端团队 奇舞团 开发的博客系统，所以这可能是他们内部有的图床接口。
不过后来，我在 360 的其它网站，都看到了类似的域名，说明这个图床是也有对外接口的。

- 速度：全球的速度都很好
- CDN：奇虎自己的 CDN，部分节点和网宿合作
- HTTPS：支持（支持 HTTP2）
- 域名：
  - `p1.qhimg.com` `p2.qhimg.com` `p3.qhimg.com` 等等
  - `p1.qhmsg.com` `p2.qhmsg.com` `p3.qhmsg.com` 等等

> 在这些域名的前端散列符和根域名之间加上 `ssl`，如 `p1.ssl.qhmsg.com`，即可支持 HTTPS 和 HTTP2。

公开上传接口：位于 `wenda.so.com` `bbs.360.cn`。建议通过后者上传图片，一天只能上传 20 张图片，上传图片的方法就是在 360 论坛（Discuz 驱动）的发帖页面上传图片并插入帖子中，然后右键获得图片地址。

> 你如果是坚持抵制奇虎 360，你大可以不用这个图床。奇虎的这个图床并不公开，没有像微博图床一样被滥用，所以无需担心有过于严格的审查；图片托管在奇虎图床的风险相比微博图床是要低的，也没有发生过图片丢失的情况。

## GitHub

GitHub 一直拥有各种奇怪的用途，被发掘出来当图床也见怪不怪了。

- 速度：国内可以接受，海外速度很快
- CDN：Fastly CDN，几个节点在国内都解禁了的
- HTTPS：支持（似乎不支持 HTTP2）
- 域名：`user-images.githubusercontent.com`

上传方式是新建一个 Repo，然后在 Issue 中传图（直接将图片拖动到 issue 输入框即可），GitHub 会将你的图片分发到 GitHub 用的 CDN 中。

> 这和使用 GitHub Raw 需要 GitHub 的服务器动态生成文件不同，user-image 这个子域名是 GitHub 专门为静态文件准备的，不会让当年某某抢票助手 CC GitHub 的事情重现的。
> 当然，这个接口不是公开的。还有，请善待 GitHub。
