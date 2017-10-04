---
title: Android 的网络感叹号
tags:
  - Android
  - Root
  - Captive
categories:
  - 实验室
date: 2016-12-20 20:06:42
updated: 2017-8-16 1:06:17
thumbnail: https://s.nfz.yecdn.com/img/thumbnails/android-captive-portal-min.png!blogth
---

从 Android L 开始，原生和 CM 的 ROM 用户就会发现，状态栏的网络信号莫名多了一个感叹号。而且，有的时候明明连着 WIFI 用得好好的，却突然跳到数据流量。

<!--more-->

# “感叹号”出现的原因和作用
Android 5.0 开始引入了一种新的网络评估机制来评估网络状况，当你有网络请求时会自动选择网络连接条件最好的一个网络进行连接（也就是WIFI和数据之间自动切换）。自然，验证方法是连接到 Google 自家的服务器进行检查。

> 这个检测的作用除了可以检查该网络是否能够使用以外，还能检查该网络是否需要登陆（就是运营商的 WiFi 如 CCMC，或者其它公共场所的免费 WiFi 的那个认证）。

----

正是这个 google 被 Wall 掉了以后导致安卓没有办法评估网络。所以，系统每隔一定时间都会重新尝试连接，就在不知不觉中消耗了数据流量。更恐怖的就是 Android 认为在 WiFi 下无法连接互联网，就让联网的程序通通走流量。于是这样就导致了那个蛋碎的感叹号一直存在，以及WiFi用着用着突然自动连回数据连接了。

# 解决方法

## Android 5.0-6.0

### 直接禁用验证

手机连接电脑开启USB调试，输入以下ADB命令：

```bash
adb shell "settings put global captive_portal_detection_enabled 0"
```

重启设备或者开关一下飞行模式就行。

> 但是，还记得我说过么，这个感叹号可以用来判断网络可用性，还可以用来判断网络是否需要登录。

### 更换验证地址

当然还有另外一个方法，就是直接把这个服务地址切换到国内的可用的地址就行了。这样既可以去除叹号，也可以检查网络可用情况。

```bash
adb shell "settings put global captive_portal_server your.domain"
```

### 恢复方法
如果你用的是第一种方法，恢复方法是：

```bash
adb shell "settings put global captive_portal_detection_enabled 1"
```

如果你用的是第二种方法，那么你需要输入的是：

```bash
adb shell "settings delete global captive_portal_server"

```

## Android 7.0-7.1.0

与 Android 5.0-6.0 所用的方法相同，只是验证要求从 443 端口进行，也就是说必须要支持通过 HTTPS 正常访问。

也可以通过 ADB 输入以下指令禁用 HTTPS：

```bash
adb shell "settings put global captive_portal_use_https 0"
```

恢复 HTTPS 的方法是用 ADB 输入以下指令：

```bash
adb shell "settings put global captive_portal_use_https 1"

```
或者

```bash
adb shell "settings delete global captive_portal_use_https"
```

## Android 7.1+

从 Android 7.1.1 开始，系统在验证时不会自动加入 `generate_204` 的后缀了，这意味着 url 可以设计的更加灵活，同时也意味着在设置的时候需要填入完整的 url，即需要在现有的 url 验证地址后面加上 `/generate_204`

