---
title: Android 切换 F2FS 文件系统
tags:
  - TWRP
  - F2FS
  - 文件系统
  - Android
categories:
  - 分享镜
date: 2016-10-01 16:55:00
updated: 2016-10-01 16:55:00
thumbnail: https://blog.nfz.yecdn.com/img/thumbnails/switch-f2fs-file-system-for-android.jpg!blogth
---

F2FS 如今也是折腾 Android 的玩家口中的一个常见词汇。虽然 2014 年起就已经有 ROM 对其提供支持，但是一加发布了原生支持 F2FS 的氢 OS 7.0，和华为重金聘用了 F2FS 文件系统开发人员的新闻，又重新把 F2FS 推上了热点。

# 警告
切换文件系统为 F2FS 是一项有风险的行为。如果你的ROM的内核不能够支持 F2FS 文件系统，那么有可能导致一系列问题！这些问题并不是由 F2FS 文件系统引起！

# Why F2FS?
## F2FS 是什么
F2FS ，即 “Flash-Friendly File System”，是一种新的文件系统，用于 NAND 闪存一类的储存设备，甚至可以自移动设备广泛应用至服务器。三星应用了日志结构档案系统的概念，使它更适合用于储存设备。
## F2FS 的优点
F2FS 相对目前主流的 EXT3/4 格式，
- 更好的加密特性；
- 更快的读取速度；
- 加快针对零碎小文件的读写速度；
- 对固态存储的寿命保护；
- 娱乐兔跑分 UX 性能可以增加 3000 多分（~~不重要~~）。

# How to F2FS?
## 选择合适的ROM
首先你得选择一个支持 F2FS 的 ROM 。比如说我的 nubia Z9 max 的 NubiaUI 并不支持 F2FS ，但是适配的 Mokee 和 CM 都是支持的。
## 刷入一个第三方 recovery
最好是 TWRP 。因为 TWRP 支持可视化和触摸操作，也支持文件系统转换等很多功能。TWRP 支持 F2FS 的版本是 2.8.6.1+ 。本人使用的是 TWRP3.0.2-2-stalence-nx510j-unofficial 。
## 备份数据
备份你的数据，包括使用钛备份应用数据，用 TWRP 备份存储 system、data 分区。
把内部存储和外部存储的数据也全部拷贝到电脑上。

> 现在绝大部分手机都已经实现了 data 分区和内置存储合并，这样一旦转换 data 分区的文件系统以后，内置存储也会被清空。

## 切换分区
1. 在 TWRP 下，先清除下述分区的内容：cache、data、system（可选）。
2. “高级清除菜单”，勾选 Data ，“修复或转换文件系统”，“转换文件系统”，选择 F2FS 。
3. 用同样的方法，转换Cache分区为 F2FS 。
4. 对于 System 分区要特别注意，有的 ROM 不支持 System 分区为 F2FS ，而且刷 ROM 前刷机脚本也没有提示或者自动转换分区功能。所以一旦转换 System 分区以后无法开机，你可以直接退回 TWRP ，把 System 再转换回 ext4 ，重新刷入 ROM 一遍即可。

全部转换以后，再用 TWRP 看一下分区是不是已经转换好了。然后就可以享受 F2FS 给你带来的丝滑的感受了

## 还原数据

先把 TWRP 文件夹拷回手机（这个文件夹中有分区备份文件），然后在TWRP的设置中，把“使用 rm-rf 指令代替格式化”的选项勾上，以便实现跨文件系统还原分区，然后再用 TWRP 还原 system 和 data 分区。

当分区还原完以后就可以开机进系统测试一下，如果一切正常，就再把存储内的数据拷回手机即可。
