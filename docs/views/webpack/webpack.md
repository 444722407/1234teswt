---
title: webpack学习
sidebar: "auto"
date: 2021-02-21
tags:
  - webpack
categories:
  - 学习
---

# 基础
## 核心配置项概念

entry： 入口配置 指定一个 js 所有的 improt 将会被打包

多入口即可打包多个 chunk.js

```js
entry: {
  index: "./src/js/index.js",
},
```

output 输出配置 将打包文件指定输出到哪里，可以配置文件名

```js
output:{
    filename: "js/[name].bundle.js",
    path:path.resolve(__dirname,'dist')
  },
```

plugins 插件配置 将需要打包的文件或者打包后的文件系列化的处理

```js
// 自动生成dist内的html 包含引用
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 将css打包成单独的文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//压缩css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
plugins: [
  new HtmlWebpackPlugin({
    template: "./src/index.html",
  }),
  new MiniCssExtractPlugin({
    filename: "css/style.css",
  }),
  new CssMinimizerPlugin(),
];
```

module 模块配置 指定 loader 的配置

loader 可以配置一系列文件打包规则

:::tip
loader 配置数组从右至左，从下往上执行
:::

mode 模式有两种 development 开发环境 production 生产环境

:::tip
webpack 遇到的 bug,搭建了 webpack-server 修改文件不更新，解决方法：

target:"web"

mode: "development"
:::

devServer 配置 webpack-server

```js
devServer: {
  contentBase: "./dist",
},
```

## 样式类的 loader

### less-loader

将.less 文件打包成.css

### css-loader

css-loader 会对 @import 和 url() 进行处理

### postcss-loader

处理 CSS 的 loader

:::tip
需要用到 postcss-preset-env 插件为 css 做兼容性处理
:::

```js
 {
    loader:"postcss-loader",
    options:{
      postcssOptions:{
        plugins:[
          "postcss-preset-env"
        ]
      }
    }
  }
```

:::tip
自带 Autoprefixer 为浏览器添加前缀 需要在 package.json 中添加配置

```js
"browserslist": {
  "production": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ],
  "development": [
    "ie >= 6",
    "firefox >= 8",
    "chrome >= 24",
    "Opera>=10",
    "safari >= 6"
  ]
}
```

:::

### MiniCssExtractPlugin.loader

将 css 打包成单独的文件

```js
  {
    loader:MiniCssExtractPlugin.loader,
    // 打包后的css中的url资源路径默认当前路径 例如url(img/abc.jpg)
    // 需要进行以下配置 指向正确的文件路径 例如url(../img/abc.jpg)
    options:{
      publicPath: "../",
    }
  },
```

### style-loader

会将样式通过 style 标签的形式插入到 html

混合了所有的 css 所以不能与 MiniCssExtractPlugin.loader 同时配置否则报错，二选一

通过插件的配置可以进行压缩

## 资源类的 loader

### file-loader

webpack5 自带资源类的 loader 不需要 file-loader 来打包

可以使用 type 来指定类型

```js
module: {
  rules: [
    //  打包图片
    {
      test: /\.(jpg|png|gif)$/,
      type: "asset",
      parser: {
        // 设置一个最大值 低于这个大小将会打包成base64
        dataUrlCondition: {
          maxSize: 4 * 1024,
        },
      },
      generator: {
        //设置文件名：10位哈希 + 后缀
        filename: "images/[hash:10][ext]",
      },
    },
    //打包字体
    {
      // 处理以下文件名
      exclude: /\.(css|jpg|png|js|html|less|gif)$/,
      type: "asset/resource",
      generator: {
        filename: "fonts/[hash:10][ext]",
      },
    },
  ];
}
```

### html-loader

html 中有 img 标签引入的时候 需要 html-loader 来引入正确的资源路径

```js
 {
      test:/\.html$/,
      loader:'html-loader',
      //需要关闭es6
      options: {
        esModule: false,
      }
},
```

:::tip
不关闭 es6 资源打包后的路径会是[object object]
:::

## js 的 loader

### eslint-loader

eslint-loader 对js代码风格的语法检查 很严谨 

可以通过配置插件使用airbnb的代码风格

```js
 {
      test: /\.js$/,
      // 屏蔽的文件
      exclude:/node_modules/,
      loader:"eslint-loader",
      // 是否开启自动格式化
      options:{
        fix:true
      }
},
```

:::tip
在 js 中 添加注释 //eslint-disable-next-line 可以跳过下一行代码的 eslint 检查
:::

### babel-loader

