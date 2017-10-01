---
title: Google Analytics 异步优化方案
tags:
  - 前端优化
  - Web
  - Google Analytics
  - 访问统计
categories:
  - 实验室
date: 2017-6-18 13:28:00
updated: 2017-6-18 13:28:00
thumbnail: https://blog.nfz.yecdn.com/img/thumbnails/google-analytics-optimize.png
---

一般地，网站配置 Google An­a­lyt­ics 的常见方式是在网站前端引用 Google Analytics 的 trackercode，然后获取 `analytics.js` 并开始统计用户行为。

<!-- more -->

# Google Analytics 异步方案的必要性

虽然现在 Google Analytics 的 `www.google-analytics.com` 和 `ssl.google-analytics.com` 已经重新解析回谷歌在国内那 200 多台服务器了，所以 Google Analytics 已经不用再担心被墙而导致网站加载慢和无法采集到数据的问题了。

然而，浏览器端经常有意无意的，包括常见的 Ad­block 扩展等自带的屏蔽列表，利用 user­script 等方式，屏蔽 Google An­a­lyt­ics。这导致了数据统计不准的问题。

在 JerryQu 的[《本博客零散优化点汇总》](https://imququ.com/post/summary-of-my-blog-optimization.html)一文中提到他是如何处理 Google Analytics 的：

> 把统计逻辑挪到了服务端；自己生成用户唯一标识，获取访问页面的标题、URL、Referer，获取用户 IP 和浏览器 UA，随着每次访问发给 Google 的统计地址。服务端向 Google 发起的请求是异步的，用户端访问速度丝毫不受影响。

Google Analytics 的[官方文档](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference)给出了相关介绍，Google 也提供了 [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/)。

# Google Analytics 异步方案介绍

目前常见的是这两种方法：完整的后端方案和前端和后端搭配的方案。

> 前者通过配置 Nginx，使用 uid 模块和 proxy_pass 向后端转发请求；后者的方案则是通过 JS 发送请求给中转服务，再由中转服务器异步发送给 Google。对于前者的解决方案的实现可以阅读下述文章：

- [《Ng­inx 内配置 Google An­a­lyt­ics 指南》](https://darknode.in/network/nginx-google-analytics/)
- [《使用Nginx将请求转发至Google Analytics实现后端统计》](https://eason-yang.com/2016/11/04/google-analytics-via-nginx/)

还有一种方案，就是在前端通过 JS 发起一个请求、生成用户端的信息带到请求的 URI 上，然后后端的有关程序监听这个请求，并异步发送给 Google。

> 对于这种解决方案，有人写了一个 Node.js（基于 ThinkJS） 的程序实现：[《服务端使用 Google Analytics》](https://blog.alphatr.com/google-analytics-on-server.html)

# PHP 的轮子

我想，没有 Node.js 支持的虚拟主机，又不是所有人都有独立的 VPS 的，也不是所有人都使用 Node.js 的。所以我根据这种思路，找到了个 PHP 版的。

```php
<?php
// ********************
// * Author: stneng
// * Date: 2016.12.11
// * Introduction: https://u.nu/ytq
// *********************
    header("status: 204");
    header("Cache-Control: no-cache, max-age=0");
    header("Pragma: no-cache");
	
    $tid='';  //在这里写Google Analytics给的tid，形如：UA-XXXX-Y

    function create_uuid(){
        $str = md5(uniqid(mt_rand(), true));
        $uuid = substr($str,0,8) . '-';
        $uuid .= substr($str,8,4) . '-';
        $uuid .= substr($str,12,4) . '-';
        $uuid .= substr($str,16,4) . '-';
        $uuid .= substr($str,20,12);
        return $uuid;
    }

    if (!isset($_COOKIE["uuid"])) {
        $uuid=create_uuid();
        setcookie("uuid", $uuid , time()+368400000);
    }else{
        $uuid=$_COOKIE["uuid"];
    }

    if (function_exists("fastcgi_finish_request")) {
        fastcgi_finish_request(); //对于fastcgi会提前返回请求结果，提高响应速度。
    }

    $url='v=1&t=pageview&';
    $url.='tid='.$tid.'&';
    $url.='cid='.$uuid.'&';
    $url.='dl='.rawurlencode(rawurldecode($_SERVER['HTTP_REFERER'])).'&';
    $url.='uip='.rawurlencode(rawurldecode($_SERVER['REMOTE_ADDR'])).'&';
    $url.='ua='.rawurlencode(rawurldecode($_SERVER['HTTP_USER_AGENT'])).'&';
    $url.='dt='.rawurlencode(rawurldecode($_GET['dt'])).'&';
    $url.='dr='.rawurlencode(rawurldecode($_GET['dr'])).'&';
    $url.='ul='.rawurlencode(rawurldecode($_GET['ul'])).'&';
    $url.='sd='.rawurlencode(rawurldecode($_GET['sd'])).'&';
    $url.='sr='.rawurlencode(rawurldecode($_GET['sr'])).'&';
    $url.='vp='.rawurlencode(rawurldecode($_GET['vp'])).'&';
    $url.='z='.$_GET['z'];
    $url='https://www.google-analytics.com/collect?'.$url;
    $ch=curl_init();
      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_exec($ch);
      curl_close($ch);

?>
```

将上述代码保存为 `ga.php`，放在网站根目录。

> 当然你也可以命名为其它的，不过你需要修改下述提到的 script。

在页面中插入下述代码：

```html
<script>!function(e,n,o){var t=e.screen,a=encodeURIComponent,r=["dt="+a(n.title),"dr="+a(n.referrer),"ul="+(o.language||o.browserLanguage),"sd="+t.colorDepth+"-bit","sr="+t.width+"x"+t.height,"vp="+e.innerWidth+"x"+e.innerHeight,"z="+ +new Date],i="?"+r.join("&");e.__beacon_img=new Image,e.__beacon_img.src="/ga.php"+i}(window,document,navigator,location);</script>
```

> 上面这段代码是直接修改自 imququ.com 的 `ana_js`
> 屈哥在 Disqus 把他这部分 javascript 的源码给了我，如下：

```javascript
(function(window, document, navigator, location) {
var screen = window.screen;
var encode = encodeURIComponent;

var data = [
'dt=' + encode(document.title),
'dr=' + encode(document.referrer),
'ul=' + (navigator.language || navigator.browserLanguage),
'sd=' + screen.colorDepth + '-bit',
'sr=' + screen.width + 'x' + screen.height,
'_=' + (+new Date)
];

var query = '?' + data.join('&');

window.__beacon_img = new Image();
window.__beacon_img.src = '/ga.php' + query;
})(window, document, navigator, location);
```

这段 JS 代码完成了 URI 生成和发起请求两个操作。

后端 PHP 程序包含了 uuid 生成、cookie 校验和转发请求三个部分。

首先是用 md5 生成符合 Google Analytics 的唯一用户 uid，作为辨别不同用户的依据。
然后会从客户端的 cookie 来进行匹配，判断是否是回访的访客。如果客户端没有相关 cookie，这个请求就会把 uuid 写进用户端的 cookie 中。
然后就是解析 URI，通过请求采集请求的 URI 获取有关信息，然后组成 `www.google-analytics.com/collect` 适用的 URI。
最后就是服务端通过发起 cURL 请求 `www.google-analytics.com`，把统计的页面行为提交给 Google 即可。

> 上述代码你可以在[我的 gist](https://gist.github.com/neoFelhz/4bc074783641b1ba9f4484cd232765e7) 中下载。

# 异步方案的性能分析

![0000122.png](https://i.nfz.yecdn.com/i/0000122.png)

上图上半部分是使用 Google Analytics 的 Tracker Code 的前端响应速度，下半部分是我使用 PHP 程序异步的 Google Analytics 统计的性能表现。

> 使用 `https://blog.viosey.com` 和 `https://blog.nfz.moe` 做的测试。

使用 Google Analytics 的 Tracker Code 需要加载一个大小 30k 左右的脚本（可被缓存），整个统计需要花费 90ms 左右（还不包括中间异步等待时的时间）。使用我的异步统计方案大概需要 85ms - 100ms。虽然速度相差无几，但是异步方案无需加载 JS，而且如果主机性能能再好一些，后端 PHP 运行速度再快一些，完全可以将时间控制在 50ms 以内。