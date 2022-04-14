---
title: 微信小程序跳转H5网页黑科技
date: 2021-07-29
tags:
  - 微信小程序
categories:
  - 经验
---


```js
 var url = 'https://www.baidu.com';
    wx.navigateToMiniProgram({
        appId: "wx308bd2aeb83d3345",
        path: "pages/jump/main?serviceId=1000836&path=" + encodeURIComponent(url),
        envVersion: "release"
    })
```
 
appid wx308bd2aeb83d3345 是微信城市服务小程序


path：pages/jump/main?serviceId=1000836  会直接跳转到绑定医保卡页面


path: "pages/jump/main?serviceId=1000836&path=" + encodeURIComponent(url) path参数传入url即可跳转