babel-loader 对js代码进行兼容性和es6的转换  

会影响性能 通常通过按需加载 与 多进程来优化

```js
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [[
          '@babel/preset-env',
          // 按需加载
          {
            useBuiltIns:'usage',
            corejs:{
              version:3
            },
            targets:{
              chrome:"60",
              ie:"9",
              firefox:"60",
              safari:"10"
            }
          }
        ]],

      },

    }
},
```

## 完整代码

```js
const path = require("path");

// 自动生成dist内的html 包含引用
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 从js中分离css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//压缩css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// 设置node运行环境，在兼容css的loader插件中可以表现出来
process.env.NODE_ENV="development";

const PubilcLoad = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: "../",
    },
  },
  {
    loader: "css-loader",
  },
  {
    loader:"postcss-loader",
    options:{
      postcssOptions:{
        plugins:[
          "postcss-preset-env"
        ]
      }
    }
  }
]
module.exports = {
  target:"web",
  mode: "development",
  entry:"./src/js/index.js",
  optimization:{
    splitChunks:{
      chunks:'all'
    }
  },


  output: {
    filename: "js/[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  devServer: {
    
    contentBase: "./dist",
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify:{
        collapseWhitespace: true,
        removeComments: true,
      }
    }),
    new CssMinimizerPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),

 
  ],
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   exclude:/node_modules/,
      //   loader:"eslint-loader",
      //   options:{
      //     fix:true
      //   }
      
      // },
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: [[
      //         '@babel/preset-env',
      //         // 按需加载
      //         {
      //           useBuiltIns:'usage',
      //           corejs:{
      //             version:3
      //           },
      //           targets:{
      //             chrome:"60",
      //             ie:"9",
      //             firefox:"60",
      //             safari:"10"
      //           }
      //         }
      //       ]],
       
      //     },
         
      //   }
      // },
      {
        test: /\.css$/,
        use: [...PubilcLoad],
      },
      {
        test: /\.less$/,
        use: [...PubilcLoad, {loader: "less-loader"}],
       
      },
      {
        test: /\.(jpg|png|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 
          }
        },
        generator: {
          filename: 'images/[hash:10][ext]'
        }
   
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        options: {
          esModule: false,
        },
      },
      {
        exclude: /\.(css|jpg|png|js|html|less|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash:10][ext]'
        }
    
       
      },
    ],
  },
};

```


# webpack 优化

## HMR

模块热替换 配置hot:true

可以在浏览器的控制台看到[HMR]... xxxx文件 表示改文件是热加载
```js
 devServer: {
    contentBase: "./dist",
    hot: true,
  }
```
:::tip
js文件的模块替换 需要用到es6中 import()语法
```js
if (module.hot) {
  module.hot.accept('./print.js', function() {
    console.log('Accepting the updated printMe module!');
    print()
  })
}
```
当 print.js文件更新的时候 会触发
:::


## soucre-map

SourceMap是一种映射关系。

当项目运行后，如果出现错误，错误信息只能定位到打包后文件中错误的位置。

如果想查看在源文件中错误的位置，则需要使用映射关系，找到对应的位置。

```js
devtool:"source-map"
```
* 如下配置介绍：
   source-map:会生成map格式的文件，里面包含映射关系的代码

   inline-soucre-map: 不会生成map格式的文件，包含映射关系的代码会base64所有模块放在打包后生成的代码中  会打印源码错误

   eval-soucre-map：不会生成map格式的文件，引入的模块会通过eval方式引入到打包后生成的代码中 会打印源码错误

   cheap-source-map ：会生成map格式的文件，错误只定位到一行 不会映射loader和第三方库 会打印源码错误

   cheap-module-source-map:会生成map格式的文件,错误只定位到一行 会映射loader和第三方库 会打印源码错误

   hidden-soucre-map :会生成map格式的文件 能看到错误调试 不能定位追踪到源代码

   nosources-soucre-map :会生成map格式的文件 能看到错误调试 看不到任何源代码的错误

速度最快 eval > inline > cheap

调试最好 source-map >  cheap-module-source-map 

所以 

开发环境推荐   eval-soucre-map/eval-cheap-module-source-map 

生产环境推荐   source-map/cheap-module-source-map 

## oneOf

webpack原本的loader是将每个文件都过一遍，比如有一个js文件 rules中有10个loader，第一个是处理js文件的loader，当第一个loader处理完成后webpack不会自动跳出，而是会继续拿着这个js文件去尝试匹配剩下9个loader，相当于没有break。而oneOf就相当于这个break

