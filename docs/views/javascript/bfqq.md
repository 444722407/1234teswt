---
title: 前端请求token过期时,刷新token的处理
date: 2021-03-15
categories:
 - 学习
tags:
 - javasctip
---

在遇上token过期，需要刷新token，并且再次请求原来的接口，无需登录。思路如下：

1、新建观察者数组 arr

2、新建纸条is_refresh 防止并发的其他请求去请求刷新token接口

3、当需要刷新token时候   arr.push 一个函数,函数内部调用 resolve(http())

resolve(http()) 的意思是：先调用http() resolve

当刷新完token的时候  http() 内部会走else resolve('不用刷新token,直接处理服务器返回') 所以避免了递归

4、处理完后 要撕掉纸条 清空观察者数组

5、参考：https://cloud.tencent.com/developer/article/1467376

```js
        // 新建数组存放请求
        var arr = [];
        var is_refresh = 1;
        var is_token = 401;

        function http(params){
            return  new Promise((resolve,reject)=>{
                console.log(params)
                if(is_token == 401){
                    if(is_refresh){
                        token()
                    }
                    is_refresh = 0;
                    arr.push(()=>{
                        resolve(http('刷新token后的' + params))
                    })
                   
                }else{
                    resolve('不用刷新token,直接处理服务器返回')
                }
            
            })
        }
       
     
        function token(){
           return new Promise((resolve,reject)=>{
               
                setTimeout(() => {
                    is_token = 1;   //模拟后台返回刷新token后的状态码
                    arr.map((item)=>{
                        item()
                    })
                    arr = [];
                    is_refresh = 1;
                }, 1000);
           })
        }

        http('请求参数').then(function(res){
            console.log(res);
        })
        http('请求参数2').then(function(res){
            console.log(res);
        })


```
