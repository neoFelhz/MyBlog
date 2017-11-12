---
title: Chrome 离线包查询
tags:
  - Chrome
categories:
  - 实验室
date: 2017-11-12 16:47:42
updated: 2017-11-12 16:48:17
thumbnail: https://s.nfz.yecdn.com/img/thumbnails/chrome-binary-download.png!blogth
---

> DEMO：[chrome.nfz.moe](https://chrome.nfz.moe)

<!--more-->

在 METO 的 这篇文章 的启发下，我也自己做了一套 Chrome 离线包下载页面，如下图所示：

![0000185.png](https://bbs-static.nfz.yecdn.com/i/0000185.png)

我也写了一个 bash 脚本用来自动查询 Chrome 离线包数据，并丢在 Travis CI 上运行：

GitHub Repo: [ChromeChecker](https://github.com/neoFelhz/ChromeChecker)
Travis CI: [Build Status](https://travis-ci.org/neoFelhz/ChromeChecker)

-----

在本文的主要内容开始之前，我不得不放置一张和 Chrome 离线包查询无关的图片。

![0000186.png](https://bbs-static.nfz.yecdn.com/i/0000186.png)

上面这张图片是 METO 的那篇文章 下面的评论，和这个人和我的邮件交流过程。

为了防止再有伸手党过来烦人，而且我的脾气也非常差。所以，**本文拒绝提供任何技术细节**，任何相关问题的咨询一律一个问题 150RMB，十个问题以上八折，多不退少补。我的 Repo 都以 `Unlicense` 协议开源了，别来烦我了。

-----

简单地说，Chrome 内部的更新检查机制是对 https://tools.google.com 发起一个 POST 请求，Form data 的格式为

```xml
<?xml version='1.0' encoding='UTF-8'?>
<request protocol='3.0' version='1.3.23.9' shell_version='1.3.21.103' ismachine='0'
         sessionid='{3597644B-2952-4F92-AE55-D315F45F80A5}' installsource='ondemandcheckforupdate'
         requestid='{CD7523AD-A40D-49F4-AEEF-8C114B804658}' dedup='cr'>
<hw sse='1' sse2='1' sse3='1' ssse3='1' sse41='1' sse42='1' avx='1' physmemory='12582912' />
<os platform='win' version='6.3' arch='{{arch}}'/>
<app appid='{{appid}}' ap='{{ap}}' version='' nextversion='' lang='' brand='GGLS' client=''><updatecheck/></app>
</request>
```

METO 在他的文章中提供了一系列可以用的 appid ap 参数的值：

```
{{appid}}
Stable: 8A69D345-D564-463C-AFF1-A69D9E530F96,
Beta: 8A69D345-D564-463C-AFF1-A69D9E530F96",
Dev: 8A69D345-D564-463C-AFF1-A69D9E530F96",
Canary: 4EA16AC7-FD5A-47C3-875B-DBF4A2008C20
```
```
{{arch}}
x64, x86
```
```
{{ap}}
Stable
    "x86": "-multi-chrome",
    "x64": "x64-stable-multi-chrome"
Beta
    "x86": "1.1-beta",
    "x64": "x64-beta-multi-chrome"
Dev
    "x86": "2.0-dev",
    "x64": "x64-dev-multi-chrome"
Canary
    "x86": "",
    "x64": "x64-canary"
```

通过发起一个 POST 请求，带上 APPID 和 Key，就可以得到 Google 返回的 XML 的数据，格式化一下就像这样：

```xml
<?xml version="1.0" encoding="utf-8"?>

<response protocol="3.0" server="prod">
  <daystart elapsed_days="3967" elapsed_seconds="83981"/>
  <app appid="{8A69D345-D564-463C-AFF1-A69D9E530F96}" cohort="1:gu/lur:" cohortname="62_89_win" status="ok">
    <updatecheck status="ok">
      <urls>
        <url codebase="http://redirector.gvt1.com/edgedl/release2/chrome/eyeaRM1a5ls_62.0.3202.89/"/>
        <url codebase="https://redirector.gvt1.com/edgedl/release2/chrome/eyeaRM1a5ls_62.0.3202.89/"/>
        <url codebase="http://dl.google.com/release2/chrome/eyeaRM1a5ls_62.0.3202.89/"/>
        <url codebase="https://dl.google.com/release2/chrome/eyeaRM1a5ls_62.0.3202.89/"/>
        <url codebase="http://www.google.com/dl/release2/chrome/eyeaRM1a5ls_62.0.3202.89/"/>
        <url codebase="https://www.google.com/dl/release2/chrome/eyeaRM1a5ls_62.0.3202.89/"/>
      </urls>
      <manifest version="62.0.3202.89">
        <actions>
          <action arguments="--verbose-logging --do-not-launch-chrome" event="install" run="62.0.3202.89_chrome_installer.exe"/>
          <action Version="62.0.3202.89" event="postinstall" onsuccess="exitsilentlyonlaunchcmd"/>
        </actions>
        <packages>
          <package fp="1.2e363460a769f36f691210de5293506bb545654a0a3967a5c3fbcb1d9c582343" hash="62+NhjmNmmu/IItr6bxA2FE0FQY=" hash_sha256="2e363460a769f36f691210de5293506bb545654a0a3967a5c3fbcb1d9c582343" name="62.0.3202.89_chrome_installer.exe" required="true" size="45365352"/>
        </packages>
      </manifest>
    </updatecheck>
  </app>
</response>
```

其中可以看到返回的数据中包括了 6 个可用的 URL、文件名、版本号、文件大小、SHA_256 和 HASH。自行拼凑 URL、正则提取有关数据，就可以很容易实现一个查询器了。
我开源了的 ChromeChecker 写了几个简单粗暴的脚本，使用 `xmllint` `cat` `grep` `echo` `sed` 这几个简单粗暴的指令就完成了数据提取和合并。

Python 版可以看 [chrome-checker](https://github.com/unnamed5719/chrome-checker)。

----

另外开放一个 “API”，可以拿来造一些轮子。

请求地址：`https://neofelhz.github.io/ChromeChecker` （仅支持 HTTPS，HTTP 请求将会 301 强制跳转 HTTPS）
请求方式：GET
请求参数：chrome.xml chrome.min.xml
请求 `https://neofelhz.github.io/ChromeChecker/chrome.xml` 会返回格式化了的 XML 结果，用于阅读；请求 `https://neofelhz.github.io/ChromeChecker/chrome.xml` 会返回压缩后的 XML 文件。定时查询这一部分丢在 Travis CI 上跑，每 24 小时会查询一次（反正对于 Chrome 离线包查询，不需要 5 分钟就查询一次）。XML 中包括查询的时间、版本号、下载 URL 和文件名、SHA_256 等数据。
