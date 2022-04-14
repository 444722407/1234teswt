---
title: 随机拼凑图片的项目
date: 2021-09-03
categories:
 - 经验
tags:
 - html
---


项目需求：随机拼凑头像生成图片

灵感是来自multiavatar.js

multiavatar 分析源码后得出原理：

是通过svg中的pash 构建出6个部位 背景 脸型 头部 眼 衣服 嘴巴 然后自定义3个对象的颜色值实现黑白黄人种 设置了16总方案

这样人种颜色就有了 16*3 =48 个组合  48个组合中 部位可以随机组合 就有了 48^6 =  12,230,590,464 个头像


问题与解决：

1、需要根据存入在文件夹的svg 来生成 且名称通过 0000000000001 来排列

这里我用nodejs来做：
```js
const express = require("express");
const app = express();
const fs = require("fs");
const { resolve } = require("path");

app.use("/", express.static("view"));
app.use("/demo", express.static("demo"));


app.get("/data", (req, res, next) => {
  // 获取theme文件夹
  const theme = resolve(__dirname, "theme");

  // 获取里面的人物
  const peopleFileDir = fs.readdirSync("theme");

  // 定义主题类
  const themeClass = {};
  var filename = "";
  peopleFileDir.map((item, index) => {
    // 文件夹名字 01 02
    const itemFileDir = resolve(theme, item);
    themeClass[item] = {};
    index = index < 10 ? "0" + index : index;
    filename = index;

    fs.readdirSync(itemFileDir).map((eleDir, eleIndex) => {
      // 01 02 里面的文件夹名 clos envs eyes heads mouths tops
      const eleName = resolve(theme, item, eleDir);
      eleIndex = eleIndex < 10 ? "0" + eleIndex : eleIndex;
      filename += eleIndex;
      themeClass[item][eleDir] = [];

      fs.readdirSync(eleName).map((name, nameIndex) => {
        // clos envs eyes heads mouths tops 里面的文件夹名称
        let path = resolve(eleName, name);
        nameIndex = nameIndex < 10 ? "0" + nameIndex : nameIndex;
        filename = index + eleIndex + nameIndex;
        const data = fs.readFileSync(path).toString();

        const newData =  data.replace(/<svg.*?>/ig,"").replace('</svg>','');


        themeClass[item][eleDir].push({ filename, data:newData });
      });
    });
  });

  res.send(themeClass);
}); 

app.listen(3000, () => {
  console.log("服务器启动成功");
});
 
```

2：svg内的标签不纯净会导致拼凑的图片带有颜色

解决：上传到阿里妈妈图标网 来生成

一个合格的svg是只有path标签的，如下：

```svg

<svg t="1630736214643" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1910" width="200" height="200">
    <path d="M447.529208 769.883167c0-2.215491 1.550844-3.987884 3.323237-3.766334 19.053224 2.658589 38.327997 5.317179 50.734747 4.87408 17.723929 0 36.998702-1.993942 56.938122-4.87408 1.772393-0.221549 3.323237 1.550844 3.323236 3.766334v1.329295c0 1.993942-1.107746 3.544786-2.658589 3.766335-18.610125 3.101688-37.663349 4.87408-56.938122 5.09563-15.951536-0.443098-43.423626-4.430982-51.842492-5.760277-1.550844-0.221549-2.658589-1.772393-2.65859-3.766335v-0.664648zM386.160104 907.243617c10.634357-38.549546 26.364344-74.662051 46.082215-104.128083 26.585894 8.640415 51.177845 19.496322 72.44656 33.453916 23.705755-15.286889 48.076158-26.807443 73.111208-33.453916 21.268715 28.358286 36.777153 63.806145 48.297706 104.128083 1.107746 3.987884 0.221549 7.754219-3.323237 11.077456-51.177845 24.591952-180.562527 24.148853-228.638684 0-5.538728-2.880138-8.640415-6.424924-7.975768-11.077456z" fill="#FFFFFF" p-id="1911">
    </path>
</svg>

```

3、前端拿到nodejs返回的json数据后的处理

核心代码：(随机版本)

