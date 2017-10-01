---
title: 制服火龙——为骁龙810降温
tags:
  - 温控
  - 骁龙 810
  - CPU
  - Android
  - 省电
categories:
  - 实验室
date: 2016-08-30 17:19:00
updated: 2016-08-30 17:19:00
thumbnail: https://blog.nfz.yecdn.com/img/thumbnails/coding-snapdragon-810-down.jpg!blogth
---

> “高通骁龙 810 是我们的一款失败的产品”——高通工程师

<!--more-->

# 骁龙 810
## 基本参数

首先给一下 Qualcomm MSM8994 Snapdragon 810 的基本参数：
> 4x Quad-core 2.0 GHz ARM®Cortex™ A57 （big）@ 1.96GHz and 4x quad-core 1.5 GHz ARM®Cortex™ A53（LITTLE）@ 1.56GHz；Adreno 430 GPU；X10 LTE modem；20nm LMP。

## 温控数据

根据高通工程师高通设定的原厂限制是核心温度达到 95℃ 的时候 A57 开始降频，105℃ 核心强制下线，115℃ 设备重启。
nubiaUI来自原厂的温控二进制内的 system/bin/thermal-engine 做了优先级更高的进一步限制： GeekBench 和安兔兔类跑分类应用加入了“白名单”在 95℃ 降频，而非白名单的应用运行在75℃就开始降频了。
高通吧的吧主炮神就拿 Nubia z9 max （这也正是我的主力机）做过拷机测试，测试结果是如果只有一颗A57进行开机的话，满载直接超过100度，两颗A57开机满载直接爆机重启。
> 单个 2GHz A57 核心，满载坚持 1 分多钟后达到 105℃ 左右，没有降频，但直接就重启了。两个 2GHz A57 核心，最多不到 5 秒钟就冲到 105℃ ，然后重启。A53 核心就好多了，1.56GHz 频率下单个满载不超过 50℃，双核大约50℃ ，四核也才 61℃ ，都过得去。
> 经过计算可知，骁龙 810 里边单个 1.56GHz A53 核心的满载功耗大约是 400-470mW ，看起来不高但经不起对比啊：海思 930 1.5GHz 350mW、2.0GHz 570mW，联发科 MT6752 1.7GHz 400mW，而且它俩都还是 28nm 。A57 就太恐怖了，2GHz 频率下单个就达到了 4.9W ，双核直接爆机没法测试——是手机处理器啊亲！20nm工艺啊亲！ Intel Core M 都能做到 TDP 4.5W 啊！

所以 A57 才是骁龙 810 发热的罪魁祸首。但是 A57 的性能不容小觑。用 z9 max 进行圆周率测试来测试性能——跑 1000 万位圆周率，只开 4 颗A53，需要 72 秒，但是开着 4 颗 A53 和 2 颗 A57 只要 31 秒，A57 间断开启的话（温控限制）也只要 42 秒。


# 一些事实
我有一次有幸和高通（中国）的工程师在微信上交流过。最后结论就是：

- CPU 频率越高，CPU 电压越高，发热越多，越耗电
- kyro 架构的 CPU 分体质（801、805、820），体质越高，相同频率电压可以更低，但一些 CPU 电压太低会重启
- ARM 公版架构的 CPU 没有体质这一说法，但是仅仅只是说法不同罢了。
- 因为频率越高，核心间电压也要升高，所以就会越来越耗电。 
- 核心之间电压越高，发热越多耗电越快。

>  比如一加一的内核支持CPU修改电压，很多加油都选择 CPU 降压解决发热（很多用户都选择每个频率降压 20-30mV）

nubia 的内核就不支持修改电压。怎么办？
控制频率调整机制呗，既然电压和频率有关。
真正的关键并不是现在很多人认为的那样去限制最大频率，而是不要让频率升的太快。对于 CPU ，如果想要省电，那么频率就要尽可能低，升频要慢，降频要快。
当然对于性能的需求来说恰恰相反，追求更好的性能就要求较高的频率需求。
其次另外还有一个矛盾，就是在待机的时候， CPU 核心数越少越好。这个时候多核待机就耗电了。
> 通俗点、简单点说就是——多核高频如尿崩，多核低频很省电，多核待机很耗电，少核高频很耗电，少核低频跑不动，少核待机不耗电。

> 当然，耗电大户一般都是屏幕，屏幕的功率有 50W 左右。关掉屏幕应该就会省电多了。也可以理解关屏听音乐，虽然唤醒锁没被释放，但是耗电却比开屏少了一半。

> 再补充一下，虽然联发科已经被人嘲笑一核有难，九核围观，然而基于 corepilot 的异构异步多核会根据负载开关核心，虽然性能不怎么地，但是省电倒是真的。


# 基本思路

1. 在待机时核心数要少，操作时核心数要多。
2. 尽量让 CPU 运行在较低频率。
3. 根据频率区间不同调整升频间隔，尽可能解决省电与性能的矛盾。


