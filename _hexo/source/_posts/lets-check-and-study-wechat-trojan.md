---
title: 拨开云雾见天明——解析酷安新出现的微信盗号木马
categories:
  - 实验室
tags:
  - 病毒
  - Android
  - 安全
date: 2017-01-21 21:42:00
updated: 2017-01-23 23:47:00
---

一日，某不安好心者在酷安的 Xposed 模块 “App Setting” 的评论区发布了一条评论——“APP Setting 专业版”。一位用户下载使用后中招——微信密码泄露，账户被盗刷。

<!--more-->

随后，酷友反应，在著名 Android 优化应用 “绿色守护” 的评论区同一个人发布了所谓 “绿色守护绿色版” 同样有涉嫌病毒的嫌疑。一时间酷安疑云四起，甚至引起了酷安的多位小编对各类修改版应用的抵制，对 QQ 美化版影响尤为巨大。
本人有幸在那个居心叵测的人被酷安的小编们删帖之前成功地下载到了两个样本。现在我将通过逆向这个病毒，来弄清楚这个里面到底有多少猫腻。

> 另外，感谢酷友 [DBin_K](http://www.coolapk.com/u/523048) 以身试毒、安装“体验”并抓包，获得了宝贵的截图和数据。

# 0x00

> 工欲善其事必先利其器。这是本人使用的工具。

- ROM IDE+
- MT 管理器
- Packet Capture
- Beyond Compare
- 安装包解析工具

> ~~这些是病毒的样本。本人已经混淆了这些 Apk 资源，确保不会再被其它不法分子反编译、用于其它非法用途！~~不再提供病毒样本。

# 0x01

以下是受害者酷友“阿光正传”的经历。

<img src="https://bbs-static.nfz.yecdn.com/i/0000012.png" alt="0000012.png" style="width:50%" />

# 0x02

以被打包过的 App Setting 为例。
首先使用 ROM IDE+（核心是 APkTool）对正常的 APP Setting 和被打包多的 APK Setting 进行反编译，然后使用 Beyond Compare 比对反编译出来的东西有什么区别。
首先可以看到 `AndroidManiFest.xml` 的区别，可以看到被打包过的 App Setting 多申请了这些权限。

- 读取设备信息
- 读写短信
- 读取联系人
- 开机自动启动
- 震动权限
- 挂载文件系统
- 读取存储
- **在其它应用上层显示内容**

![0000014.png](https://bbs-static.nfz.yecdn.com/i/0000014.png)

> 上图中左边是被打包应用的 `AndroidManiFest.xml`，右边是正常应用的 `AndroidManiFest.xml`。

![0000015.png](https://bbs-static.nfz.yecdn.com/i/0000015.png)

除此以外还可以从第二张图里看到，被打包过的应用还额外内置了两个 Activity，分别是 `com.android.append.MainActivity` 和 `com.android.append.MainActivity2`。这两个活动所包含的包名和应用本身的包名 `de.robv.android.xposed.mods.appsettings` 并不相符。所以意味着这两个活动并没有写进打包的应用中，而是额外的独立应用。

> 而且，这个应用伪装成了系统组件（这个额外的应用的包名为 com.android.append）

# 0x03

![0000016.png](https://bbs-static.nfz.yecdn.com/i/0000016.png)

这张图可以看到被打包的应用还新增了一个 `drawable` 文件夹，内建了一个假的微信悬浮窗和微信登陆界面的样式，可以看到微信的 icon 和登陆的界面图片，以及定义界面的 xml。随便摘录一段给大家看看。

```xml
<shapexmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#e5fafafa" />
    <corners android:radius="5.0dip" />
</shape>
```

<img src="https://bbs-static.nfz.yecdn.com/i/0000009.png" alt="0000009.png" style="width:50%" />

![0000018.png](https://p0.ssl.qhmsg.com/t01cedd34ff12d84b79.png)

实际效果像这样（由 DBIn_K 提供截图）：

<img src="https://bbs-static.nfz.yecdn.com/i/0000013.png" alt="0000013.png" style="width:50%" />

> 还有模有样的，不是么？

# 0x04

从那张图里还可以看到，除了一些 smali 的不同，还有一个显著区别就是`asset`目录下竟然内置了一个小的 timesync.apk！
将它提取出来，用 MT 管理器和安装包解析工具加以分析：

![0000021.png](https://bbs-static.nfz.yecdn.com/i/0000021.png)

> 原来这个就是那个 `com.android.append`。伪装应用名为 SuperSU,，以便瞒天过海。

再对其进行反编译，查看里面到底有什么猫腻。

![0000019.png](https://bbs-static.nfz.yecdn.com/i/0000019.png)

查看里面的文件目录树可以看出来同样是内置了一套悬浮窗的样式，除此以外还内置了一套微信登录界面的样式。
同样只摘录一段给大家看看就行：

```xml
<RelativeLayout android:layout_width="wrap_content" android:layout_height="wrap_content">
    <ImageView android:background="#ff393a3f" android:layout_width="wrap_content" android:layout_height="48.0dip" android:layout_marginLeft="0.0dip" android:layout_marginTop="0.0dip" android:src="@drawable/wx_top" android:scaleType="fitStart" />
    <View android:background="#00000000" android:layout_width="48.0dip" android:layout_height="48.0dip" android:layout_marginLeft="0.0dip" android:layout_marginTop="0.0dip" android:onClick="btnBack_onClick" />
    <TextView android:textSize="18.0dip" android:textColor="#ffffffff" android:paddingLeft="60.0dip" android:layout_width="fill_parent" android:layout_height="48.0dip" android:layout_marginTop="3.0dip" android:text="解除登录限制" />
    <TextView android:textSize="14.0dip" android:textColor="#ff999999" android:paddingLeft="60.0dip" android:layout_width="fill_parent" android:layout_height="48.0dip" android:layout_marginTop="26.0dip" android:text="微信安全支付" />
</RelativeLayout>
<TextView android:textSize="16.0dip" android:textColor="#ff999999" android:gravity="center_horizontal" android:layout_width="fill_parent" android:layout_height="wrap_content" android:layout_marginTop="40.0dip" android:text="请输入支付密码，以验证身份" />
```

还有这一段：

```xml
<LinearLayout android:orientation="horizontal" android:layout_width="fill_parent" android:layout_height="wrap_content">
    <TextView android:textSize="16.0dip" android:textColor="#ff353535" android:layout_width="69.0dip" android:layout_height="wrap_content" android:layout_marginLeft="20.0dip" android:layout_marginTop="30.0dip" android:text="账  号" />
    <EditText android:textSize="16.0dip" android:textColor="#ff353535" android:textColorHint="#ffdddddd" android:id="@id/ed_wx_account" android:background="@null" android:layout_width="220.0dip" android:layout_height="wrap_content" android:layout_marginTop="30.0dip" android:hint="微信号/手机号/Email" />
</LinearLayout>
<View android:id="@id/vw_wx_line1" android:background="#ff45c01a" android:layout_width="fill_parent" android:layout_height="0.5dip" android:layout_marginLeft="10.0dip" android:layout_marginTop="13.0dip" android:layout_marginRight="10.0dip" android:layout_marginBottom="13.0dip" />
<LinearLayout android:orientation="horizontal" android:layout_width="fill_parent" android:layout_height="wrap_content">
    <TextView android:textSize="16.0dip" android:textColor="#ff353535" android:layout_width="69.0dip" android:layout_height="wrap_content" android:layout_marginLeft="20.0dip" android:text="密  码" />
    <EditText android:textSize="16.0dip" android:textColor="#ff353535" android:textColorHint="#ffdddddd" android:id="@id/ed_wx_password" android:background="@null" android:layout_width="fill_parent" android:layout_height="wrap_content" android:hint="密码" android:inputType="textPassword" />
</LinearLayout>
<View android:id="@id/vw_wx_line2" android:background="#ffd8d8d8" android:layout_width="fill_parent" android:layout_height="0.5dip" android:layout_marginLeft="10.0dip" android:layout_marginTop="13.0dip" android:layout_marginRight="10.0dip" android:layout_marginBottom="13.0dip" />
<Button android:enabled="false" android:textSize="17.0dip" android:textColor="@drawable/login_button_textcolor" android:id="@id/btn_wx_login" android:background="@drawable/login_button_background" android:layout_width="fill_parent" android:layout_height="47.0dip" android:layout_marginLeft="10.0dip" android:layout_marginTop="10.0dip" android:layout_marginRight="10.0dip" android:text="登录" android:onClick="Button_onClick" />
<TextView android:textSize="15.0sp" android:textColor="#ff576b95" android:layout_gravity="center" android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="20.0dip" android:text="登录遇到问题 ?" />
```

实际效果就像这样（由以身试毒的酷友 DBin_K 提供截图）：

<img src="https://bbs-static.nfz.yecdn.com/i/0000010.png" alt="0000010.png" style="width:50%" />
<img src="https://bbs-static.nfz.yecdn.com/i/0000005.png" alt="0000005.png" style="width:50%" />

> “解除登录限制”、“微信安全支付”、“请输入支付密码，以验证身份”、“登录遇到问题？” ，真的很具有迷惑性。

# 0x05

酷友 DBin_K 还发现病毒的核心组件还申请了 root 权限，他把 su 权限以后 SuperSU 抓到些日志。这些日志都是满满的 `cat` 指令，从微信的数据文件夹`/data/data/com.tencent.mm`合并了很多文件到它自己的数据目录`/data/user/0/com.android.append`下面。具体要这些数据是为了什么还不清楚（我自己没有微信，所以没法知道它获取的这些是什么数据）

> 更新：获取这些数据是为了微信跨设备登陆，具体参见 0x07。

![0000020.png](https://bbs-static.nfz.yecdn.com/i/0000020.png)

现在来看他病毒核心的 smali，粗略一看，里面值得我们关注的主要是三个部分，一个是基于 google 开发的解析 json 的框架 gson，一个是由 Jakewharton 开发的 DiskLruCache 缓存，一个是 loopj 开发的 android-async-http。这几个就是用来把获取到的数据传回作者的服务器。
本来我可以直接一个一个看 smali ，直到找到他数据回源的域名，但是后来 DBin_K 直接开了抓包，拿到了数据回源的地址：`uu636.com/update.aspx`。所以我就没有继续看下去。

<img src="https://bbs-static.nfz.yecdn.com/i/0000007.png" alt="0000007.png" style="width:50%" />

# 0x06

现在这个病毒的原理很明显了：始作俑者专找 Xposed 和 Root 类应用下手，因为这类应用有很好的后台存活性，以便随时出来作案；然后是病毒的核心组件伪装成 SuperSU 向受害者申请 root 权限，把病毒核心注入 system/app ，并收集用户的微信的数据库；接着是由于`ANdroidManiFest.xml`中定义了在在其它应用显示的权限，每十分钟会弹出一个假的弹窗提示你“微信登陆已过期，需要重新登陆”，从而把受害者骗进他们那个做的非常逼真的登陆界面，直到套出用户的用户名和密码；最后这些信息会被回传给始作俑者的服务器，然后很快就会用这些信息盗刷受害者的微信钱包。同时，root 权限帮助病毒核心组件长期存活，就算受害者使用 RE 管理器删除了组件，也会不断复活。

# 0x07

> 2017-01-23 更新：

1. 根据学习软件工程的逆向大佬 iKirby 分析，获取微信的数据文件是为了实现跨设备微信登陆；
2. 从百度贴吧可以获得的公开的资料得知，这个团伙从今年年初就已经开始作案（几次病毒的行为都高度相似），已经有将近十名受害者被骗。
3. 查询一下这个域名的 Whois 信息可以看到，这个域名是在国内购买的，同时启用了域名 Whois 隐私保护，所以查不到域名所有人的信息。

![0000025.png](https://bbs-static.nfz.yecdn.com/i/0000025.png)
![0000026.png](https://bbs-static.nfz.yecdn.com/i/0000026.png)

根据全网 ping 的响应速度，的确应该是靠近国内地区的服务器。但是又找不到备案信息，所以这个服务器应该是在香港（我用我朋友在香港沙田机房的 VPS ping 了一下发现耗时是 0ms，结果不言而喻）
5. 在酷友 [llllllllllll666](http://www.coolapk.com/u/554126) 和酷安的开发组成员 [liubaoyua](http://www.coolapk.com/u/346976) 对病毒的逆向下获得了 java 部分。详见 0x08。

# 0x08

在酷友 llllllllllll666 和酷安开发组成员 liubaoyua 的反编译下发现了几个类，大概就是这些作用：

- 劫持微信快捷方式

![0000043.png](https://bbs-static.nfz.yecdn.com/i/0000043.png)

代码如图，当获取到 root 权限以后木马核心会开始寻找启动器下的微信的快捷方式劫持到自己的桌面活动 `com.android.append.Launcher.Activity`，这样受害者点击微信你图标也会触发打开伪造的登陆界面。

- 卸载微信

![0000044.jpg](https://bbs-static.nfz.yecdn.com/i/0000044.jpg)

这个就简单了，仅仅只是卸载微信而已。

- 一键变砖

![0000042.png](https://bbs-static.nfz.yecdn.com/i/0000042.png)

这个是挂载 system 分区，然后删除 `system/framework/` 文件夹，也就是删除了系统框架，可以导致手机变砖。

> 后面两个是服务端远程控制实现的，所以请各位“以身试毒”的大无畏者务必小心，小心**被远端遥控一键变砖**！！