```js
function multiavatar(sP, callback) {

  let keys =  Object.keys(sP);

  function randomKeys(){
      return  keys[Math.floor( Math.random()*keys.length)];
  }


  let clo = sP[randomKeys()]['clo'];
  let env = sP[randomKeys()]['env'];
  let eye = sP[randomKeys()]['eye'];
  let head = sP[randomKeys()]['head'];
  let mouth = sP[randomKeys()]['mouth'];
  let top =  sP[randomKeys()]['top'];
  let ear = sP[randomKeys()]['ear'];


  function randomEle(ele){
    let random = Math.floor( Math.random()*ele.length);

    return  {
      data:ele[random].data,
      filename:ele[random].filename
    };
  }


  let clo_data = randomEle(clo);
  let env_data = randomEle(env);
  let eye_data = randomEle(eye);
  let head_data = randomEle(head);
  let mouth_data = randomEle(mouth);
  let top_data =  randomEle(top);
  let ear_data = randomEle(ear);

  let svgStart =
  '<svg t="1630736844887" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7726" >';
  let svgEnd = "</svg>";



  let resultSvg = svgStart + env_data.data + head_data.data + eye_data.data + mouth_data.data + ear_data.data + top_data.data + clo_data.data  + svgEnd;
  let resultName = env_data.filename + head_data.filename + eye_data.filename + mouth_data.filename + ear_data.filename +  top_data.filename + clo_data.filename;



  callback(resultSvg,resultName);
}

```

核心代码：(顺序版本)

```js
 for (let i in sP) {

            sP[i].clo.forEach((clo_item, clo_index) => {

                sP[i].env.forEach((env_item, env_index) => {

                    sP[i].eye.forEach((eye_item, eye_index) => {

                        sP[i].head.forEach((head_item, head_index) => {

                            sP[i].mouth.forEach((mouth_item, mouth_index) => {

                                sP[i].ear.forEach((ear_item, ear_index) => {

                                    sP[i].top.forEach((top_item, top_index) => {

                                        let clo = clo_item.data;
                                        let env = env_item.data;
                                        let eye = eye_item.data;
                                        let head = head_item.data;
                                        let mouth = mouth_item.data;
                                        let top = top_item.data;
                                        let ear = ear_item.data;

                                        let name_clo = clo_item.filename;
                                        let name_env = env_item.filename;
                                        let name_eye = eye_item.filename;
                                        let name_head = head_item.filename;
                                        let name_mouth = mouth_item.filename;
                                        let name_top = top_item.filename;
                                        let name_ear = ear_item.filename;

                                        final.push({
                                            data: env + head + eye + mouth + ear_item + top + clo,
                                            filename: name_env + name_head + name_eye + name_mouth + name_ear + name_top + name_clo,
                                        })


                                    })

                                })

                            })
                        })
                    })
                })
            })
        }


```

4、关于如何下载头像？

saveSvgAsPng 库直接解决 天然的处理 svg转png

5、如何下载全部图片？

通过 saveSvgAsPng库中的 svgAsPngUri 返回base64

利用jszip对象

然后循环出base64 添加内容到 jszip 最后导出压缩包 通过 saveAs方法下载

jszip压缩base64 需要处理将base64字符串中的data:images/base64，处理掉

```js
    function getDataUri(){
                    return new Promise((reslove,reject)=>{
                        var arr = [];
                        $('[data-filename]').map(function(){
                            var filename = $(this).data('filename') + '.png';
                            var svg = $(this).find('svg')[0];
                            arr.push(svgAsPngUri(svg,filename, { width:'800px' }))
                        })
                        reslove(arr)
                    })
                },
        async function downAll(){
                let zip = new JSZip();
                var arr = await this.getDataUri();
                var data = await Promise.all(arr);
                
            
                let p =  data.map(
                    x => zip.file(Math.random().toString('36').slice(3) + '.jpeg', x.split(',')[1], {base64: true})
                )
            
                await Promise.all(p);
                zip.generateAsync({type: "blob"}).then((content)=> {
                    this.saveAs(content, "example.zip");
                });
                 
                    
     },
    function saveAs(blob, name){
        let a = document.createElement('a')
        let url = window.URL.createObjectURL(blob)
        a.href = url
        a.download = name
        a.click()
    },
              

```