---
title: 为什么安装 Xposed 以后会导致卡顿
date: 2017-02-01 23:55:12
updated: 2017-02-01 23:55:12
categories:
    - 实验室
tags:
    - Android
    - Xposed
    - 卡顿
toc: false
thumbnail: https://blog.nfz.yecdn.com/img/thumbnails/why-xposed-cause-unsmooth-exprience.png!blogth
---

经常有人说 Xposed 会带来卡顿的操作体验，甚至会引起掉帧等糟糕的后果。所以我再一次阅读完 Xposed  的文档以后，希望能用**通俗的方式**做一个回答。

<!--more-->

Xposed 的工作原理我在[《阻止运行、猎鹰网络、黑域 始末》](https://blog.neofelhz.space/archives/forcestopgb-lieying-brevent.html)一文中介绍 Xposed Moudule 的权限时做了简单介绍。这里我再详细地说一遍：

> Xposed 的工作原理是通过替换或劫持 `/system/bin/app_process` 控制 `zygote`（而 `zygote` 孵化了所有应用的进程，可以形象地称之为“进程之母”），使 `app_process` 在启动过程中加载 Xposed 的重要部分 `XposedBridge.jar`，这一段 Java 包含了所有的劫持方法，从而完成对 `Zygote` 进程及其创建的 `Dalvik 虚拟机` 的劫持，Xposed 在开机的时候利用 `XposedBridge.jar` 完成在原 Function 执行的前后加上自定义代码的操作，从而完成所有的 Hook Functions。

在 Android L 时，Xposed 是通过劫持 `app_process` 来达到 hook 的目的。到了 Android M，谷歌再一次加强了系统安全性，加强了对系统底层（主要是框架 framework）的封装。所以为了实现 hook，就不得不修改 ART（Android Run Time，Android 虚拟机执行进程的方式），从而对 app_process 提供接口。这就是为什么当时 Android L 和 M 的 Xposed 憋了老久才放出来的原因。当然这一次 Android N 的 Xposed 迟迟不出来原因主要是系统安全性的增强和由于系统分区加固而可能需要另辟蹊径 Systemless 的缘故。

说了这么多，还没有说 `hook` 是什么东西。`hook`，钩子的意思。那么这个钩子拿来钩什么东西？（反正不是鱼）实际上，钩子钩的是资源，进程调用的资源。让系统本来从 APP 中读取的资源重定向到第三方的模块，这样就实现了在不修改 APP 的情况下实现了对系统资源、APP 资源的替换！从 Zygote 产生出进程开始就已经完成了劫持。这里就和模块有关了。Xposed 提供了一系列钩子，这些钩子就是接口。开发 Xposed 模块的开发者只需要找到需要替换的资源、框架，用 Xposed 的钩子实现替换即可。

> 为什么钩子可以实现这个？因为 APK 在运行时会进入虚拟机（Dalvik 或者 ART），然而你在虚拟机里面劫持了原本的 Java API，制作了一个新的可供操作的 API，当然可以实现资源替换、字节码替换了。

那么 Xposed 到底消耗不消耗系统的性能？

Android L 以后，Xposed 会在标准的运行 `zygote` 进程的基础上制作一个新的 带有 Xpsed API 的 运行环境。所以在没有用到 Xposed 的地方，原来怎么运行的程序依然按原来的方式运行。Xposed 只有在应用启动时会根据钩子执行一些替换工作。这部分执行得是非常快的，所以你是不会意识到应用启动速度的差别的，而且这部分占用的内存是很少的。这就是为什么一些改动需要重启才能生效的原因了。所以说，单纯刷入 Xposed，是并不会引起系统卡顿的。

那么为什么 Xposed 会使用户觉得卡顿了呢？当 hook 没有启用时，系统是几乎无影响的。但是你一旦安装了模块以后，hook 开始发挥作用，然后开始替换系统资源为模块自己的代码（排除流氓终结者、核心破解、XPrivacy 这类仅仅篡改了返回值的模块），比如重力工具箱要 hook 系统 Framework 和 SystemUI 的资源。而且，重力工具箱要修改的地方要更底层一些，这样才能实现不重启实时完成切换切换并生效（XnubiaUI 模块，相当于 nubiaUI 上的重力工具箱，也是对 nubiaUI 的功能、界面进行调整的 Xposed 模块，它就没有做实时生效）。在这样的设计中，相当于一次要启用大量钩子随时调用，那么在 UI 层面就有大量改动需要用到钩子。于是在这些调用中，执行速度受到了一些影响。

---

总结：单单安装 Xposed 是不会引起卡顿的，影响运行速度的并不是完全在于模块多少。是否影响卡顿取决于模块的功能本身，越需要经常 hook 替换资源的模块、需要替换大量资源的模块、hook 越接近系统底层的模块，最容易拖慢运行速度。此外，模块的功能实现设计、代码写得是否优雅等，都会影响到运行速度。此外，在目前富余的性能配置面前，Xposed 带来的系统卡顿固然不可忽略，但是一般人感觉是不会太明显的。更何况，在国内 BAT 毒瘤滥用广播接收器、毒瘤后台服务面前，我们还是使用 Xposed 模块来镇压毒瘤显得更为合适——不然造成的卡顿不是 Xposed Hook 所能够比拟的。
