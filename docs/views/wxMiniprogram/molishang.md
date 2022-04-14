---
title: 微信小程序-魔力赏项目的总结
date: 2021-09-17
tags:
  - 微信小程序
categories:
  - 经验
---

1、css 通过env变量来适配iphoneX中的底部黑线

padding-bottom: env(safe-area-inset-bottom);


2、图片占位符使用  fakeimg：https://fakeimg.pl/ 

之前我是用的https://placeholder.com/

3、播放svga

之前我使用的 SVGAPlayer-MP这个库 但是在onRead中获取canvas是异步的 可能获取不到 

然后查阅github上有没有优化的解决方法 后找到一个库  推荐使用  svgaplayer-weapp 

4、微信小程序有拓展库 播放 lottie 但是效果很不理想 模糊有锯齿 而且有些动画播放不出来 Lottie for MiniProgram

5、解决 IOS 显示 transparent 展示黑色透明

查阅资料后以下说明：

Android - 2.2+ (支持): Android平台4.0以上系统才支持“transparent”背景透明样式，4.0以下系统窗口显示白色背景。

iOS - 5.0+ (支持): iOS平台不支持“transparent”背景透明样式，默认背景使用白色背景。

解决：transparent 改为： rgba(255,255,255,0)






