---
title: rollop入门
date: 2022-05-07
sidebar: 'auto'
categories:
 - 学习
tags:
 - rollop
---


# rollop介绍

rollp.js 是一款打包工具，可以打包成库;

cjs --- commjs(cmd)规范：require的方式引入，多用于node中模块的引入

es  --- es2015中module的引入，import 多用于前端项目

umd --- amd与cmd的通用版本，可以在浏览器中使用

# 配置rollup.config.js

```js
// rollup.config.js
// 这个插件将打包引入的json
import json from 'rollup-plugin-json';
// 这个插件将打包nodejs中引入的模块
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/main.js',
  output: {
    name:"bundle", //umd模式必须指定name，这样就会出现在全局变量中，window中
    file: 'bundle.js',
    format: 'umd'
  },
  plugins: [ json(),resolve() ]
};
}
```

```js
// src/main.js
import {version} from '../package.json'
import answer from 'the-answer';

export const getVersion =  function () {
  console.log('version ' + version);
}
export const getAnswer =  function () {
  console.log('the answer is ' + answer);
}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script src="./bundle.js"></script>
    <script>
        bundle.getAnswer()
        bundle.getVersion()
    </script>
</body>
</html>
```
# 打包vue组件的例子

```js
// rollup.config.js
// 为了保证版本一致，请复制我的 package.json 到你的项目，并把 name 改成你的库名
import esbuild from 'rollup-plugin-esbuild'
import vue from 'rollup-plugin-vue'
import scss from 'rollup-plugin-scss'
import dartSass from 'sass';
import { terser } from "rollup-plugin-terser"
import alias from '@rollup/plugin-alias'
import path from "path";
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/lib/index.ts',
  output: [{
    globals: {
      vue: 'Vue'
    },
    name: 'Yjw-ui',
    file: 'dist/lib/yjw-ui.js',
    format: 'umd',
    plugins: [terser()]
  }, {
    name: 'Yjw-ui',
    file: 'dist/lib/yjw-ui.esm.js',
    format: 'es',
    plugins: [terser()]
  }],
  plugins: [
    scss({ include: /\.scss$/, sass: dartSass }),
    esbuild({
      include: /\.[jt]s$/,
      minify: process.env.NODE_ENV === 'production',
      target: 'es2015' 
    }),
    vue({
      include: /\.vue$/,
    }),
    alias({
      entries: [
        {
          find: '@', // 别名名称，作为依赖项目需要使用项目名
          replacement: path.resolve(__dirname, 'src'), 
          customResolver: resolve({
            extensions: ['.js', '.jsx', '.vue', '.sass', '.scss']
          })
        }
      ]
    }),
  ],
}
```



```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./yjw-ui.css">
</head>
<body>
    <div id="app">
        <jw-button>按钮</jw-button>
    </div>
    <script src="https://unpkg.com/vue@next"></script>
    <script src="./yjw-ui.js"></script>
    <script>
        // 局部引入
        const {JwButton} = window['Yjw-ui'];
        const app = Vue.createApp({
            components:{
                JwButton
            }
        });
        // 全局引入
        // app.use( window['Yjw-ui'].default );
        app.mount("#app");
        
    </script>
</body>
</html>
```

全局引入为什么是 app.use( window['Yjw-ui'].default )？

这跟打包中的代码有关，首先vue方法:

安装 Vue.js 插件。如果插件是一个对象，则它必须暴露一个 install 方法。如果插件本身是一个函数，则它将被视为 install 方法。


```js
export function registerJwUi(app: App): void {
  for (const component of components) {
    app.component(component.name, component);
  }
}

export default registerJwUi;
```


源码在vue中可以直接 app.use但是打包后需要引入的是app.use( window['Yjw-ui'].default )

这个.default 暴露的就是  registerJwUi()  根据vue的特性则它将被视为 install 方法。
