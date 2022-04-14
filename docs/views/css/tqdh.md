---
title: css弹球动画
date: 2018-05-20
categories:
 - 学习
tags:
 - css
---

## 弹球动画

```css
@keyframes jump{
    0% {
        transform: translateY(0) scale(1.15,.8);
    }
    20% {
        transform: translateY(-35px) scaleY(1.1);
    }
    50% {
        transform: translateY(-50px) scale(1);
    }
    80% {
        transform: translateY(-35px) scale(1);
    }
    100% {
        transform: translateY(0) scale(1.15,.8);
    }
}

.jump{
    width: 40px;
    height: 40px;
    background-color: brown;
    border-radius: 50%;  
    animation:jump 1s ease-in infinite alternate;
    margin-top: 50px;
}
```

## 跳跃动画
css:
```css
#contain {
    width: 200px;
    height: 50px;
    position: absolute;
    top: calc(50% + 50px);
    left: calc(50% + 50px);
    opacity: 0;
    animation: fadeIn 1s 1;
    animation-fill-mode: forwards;
}

.wrap {
    animation: translateX 1000ms infinite ease-in-out alternate;
    position: absolute;
}

.ball {
    width: 50px;
    height: 50px;
    box-shadow: -6.25px -6.25px 0 rgba(0, 0, 0, 0.1) inset;
    background-color: #397BF9;
    border-radius: 50%;
    animation: translateY 500ms infinite ease-in-out alternate;
}

.wrap:after {
    content: '';
    width: 50px;
    height: 7.5px;
    background: #eee;
    position: absolute;
    bottom: 0;
    top: 70px;
    border-radius: 50%;
    animation: scale 500ms infinite ease-in-out alternate;
}


@keyframes translateX {
    100% {
        transform: translateX(-150px);
    }
}
@keyframes translateY {
    100% {
        transform: translateY(-50px);
    }
}
@keyframes scale {
    100% {
        transform: scale(0.85);
    }
}
@keyframes fadeIn {
    100% {
        opacity: 1;
    }
}
```

html:
```html
<div id="contain">
    <div class="wrap" id="wrap1">
      <div class="ball" id="ball1"></div>
    </div>
  </div>
```