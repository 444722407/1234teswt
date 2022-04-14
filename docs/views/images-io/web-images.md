---
title: 前端处理动画的总结
date: 2021-05-10
categories:
 - 学习
tags:
 - 动画
---

前端有多种实现动画的方式


# lottie-web 播放AE导出的json动画

```html
    <div id="bm"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.8/lottie.min.js" ></script>
    <script>
       var animation = bodymovin.loadAnimation({
        container: document.getElementById('bm'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'data.json'
})
    </script>
```


#   SVGA播放

```html
     <canvas id="demoCanvas"></canvas>
    <script src="https://cdn.jsdelivr.net/npm/svgaplayerweb@2.3.1/build/svga.min.js"></script>
    <script>
        var player = new SVGA.Player('#demoCanvas');
        var parser = new SVGA.Parser('#demoCanvas'); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
        parser.load('gold.svga', function(videoItem) {
            player.setVideoItem(videoItem);
            player.startAnimation();
        })
    </script>
```

# APNG序列帧

iSparta 将多张png 合并成apng

兼容问题用apng-canvas 解决

```js
  APNG.ifNeeded().then(function() {
        var image = document.getElementById("img");
        APNG.animateImage(image);
    });
```

# css  step函数 

通过一张雪碧图 

steps(10, start) 

第一个参数控制sMove动画的background-position 可以划分成多少帧，每次就会走一帧;

第二个参数控制  每帧的起点是 start：左端点 还是  end:右端点

```css
.ms10 {
    left: 230px;
    -webkit-animation: sMove 10s steps(10, start) infinite;
}
.num {
    margin: 0 4px;
    width: 28px;
    height: 70px;
    background: url(imgs/2.png) no-repeat center;
    background-size: cover;
    background-position: 0 0;
}


@-webkit-keyframes sMove {
    0% {
        background-position: -280px 0;
    }

    100% {
    background-position: 0px 0;
    }

}
```

# gif