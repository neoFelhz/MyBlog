---
title: Interative 调速器有关参数分析
tags:
  - Android
  - CPU
  - 温控
  - Interactiv
  - 调速器
categories:
  - 实验室
date: 2016-12-23 17:10:00
updated: 2016-12-23 17:10:00
thumbnail: https://blog.nfz.yecdn.com/img/thumbnails/cpu-governer-interative-core-ctl.png!blogth
---

`Interative`是目前常用的一种 CPU 调速器，其特点是 CPU 频率是根据负载实现交互式反应。但是与`ondemand`和`conserative`不同的是，`interative`拥有一些不同的参数配置方式。

<!--more-->

> 所以并不像一些人说的，什么`ondemand`非常敏感升频降频都快、`interative`升频快降频慢、`conserative`升频慢降频快。

Interative 可用的调速器参数有以下内容：

# 负载-频率机制

## target_loads

这个参数的目的是根据 CPU 负载来调整频率：当 CPU 负载升高到该参数时，内核就会升高 CPU 的运行频率以便降低 CPU 负载。该参数的默认值为 90。

该参数的格式是单个固定数值，或者是频率和负载值成对出现用冒号隔开。

> 比如 `85 1000000:90 1700000:99` 表示负载在 85% 以下时，CPU 频率要运行在 1GHz 以下；负载达到 90% 时，CPU 频率要运行在 1.0GHz~1.7GHz，直到 CPU 负载达到 99% 时，频率才会升到 1.7GHz 以上。

一般地，该参数设置的越低，CPU 升频就会越快、越频繁。

## min_sample_time

CPU 开始降低频率前的最小时间。也就是当负载下降到达较低的区间时还需要再经过多少时间 CPU 才开始降频（也可以简单理解成 CPU 两次降频之间的间隔值）。该值越小，对降频的反应就越敏感。该参数的默认值是 80000uS.



## timer_rate 和 timer_slack

CPU 负载采样率。 和 `min_sample_time` 不同，`timer_rate`单纯仅仅只规定采样间隔。该设定值越小，负载采样越敏感，频率调整更为敏感，但受限于 `min_sample_time` `above_hispeed_delay` 等延迟参数。但是实际上的采样间隔可能会比设定值更长，最长时间为 `timer_rate` 和 `timer_slack` 之和。当 `timer_clack` 值为 -1 时则无上限。

调节这个参数一般不能使手机省电。比如将该值设置的较长，固然可以降低内核探看 CPU 负载的频率，节省电量，但是内核就不能及时感知到负载的下降而及时降频。这个参数的设置取决于你手机对于长线程进程的需求。

---

# 应急反应机制

## hispeed_freq

这个参数的目的是指定面对突发的大负载做出应急的反应操作。也就是说当负载突然升高到 `go_hispeed_load` 且该核心正在运行在较低的频率时，CPU 运行频率会瞬间升高到这个参数指定的频率。这种情况一般都发生在暂时处于闲置的核心上。`hispeed_freq` 是一个理想的高性能工作频率, 假定该频率足以应对大多数高负载工作。当 CPU 运行在这个频率超过一段时间（即 `above_hispeed_delay`），CPU 才会继续升高频率。

这个参数如果设置得较低，那么应对突发的大负荷，CPU 的运行频率可能会较低而引起卡顿；如果该值设置的太高则比较容易引起发热。

## go_hispeed_load

这个参数就是规定当 CPU 负载突然到达该值时且当前 CPU 处于闲置状态（离线亦或者是运行在较低频率），CPU 就会瞬间将频率升到 `hispeed_freq` 以便应对突发状况。该参数的默认值是 99。

一般地，这个值越低，对于突发的大负荷工作，CPU 的反应就会越敏感。如果该值设置的太高则比较容易面对一些突发负载无法立刻升频做出反应引起卡顿，设置的太低则会出现过于频繁的升频导致发热和耗电。

## above_hispeed_delay

这个参数是设置成当 CPU 频率运行在 `hispeed_freq` 甚至更高以后，突发的负载并没有立刻降低。当 CPU 运行在该频率的时间超过该参数的指定值后，CPU 就会进一步进行升频，以便应对大长线程的大负荷。该参数的默认值是 20000us。设置该参数时可以根据 CPU 所在的不同频率设置不同的延迟。

该参数的格式是单个固定数值，或者是频率和频率区间成对出现用冒号隔开。当参数中涉及到频率时，频率必须采用升序数列。

> 比如 `19000 1400000:39000 1700000:19000` 表示当 CPU 频率在 1.4GHz 以下时 CPU 要在 `go_hispeed_load` 甚至更高的负载下运行超过 19000 us 才会进一步升频；运行频率在 1.4Ghz~1.7GHz 时延时设置为 39000us；超过 1.7GHz 时则采用 19000us 。

当该参数设置得较小时 CPU 则会较快地升频（可能会引起卡顿），设置得较大时 CPU 可能会因为不能及时升频而引起卡顿。

---

# 鸡血模式

## boost 和 boostpulse_duration

`boost` 这个参数由内核写入。如果非零，立即提高所有 CPU 的频率到该 CPU 的 `hispeed_freq` 甚至更高，直到零被写入此属性，期间无论负载是否降低都不会引起频率的改变。如果为零，则会允许 CPU 频率根据负载而降低到低于 `hispeed_freq` 设定的频率。默认值为零。
`boostpulse_duration` 指在每次 `boost` 被写入后，CPU 的频率被提升到 `hispeed_freq` 后在该频率下运行的最低间隔。在该间隔之内，就算 `boost` 值重新设为零，CPU 仍不会降频。

---

# 其它参数

## io_is_busy

这个参数决定是否根据设备的存储有关的 I/O （包括数据在存储上的读写、数据库的修改、熵的增加等）而提升 CPU 频率，以便加快 I/O 性能。

## align_windows

是否对齐所有CPU的计时器窗口。对齐的优点是同时评估整个簇的 CPU 以便获得对整个簇的 CPU 的负载信息。缺点是整个簇的 CPU 会同时上线和同时离线导致性能突然增加或突然下降。现在一般都不会开启。

## scaling_min_freq 和 scaling_max_freq

在 CPU 的设计的容许频率范围内（一般都是由内核规定）再设定一个 CPU 的运行频率区间，内核将会在这个区间内选择 CPU 的运行频率。

## ignore_hispeed_on_notif

如果该参数非零，则频率的改变由调度程序触发，则不应用上述与频率设定相关的逻辑（比如不再根据负载控制频率）。

## fast_ramp_down

如果非零，则不应用 `min_sample_time`。

## max_freq_hysteresis

这是 `interave` 调速器的一个扩展，保持 `interative` 调速器在 `policy-> max` 的时间。

## use_sched_load

如果该值非零，则 `align_windows` 则不会生效。

## use_migration_notif

是否在所有CPU之间对齐定时器窗口。

---

本文参考了linux CPU 调速器机制文档和CAF 的相关文档。
