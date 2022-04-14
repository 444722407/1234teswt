---
title: jszip 压缩多个图片
date: 2021-11-03
categories:
 - 经验
tags:
 - html
---

在 [随机拼凑图片的项目中新增下载全部图片](../random-images/img.md) 

项目需求需要一键下载所有图片

谷歌浏览器会弹出下载窗，允许之后可以全部下载

360浏览器是没下载一张图片就弹出一次下载管理器

综上 不符合需求

灵感来自 https://tinypng.com/ 压缩多张图片后生成的解压包  但是它是后台返回的

查阅资料后发现 前端有一个 jszip库 可以实现压缩  https://stuk.github.io/jszip/

根据api文档显示： 压缩图片支持 String/ArrayBuffer/Uint8Array/Buffer/Blob/Promise/Nodejs等写入

图片的话可以写入 base64 

根据项目需求出现了以下问题，如何在循环的异步的操作中拿到结果？

参考文档：https://my.oschina.net/ahaoboy/blog/4297646

研究出来了如下代码：   

```js
    var arr = [];
    function p1(){
        return new Promise((resolve,reject)=>{
            setTimeout(() => {
                resolve('chenyao')
            }, 2000);
        })
    }
    function pushPromise(){
        for(let i =0;i<5;i++){
            arr.push(p1())
        }
    }
    pushPromise()
    async function abc(){
        const data = await Promise.all(arr)
        console.log(data)
    }
    abc()
```

通过 异步函数都存入数组，通过 Promise.all 来调用

备份代码：

```html
<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Title</title>

    </head>
    <body>
    <img src="./t.jpg" alt="">
    <img src="./tt.jpg" alt="">
    </body>
    <script src="https://cdn.bootcdn.net/ajax/libs/jszip/3.3.0/jszip.js"></script>
    <script>

        function getBase64Image(img) {
            let canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            let dataURL = canvas.toDataURL("image/jpeg");
        
            return dataURL;
        }

        let imgList = [...document.getElementsByTagName('img')]
        console.log(imgList)
        let buffer = imgList.map(getBase64Image)
        console.log('buffer', buffer)

        function saveAs(blob, name) {
            let a = document.createElement('a')
            let url = window.URL.createObjectURL(blob)
            a.href = url
            a.download = name
            a.click()
        }

        async function main() {
            let zip = new JSZip();
            console.log(buffer)
            let p = buffer.map(
            x => zip.file(Math.random().toString('36').slice(3) + '.jpeg', x.split(',')[1], {base64: true})
            )
            console.log(p)
            await Promise.all(p)
            zip.generateAsync({type: "blob"}).then(function (content) {
              // see FileSaver.js
              saveAs(content, "example.zip");
            });
        }

        main()
    </script>
</html>
```









