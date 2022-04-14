---
title: 分页逻辑
date: 2021-04-22
categories:
 - 学习
tags:
 - javasctip
---

## 分页逻辑：

当最大页码 大于5做出判断：

在 区间内if(cur >3 && cur < all-2 ) 以当前值为中点，左边-2，右边+2

不在区间内 有 最小边界 即可展示[1,2,3,4,5] 代码表示：  left = 1;right = 5;

不在区间内 有 最大边界  即可展示[96,97,98,99,100] 代码表示：   left = all -4; right = all;

有了left与right控制区间，把页码数组渲染出来即可：

```js
  while (left <= right){
        arr.push(left)
        left ++
    }
```

## 全部代码
```js
        const all = 100;
        const cur  = 65;
        function indexs(){
            var arr = [];
            var left = 1;
            var right = all;

            if(all>=5){
                //区间
                if(cur >3 && cur<all-2){
                 
                    left = cur - 2;
                    right = cur + 2
                }else{
                    //最小边界
                    if(cur<=3){
                        left = 1
                        right = 5
                    }else{
                    //最大边界
                        right = all;
                        left = all -4;
                    }
                } 
            }
            while (left <= right){
                arr.push(left)
                left ++
            }
            return arr
        }
        var pages = indexs();
        console.log(pages)
```

参考：[vue分页](https://www.cnblogs.com/web-aqin/p/10769435.html)