# 操刀，上！
来我们来分析 init.qcom.post_boot.sh 脚本中
的几个调速器有关的片段，来看看如何实现基本思路。

```bash
# ensure at most one A57 is online when thermal hotplug is disabled
echo 0 > /sys/devices/system/cpu/cpu5/online
echo 0 > /sys/devices/system/cpu/cpu6/online
echo 0 > /sys/devices/system/cpu/cpu7/online
# Limit A57 max freq from msm_perf module in case CPU 4 is offline
echo "4:960000 5:960000 6:960000 7:960000" > /sys/module/msm_performance/parameters/cpu_max_freq
```

这是保护措施，即当hotplug温控机制失效的时候，仅保留一颗A57以防止温度过高；当控制大核心簇的CPU4离线的时候，就控制A57的最大频率防止过热。

```bash
# configure governor settings for little cluster
echo "interactive" > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
echo 1 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/use_sched_load
echo 1 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/use_migration_notif
echo 39000 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/above_hispeed_delay
echo 95 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/go_hispeed_load
echo 20000 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/timer_rate
echo 960000 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/hispeed_freq
echo 1 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/io_is_busy
echo 85 960000:90 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/target_loads
echo 40000 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/min_sample_time
echo 80000 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/max_freq_hysteresis
echo 384000 > /sys/devices/system/cpu/cpu0/cpufreq/scaling_min_freq
# online CPU4
echo 1 > /sys/devices/system/cpu/cpu4/online
# configure governor settings for big cluster
echo "interactive" > /sys/devices/system/cpu/cpu4/cpufreq/scaling_governor
echo 1 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/use_sched_load
echo 1 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/use_migration_notif
echo 39000 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/above_hispeed_delay
echo 90 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/go_hispeed_load
echo 20000 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/timer_rate
echo 768000 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/hispeed_freq
echo 1 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/io_is_busy
echo "85 1248000:95" > /sys/devices/system/cpu/cpu4/cpufreq/interactive/target_loads
echo 40000 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/min_sample_time
echo 0 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/max_freq_hysteresis
echo 384000 > /sys/devices/system/cpu/cpu4/cpufreq/scaling_min_freq
```


这个是对 CPU 调速器的参数控制。

这些参数的含义是：

```bash
echo 0 > /sys/devices/system/cpu/cpu0/online
//暴力关核或者开核（有的romer就是这么优化CPU的，所以用户老是抱怨卡的要命）
echo x > /sys/devices/system/cpu/cpu0/cpufreq/interactive/go_hispeed_load
//当CPU负载超过x时升频，CM和魔趣默认都用99。
echo x > /sys/devices/system/cpu/cpu0/cpufreq/interactive/hispeed_freq
//当go_hispeed_load达到或超过设定值时，CPU调到x频率。
echo x > /sys/devices/system/cpu/cpu0/cpufreq/interactive/target_loads
//定义了前台应用程序对CPU的负载达到多少时进入预订频率 语法是"m1 n1:m2 n2:。。。:m n:z" m指的是负载值，n指的是预设频率，z是上限。
即负载在m1-m2之间运行在n1频率，负载在m2-m3之间运行在n2频率。
当负载超过z时，该规则不再生效（即使用内核默认的缺省数值）。
echo x > /sys/devices/system/cpu/cpu4/cpufreq/interactive/above_hispeed_delay
//升频之间的间隔时间,单位是微秒 语法是"m1 n1:m2 n2:。。。:z"
m指的是时间间隔，n指的是频率（单位为Hz），z是上限
即频率在n1时间隔为m1，n2时间隔为m2
当频率没有被n定义时，间隔统一为z
echo x > /sys/devices/system/cpu/cpu0/cpufreq/interactive/min_sample_time
//采样时间，单位微秒。（内核探看CPU负载的间隔时间）
echo 1 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/io_is_busy
//对于big.LITTLE大小核架构，建议只对强劲的CPU开启！ 比如615高通默认大小核都不开，810高通默认大小核都开。
echo x > /sys/devices/system/cpu/cpu4/cpufreq/scaling_min_freq
//CPU的最低频率。建议用内核给定的最低值而不是自定义。
```

根据我的要求，把这些改成了。