```js
rules:[
    oneOf:[
        {
            test:/\.css$/,
            use:[...common_css_loader],
            // 优先执行
             enforce:'pre' 
        },
        {
            test:/\.less$/,
            use:[...common_css_loader,'less-loader'],
            
        },
        {
            test:/\.html/,
            loader:'html-loader'
        }
      ]
  ]
```
在oneOf里面的loader一旦匹配成功则会跳出匹配，走oneof外面的匹配规则，相当于break语句


## 缓存

* bable 缓存

   ```js
   //第二次构建时会读取上一次的缓存
   cacheDirectory:true
   ```

* 资源文件缓存 

   hash:每次webpack构建会生成唯一的hash值  js和css同时使用一个hash 如果重新打包会导致缓存失效

   chunkhash:根据chunk生成的hash值 不同chunk.js不同的hash值 

   contenthash:根据文件内容生成的hash，不同文件hash不一样

    ```js
      options: {
        name: "[contenthash:10].[ext]",
        outputPath: "fonts",
      },
    ```

## tree shaking

移除 JavaScript 上下文中的未引用代码

必须使用es6语法（即 import 和 export）

使用 mode 为 "production"

在项目的 package.json 文件中，添加 "sideEffects" 

如果sideEffects：false 会去除代码入口引入的improt 'xxx.css' 通常设置跳过一些文件 sideEffects:[*.css] 

## code split

多入口文件会打包成多个chunk 不能分析出公用的引入打包成单独的chunk

在不确定自己能够将代码分割成多个入口文件的时候，适用单入口文件打包做如下配置：

```js
  optimization：{
    splitChunks:{
        chunks: 'all',
    }
}   
```
会自动分析多入口有没有公共的引入，单独打包成一个chunk

只可以将node_module 引入的js单独打包

import() 动态引入代码可以单独打包成一个chunk

```js
  //webpackChunkName 可以为这个单独打包的文件取别名
 import( /* webpackChunkName: '...' */'test.js').then()
```


## 懒加载预加载
import() 动态引入代码其实就是做了懒加载 在需要的时候加载 

```js
  //webpackChunkName 可以为这个单独打包的文件取别名
 import( /* webpackChunkName: '...', webpackPrefetch: true */'test.js').then()
```



## pwa

渐进式网络应用程序 运行在离线模式下会正常加载一些代码

npm install workbox-webpack-plugin --save-dev
    
```js
    plugins: [
     new WorkboxPlugin.GenerateSW({
       // 这些选项帮助快速启用 ServiceWorkers
       // 不允许遗留任何“旧的” ServiceWorkers
       clientsClaim: true,
       skipWaiting: true,
     }),
    ],
```
再次执行 npm run build 会生成service-worker.js

在js代码中即可使用：
```js
 if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
     navigator.serviceWorker.register('/service-worker.js').then(registration => {
       console.log('SW registered: ', registration);
     }).catch(registrationError => {
       console.log('SW registration failed: ', registrationError);
     });
   });
 }
```


## 多进程打包

使用 thread-loader 开启进程会消耗大概600ms  进程通讯也有内耗

通常使用bable这种很耗性能与时间的loader打包

```js
 rules: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: [
          "thread-loader",
          // 耗时的 loader （例如 babel-loader）
        ],
      },
    ],
```

## externals

externals：不打包成chunk，通过cdn在index.html中引入
```js
//打包的时候忽略以下库，将不会到chunk.js 
  externals: {
      jquery: 'jQuery',
  },
```

# 总结

* 开发环境打包构建速度：

   HMR:模块热加载

* 开发环境打包构建性能：

   soucre-map:[inline eval][-hidden -nosources][-cheap -cheap-module][-soucre-map]]

* 生产环境打包构建速度：

   bable缓存:cacheDirectory:true

   文件缓存：[contenthash]

   oneOf：以下loader只会生效一个，提取公共的loader

   多进程打包：thread-loader  开启进程会消耗大概600ms  进程通讯也有内耗

   dll:提前打包好一些模块，已过时

* 生产环境打包构建性能：

    pwa:是你的应用程序离线状态也可以用

    tree shaking:未被引入的模块将不会被打包 sideEffects：[*.css]不要删除css

    code split:代码分割：可以将引入的import模块单独打包,这样就可以并行加载

    单入口分割, 多入口分割：

    懒加载/预加载： 通过es6中的import(/* webpackChunkName: "lodash",webpackPrefetch: true */).then() 

    externals:允许外部加载的不被打包就可以用cdn的方式引入：

      
