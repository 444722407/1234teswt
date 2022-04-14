---
title: nodejs爬取表情包图网站案例
date: 2021-03-20
categories:
 - 学习
tags:
 - nodejs
---

## 准备工作
需要用到2个包:

superagent:node服务端发送ajax请求 npm install superagent -D

cheerio:load方法将superagent返回的html文档转换成jquery dom树 npm install cheerio -D

表情包网站:https://www.doutula.com/photo/list

## 源代码

通过获取节点的alt属性来定义文件名

通过获取节点的data-original属性来发起图片的请求

fs.writeFile 写入文件

```js
const express =  require('express');
const superagent  = require('superagent');
const cheerio = require('cheerio');
const app = express();
const fs = require('fs');


let index = 0;
let count = 0;
let page = 0;
function spiderUrl(url){
   
    superagent.get(url).end((err,res)=>{
        if(err){
            console.log(err)
        }
        page ++;
        index = 0;
        const htmlStr = res.text;
        const $  =  cheerio.load(htmlStr);
        const item = $('.list-group-item .img-responsive');
        count = item.length;
        item.each((index,element)=>{
            let text = $(element).attr('alt');
            let src = $(element).attr('data-original');
            let arr  =  src.split('.');
            let length = arr.length;
            let hz = arr[length-1];

            downImages(src,text,hz)
        })
       
    })
 
}

function downImages(url,filename,hz){
    superagent.get(url).end((err,res)=>{
        if(err){
            console.log(err)
        }
        let data = res.body;
        index ++;
        fs.writeFile(`./spiderImages/${filename}.${hz}`,data,err=>{
            if(err){
                console.log('文件保存错误')
            }
            let r =Math.ceil((index/count).toFixed(2)*100) + '%';
            console.log(`第${page}页,进度:${r}`)
        })
       
    })
  
}

function main(){ 
    
    for(let i=1;i<3;i++){
        let url  =  `https://www.doutula.com/photo/list/?page=${i}`;
        spiderUrl(url)
    }
}

main()
```