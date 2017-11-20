---
title: 常用免费前端公共库 CDN 服务收集
tags:
  - Web
  - 免费资源
  - 公共 CDN
categories:
  - 分享镜
date: 2017-7-10 15:17:00
updated: 2017-11-20 10:54:00
description: 前端公共库 CDN 服务是指一些服务商将我们常用的前端开发用到的库存放到网上，方便开发者直接调用，并且提供 CDN 加速。与将前端库存放在自己的服务器上相比，公共库的 CDN 更加稳定、高速，一来可以方便开发者的开发，二来可以让用户加速访问这些资源。
---

前端公共库 CDN 服务是指一些服务商将我们常用的前端开发用到的库存放到网上，方便开发者直接调用，并且提供 CDN 加速。<!-- more -->与将前端库存放在自己的服务器上相比，公共库的 CDN 更加稳定、高速，一来可以方便开发者的开发，二来可以让用户加速访问这些资源。

# BootCDN

![0000144.jpg](https://bbs-static.nfz.yecdn.com/i/0000144.jpg)

- CDN 提供商：又拍云
- 节点：全球
- HTTPS：支持
- HTTP2：支持 HTTP2 和 SPDY3.1
- 官网：[www.bootcdn.cn](http://www.bootcdn.cn)
- CDN 资源域名：`cdn.bootcss.com`

BootCDN 是 Bootstrap 中文网和又拍云合作提供的前端公共库服务。BootCDN 每天同步一次 CDNJS 的 GitHub。又拍云的 CDN 嘛没的说，国内 150+ 节点，在香港和美国也都有节点，整体速度都很不错。偶尔会遭遇 CC 攻击，所以不是太稳。

# 75CDN

- CDN 提供商：奇虎 360
- 节点：全球
- HTTPS：支持
- HTTP2：支持
- 官网：[cdn.baomitu.com](https://cdn.baomitu.com/)
- CDN 资源域名：`lib.baomitu.com`

~~BaomituCDN~~ 75CDN 是奇虎 360 最大的前端团队奇舞团维护的前端开源公共库，也是每天同步 CDNJS。奇虎的 CDN 节点在国内数量很可观，但是在海外就有些差强人意（没有东南亚地区节点，只有一个北美节点），亚太地区访客都会被解析回国内节点。不过 BaomituCDN 还同步了谷歌字体库（不是反代），所以还是可以看看的。最近他们 [为 75CDN 公共库加上了 SRI 支持](https://75team.com/post/75cdn-sri.html)，这应该是公共库中可以算是独树一帜的（在这之前，只有 jsDelivr 提供了 SRI 支持）。

# CSS.NET

![0000142.jpg](https://bbs-static.nfz.yecdn.com/i/0000142.jpg)

- CDN 提供商：Sucuri CDN 和 阿里云 CDN
- 节点：双节点
- HTTPS：支持
- HTTP2：支持
- 官网：[css.net](https://css.net)
- CDN 资源域名：`cdnjs.cat.net` 等
- 介绍：[SB.SB/css-cdn/](https://sb.sb/css-cdn/)

CSS.NET 是土豪 Showfom 提供的公益前端 CDN 服务，每天同步 CDNJS~~和 jsDeliver~~的 GitHub。jsDelivr 由于有国内和网宿合作的节点，css.net 已经不再同步。
~~当面对全网加速的需求时，CDN 和 BGP 成为了两个极端。如果说前面几家前端公共库选择了 CDN，那么 Showfom 的选择是另一个极端——BGP。cdn.css.net 只解析了国内和北美的各一台服务器，其中国内的是位于浙江阿里云 BGP 机房，同时接入了 8 条运营商线路~~兽兽 dalao 亲自来博客评论区了(⁄ ⁄•⁄ω⁄•⁄ ⁄)，现在 css.net 的架构改成了国内是阿里云 CDN，海外是 SUCURI CDN（IP 任播），全球路由畅通。CSS.NET 的整体速度和延迟都很不赖~~，就是需要担心如果公共库单点宕机带来的加载问题~~。

# Staticfile

![0000146.jpg](https://bbs-static.nfz.yecdn.com/i/0000146.jpg)

- CDN 提供商：七牛
- 节点：全球
- HTTPS：支持
- HTTP2：不支持
- 官网：[www.staticfile.org](https://www.staticfile.org)
- CDN 资源域名：`cdn.staticfile.org`

Staticfile 是七牛提供的公共 CDN 服务，由掘金提供的技术支持。Staticfile 的库是自己维护的，开源在 GitHub 上。不过已经将近一年没有更新了，里面的库都不是最新的。不过七牛毕竟和国内多家 CDN 厂商合作，在国内节点和线路优秀，在海外也有韩国、日本、香港、台湾、北美多地的节点。不过七牛一直不支持 HTTP2，大家需要权衡一下。

# CDNJS

- CDN 提供商：CloudFlare
- 节点：海外
- HTTPS：支持
- HTTP2：支持
- 官网：[cdnjs.com](https://cdnjs.com)
- CDN 资源域名：`cdnjs.cloudflare.com`

公共 CDN 库的老大，基本上国内大部分公共 CDN 都是从它这里同步的。支持多资源合并。CDN 服务商是大名鼎鼎的 CloudFlare，IP 任播走遍全球节点，还支持 IPv6。在国外速度没话说，不过在国内的路由就因为某些大家都懂的原因就基本呵呵了。

# jsDeliver

![0000148.jpg](https://bbs-static.nfz.yecdn.com/i/0000148.jpg)

- CDN 提供商：CloudFlare、MaxCDN、Fastly 和网宿等
- 节点：全球
- HTTPS：支持
- HTTP2：~~国内不支持、海外支持~~ 现在国内节点也已经支持了 HTTP2。
- 官网：[www.jsdeliver.com](https://www.jsdelivr.com/)
- CDN 资源域名：`cdn.jsdelivr.net`

也是一家公共 CDN 巨头，除了拥有自有库、支持文件合并以外，还支持从 NPM 上获得资源。jsDeliver 域名还在国内备了案。提供海外 CDN 服务的是 CloudFlare，提供国内 CDN 服务的是 ~~CloudFlare 国内版~~ 网宿。~~虽然有国内节点，但是我还是推荐使用国内同步 jsDeliver 的公共库，因为 jsDeliver 用的域名解析不够智能，还是偶尔会有国内一些地区被解析到 CloudFlare 海外节点上~~现在 jsDelivr 换了负载均衡提供商，目前的解析还是挺正确的。除此之外，网宿 CDN 曾经被曝出浙江节点遭遇了 MITM，受到影响的 jsDelivr 也随即停止解析国内节点直到问题解决。

# UNPKG

![0000147.jpg](https://bbs-static.nfz.yecdn.com/i/0000147.jpg)

- CDN 提供商：CloudFlare
- 节点：海外
- HTTPS：支持
- HTTP2：支持
- 官网：[unpkg.com](https://unpkg.com/#/)
- CDN 资源域名：`unpkg.com`

UNPKG CDN 是和 jsDeliver 类似的、但是只从 NPM 上获取资源的公共 CDN 库。虽然是 CloudFlare 国内速度较为不理想，但是比较推荐在开发时使用，因为 NPM 上的资源是最新的和实时的。不过部署在国内的生产环境上，还是不建议使用 UNPKG、或者可以部署反代。