同时也默认要求使用 HTTPS 的方法进行验证。禁用和恢复 HTTPS 检查的方法同 [Android 7.0 ~ 7.1.0](#Android-7-0-7-1-0) 的方法。

在 Android 7.1+ 上配置 Captive Portal 地址需要两行指令：

```
adb shell "settings put global captive_portal_http_url http://yourdomain"; 
adb shell "settings put global captive_portal_https_url https://]]yourdomain";
```

## 手机端应用

[小狐狸](www.noisyfox.cn)开发了这款“叹号杀手”应用实现了这个：[酷安下载地址](http://www.coolapk.com/apk/org.foxteam.noisyfox.noexclamation)

用这款应用可以快速设置禁用验证或者更换验证地址。~~可能~~需要 root，如果没 root ~~可能~~会导致修改失败。

# 架设自己的验证服务

这个验证机制是访问所给地址的`generate_204`子目录看返回值，所以可以这么解决：

## Apache

开启Rewrite模块（大部分虚拟主机商都会帮你开好），在 `.htaccess` 文件中最末写入以下值：

```apacheconf
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_URI} /generate_204$
  RewriteRule $ / [R=204]
</IfModule>
```
## Nignx

直接在配置文件中写入：

```nginx
location /generate_204 { return 204; }
```
## Workaround

~~如果你没有服务器（比如你只用pages服务），或者上述设置方法全部无效，还有一个workaround的方法——直接建立一个名字叫做“generate_204”的空文件，因为空文件也会被Android当做是204返回（毕竟空文件绝对不会是网络登录验证咯）~~ 经测试，这种方法已经不能生效了。

## 验证服务地址

- www.qualcomm.com/generate_204（高通）
- noisyfox.cn/generate_204（小狐狸）
- ~~www.v2ex.com~~（V2EX 旧 Captive 地址，已弃用）
- captive.v2ex.co/generate_204（V2EX 新 Captive 地址）
- ~~bbs.mfunz.com~~（魔趣开源项目，已弃用）
- g.cn/generate_204（谷歌中国，一个不存在的网站）
- google.cn
- developer.google.cn/generate_204（谷歌开发者文档中国）
- http204.sinaapp.com/generate_204（Tink 提供，运行在 SAE 上）

# 分析 NetWorkMonitor 的工作原理

## Android 5.0~6.0

以下代码摘自 [Android 6.0.1_r70 分支](https://android.googlesource.com/platform/frameworks/base/+/android-6.0.1_r70/services/core/java/com/android/server/connectivity/NetworkMonitor.java) 的 `NetworkMonitor` 第 384 行至第 425 行

```java
@Override
public boolean processMessage(Message message) {
    switch (message.what) {
        case CMD_REEVALUATE:
            if (message.arg1 != mReevaluateToken || mUserDoesNotWant)
                return HANDLED;
            // Don't bother validating networks that don't satisify the default request.
            // This includes:
            //  - VPNs which can be considered explicitly desired by the user and the
            //    user's desire trumps whether the network validates.
            //  - Networks that don't provide internet access.  It's unclear how to
            //    validate such networks.
            //  - Untrusted networks.  It's unsafe to prompt the user to sign-in to
            //    such networks and the user didn't express interest in connecting to
            //    such networks (an app did) so the user may be unhappily surprised when
            //    asked to sign-in to a network they didn't want to connect to in the
            //    first place.  Validation could be done to adjust the network scores
            //    however these networks are app-requested and may not be intended for
            //    general usage, in which case general validation may not be an accurate
            //    measure of the network's quality.  Only the app knows how to evaluate
            //    the network so don't bother validating here.  Furthermore sending HTTP
            //    packets over the network may be undesirable, for example an extremely
            //    expensive metered network, or unwanted leaking of the User Agent string.
            if (!mDefaultRequest.networkCapabilities.satisfiedByNetworkCapabilities(
                    mNetworkAgentInfo.networkCapabilities)) {
                transitionTo(mValidatedState);
                return HANDLED;
            }
            mAttempts++;
            // Note: This call to isCaptivePortal() could take up to a minute. Resolving the
            // server's IP addresses could hit the DNS timeout, and attempting connections
            // to each of the server's several IP addresses (currently one IPv4 and one
            // IPv6) could each take SOCKET_TIMEOUT_MS.  During this time this StateMachine
            // will be unresponsive. isCaptivePortal() could be executed on another Thread
            // if this is found to cause problems.
            int httpResponseCode = isCaptivePortal();
            if (httpResponseCode == 204) {
                transitionTo(mValidatedState);
            } else if (httpResponseCode >= 200 && httpResponseCode <= 399) {
                transitionTo(mCaptivePortalState);
            } else {
```

当安卓设备联网后，如果该网络是 VPN，那么直接使用这个网络进行连接，否则调用 `isCaptivePortal()` 函数进行网络状况的判定，再根据判定结果决定是否选用此网络。这个函数就会先访问系统内指定的网址并根据返回结果来判断网络状况，而这个网址如字面所说，会产生一个 204 返回值。204 返回值的意思就是空内容。如果当 WiFi 是需要登录才可以连接，那么当试图访问 google 的服务器的链接就一定会自动跳转到一个登录页面，这个时候 http 请求的返回值就必然不是 204。就是通过这一机制，便可以区分当前 WiFi 是否需要验证，不得不佩服想出这个办法的人来。

## Android 7.0-7.1.0

以下代码摘自 [Android 7.1.0_r2 分支](https://android.googlesource.com/platform/frameworks/base/+/android-7.1.0_r2/services/core/java/com/android/server/connectivity/NetworkMonitor.java) 的 `NetworkMonitor` 第 336 行至第 386 行。

```java
@Override
public boolean processMessage(Message message) {
    switch (message.what) {
        case CMD_LAUNCH_CAPTIVE_PORTAL_APP:
            final Intent intent = new Intent(
                    ConnectivityManager.ACTION_CAPTIVE_PORTAL_SIGN_IN);
            intent.putExtra(ConnectivityManager.EXTRA_NETWORK, mNetworkAgentInfo.network);
            intent.putExtra(ConnectivityManager.EXTRA_CAPTIVE_PORTAL,
                    new CaptivePortal(new ICaptivePortal.Stub() {
                        @Override
                        public void appResponse(int response) {
                            if (response == APP_RETURN_WANTED_AS_IS) {
                                mContext.enforceCallingPermission(
                                        android.Manifest.permission.CONNECTIVITY_INTERNAL,
                                        "CaptivePortal");
                            }
                            sendMessage(CMD_CAPTIVE_PORTAL_APP_FINISHED, response);
                        }
                    }));
            intent.setFlags(
                    Intent.FLAG_ACTIVITY_BROUGHT_TO_FRONT | Intent.FLAG_ACTIVITY_NEW_TASK);
            mContext.startActivityAsUser(intent, UserHandle.CURRENT);
            return HANDLED;
        default:
            return NOT_HANDLED;
    }
}
@Override
public void exit() {
    Message message = obtainMessage(EVENT_PROVISIONING_NOTIFICATION, 0,
            mNetworkAgentInfo.network.netId, null);
    mConnectivityServiceHandler.sendMessage(message);
}
}
/**
* Result of calling isCaptivePortal().
* @hide
*/
@VisibleForTesting
public static final class CaptivePortalProbeResult {
static final CaptivePortalProbeResult FAILED = new CaptivePortalProbeResult(599, null);
final int mHttpResponseCode; // HTTP response code returned from Internet probe.
final String mRedirectUrl;   // Redirect destination returned from Internet probe.
public CaptivePortalProbeResult(int httpResponseCode, String redirectUrl) {
    mHttpResponseCode = httpResponseCode;
    mRedirectUrl = redirectUrl;
}
boolean isSuccessful() { return mHttpResponseCode == 204; }
boolean isPortal() {
    return !isSuccessful() && mHttpResponseCode >= 200 && mHttpResponseCode <= 399;
}
}
```

## Android 7.1.1

以下代码摘自 [Android 7.1.1_r4 分支](https://android.googlesource.com/platform/frameworks/base/+/android-7.1.1_r4/services/core/java/com/android/server/connectivity/NetworkMonitor.java) 的 `NetworkMonitor` 第 611 行至第 631 行。
可以看到 Android 7.1.1 开始已经不会再自动给验证 url 加上 `generate_204`。

```java
private static String getCaptivePortalServerHttpsUrl(Context context) {
return getSetting(context, Settings.Global.CAPTIVE_PORTAL_HTTPS_URL, DEFAULT_HTTPS_URL);
    }
public static String getCaptivePortalServerHttpUrl(Context context) {
  return getSetting(context, Settings.Global.CAPTIVE_PORTAL_HTTP_URL, DEFAULT_HTTP_URL);
    }
private static String getCaptivePortalFallbackUrl(Context context) {
  return getSetting(context,
  Settings.Global.CAPTIVE_PORTAL_FALLBACK_URL, DEFAULT_FALLBACK_URL);
    }
private static String getCaptivePortalUserAgent(Context context) {
  return getSetting(context, Settings.Global.CAPTIVE_PORTAL_USER_AGENT, DEFAULT_USER_AGENT);
    }
private static String getSetting(Context context, String symbol, String defaultValue) {
  final String value = Settings.Global.getString(context.getContentResolver(), symbol);
  return value != null ? value : defaultValue;
    }
```