```bash
# configure governor settings for little cluster
echo "interactive" > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
echo 1 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/use_sched_load
echo 1 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/use_migration_notif
echo 39000 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/above_hispeed_delay
echo 99 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/go_hispeed_load
echo 20000 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/timer_rate
echo 960000 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/hispeed_freq
echo 1 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/io_is_busy
echo "75 460800:85 960000:90" > /sys/devices/system/cpu/cpu0/cpufreq/interactive/target_loads
echo 40000 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/min_sample_time
echo 80000 > /sys/devices/system/cpu/cpu0/cpufreq/interactive/max_freq_hysteresis
echo 384000 > /sys/devices/system/cpu/cpu0/cpufreq/scaling_min_freq
# online CPU4
echo 1 > /sys/devices/system/cpu/cpu4/online # configure governor settings for big cluster
echo "interactive" > /sys/devices/system/cpu/cpu4/cpufreq/scaling_governor
echo 1 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/use_sched_load
echo 1 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/use_migration_notif
echo "19000 1400000:39000 1700000:19000" > /sys/devices/system/cpu/cpu4/cpufreq/interactive/above_hispeed_delay
echo 99 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/go_hispeed_load
echo 20000 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/timer_rate
echo 960000 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/hispeed_freq
echo 1 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/io_is_busy
echo "70 960000:80 1248000:85 1500000:90" > /sys/devices/system/cpu/cpu4/cpufreq/interactive/target_loads
echo 40000 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/min_sample_time
echo 80000 > /sys/devices/system/cpu/cpu4/cpufreq/interactive/max_freq_hysteresis
echo 384000 > /sys/devices/system/cpu/cpu4/cpufreq/scaling_min_freq
```


接下来是core_ctl参数。

> core_ctl 是由 /system/lib/modules/core_ctl.ko 文件控制的CPU控制机制，根据CPU的负载和温度控制CPU上线和离线。

> 在 core_ctl 的帮助下可以解决待机低负载少核与操作时负载上升时启动多核的矛盾。

```bash
# configure core_ctl module parameters
echo 4 > /sys/devices/system/cpu/cpu4/core_ctl/max_cpus
echo 2 > /sys/devices/system/cpu/cpu4/core_ctl/min_cpus
echo 60 > /sys/devices/system/cpu/cpu4/core_ctl/busy_up_thres
echo 30 > /sys/devices/system/cpu/cpu4/core_ctl/busy_down_thres
echo 100 > /sys/devices/system/cpu/cpu4/core_ctl/offline_delay_ms
echo 1 > /sys/devices/system/cpu/cpu4/core_ctl/is_big_cluster
echo 4 > /sys/devices/system/cpu/cpu4/core_ctl/task_thres
# ztemt:rm core_ctl module rmmod /system/lib/modules/core_ctl.ko
echo 4 > /sys/devices/system/cpu/cpu4/core_ctl/task_thres
```

> 这些意思是当平均负载大于 60 时，会有一颗 A57 上线；平均负载小于 30 时，要有 A57 离线；最多只有 4 颗 A57 上线，最少会有 2 颗 A57 在线；在 A57 离线之前至少需要100毫秒；A57 能承受大负载长线程。

然而与此同时，我很痛扁一下努比亚的工程师。因为他们直接把core_ctl关闭了。。。core_ctl有什么用我也说了，所以为什么要关掉呢？

于是我修改成这样——给 A53 也定义了core_ctl，并且修改了参数，去掉了 rmmod 指令。

```bash
# core_ctl module
echo 4 > /sys/devices/system/cpu/cpu0/core_ctl/max_cpus
echo 1 > /sys/devices/system/cpu/cpu0/core_ctl/min_cpus
echo 70 > /sys/devices/system/cpu/cpu0/core_ctl/busy_up_thres
echo 20 > /sys/devices/system/cpu/cpu0/core_ctl/busy_down_thres
echo 100 > /sys/devices/system/cpu/cpu0/core_ctl/offline_delay_ms
echo 0 > /sys/devices/system/cpu/cpu0/core_ctl/is_big_cluster
echo 4 > /sys/devices/system/cpu/cpu0/core_ctl/task_thres
echo 4 > /sys/devices/system/cpu/cpu4/core_ctl/max_cpus
echo 0 > /sys/devices/system/cpu/cpu4/core_ctl/min_cpus
echo 72 > /sys/devices/system/cpu/cpu4/core_ctl/busy_up_thres
echo 28 > /sys/devices/system/cpu/cpu4/core_ctl/busy_down_thres
echo 100 > /sys/devices/system/cpu/cpu4/core_ctl/offline_delay_ms
echo 1 > /sys/devices/system/cpu/cpu4/core_ctl/is_big_cluster
echo 4 > /sys/devices/system/cpu/cpu4/core_ctl/task_thres
```

> 最后讲一点，有些 romer 宣称用 ondemand 调速器可以省电降温，宣称“发热=耗电，耗电≠发热”，这样的想法显然是错误的。ondemand 调速器的特点就是升频快降频也快，但是如果出现负载较高，而且没有调整好 ondemand 参数的阈值，就会引起频率只升不降，耗电也没法解决，而且频率较高，电压较大，功率较大，发热同样随之而来。Ondemand 如果经过参数调整，也是可以很省电的，就是把 ondemand 里面改个 powersaving 的参数，实现频率等阶梯降低 10% ，并且根据负载和所在频率梯度修改 sampling_time 就行。
