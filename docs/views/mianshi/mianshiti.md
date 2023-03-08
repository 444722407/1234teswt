---
title: 面试题总结
date: 2023-03-08
sidebar: 'auto'
categories:
 - 经验
tags:
 - 面试题
---


## 1、回流与重绘

浏览器在渲染的时候会经历以下阶段

解析html->生产渲染树->回流->重绘

触发回流一定会触发重绘

以下操作会引起回流：

    添加或删除可见的DOM元素

    元素的位置发生变化

    元素的尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度等）

    内容发生变化，比如文本变化或图片被另一个不同尺寸的图片所替代

    页面一开始渲染的时候（这避免不了）

    浏览器的窗口尺寸变化（因为回流是根据视口的大小来计算元素的位置和大小的）

    offsetTop、offsetLeft、 offsetWidth、offsetHeight、scrollTop、scrollLeft、scrollWidth、scrollHeight、clientTop、clientLeft、clientWidth、clientHeight
    获取一些特定属性的值

    getComputedStyle 方法

以下操作会引起重绘：

    颜色的修改

    文本方向的修改

    阴影的修改

建议：
    如果想设定元素的样式，通过改变元素的 class 类名 (尽可能在 DOM 树的最里层)

    避免设置多项内联样式

    应用元素的动画，使用 position 属性的 fixed 值或 absolute 值

    避免使用 table 布局，table 中每个元素的大小以及内容的改动，都会导致整个 table 的重新计算

    对于那些复杂的动画，对其设置 position: fixed/absolute，尽可能地使元素脱离文档流，从而减少对其他元素的影响

    使用css3硬件加速，可以让transform、opacity、filters这些动画不会引起回流重绘

    避免使用 CSS 的 JavaScript 表达式（left:expression(document.body.offsetWidth  - 110 + "px");）

    在使用 JavaScript 动态插入多个节点时, 可以使用DocumentFragment. 创建后一次插入. 就能避免多次的渲染性能


    我们还可以通过通过设置元素属性display: none，将其从页面上去掉，然后再进行后续操作，这些后续操作也不会触发回流与重绘，这个过程称为离线操作


## 2、ajax fetch axios有什么区别

都是用来进行服务端请求的

ajax是一种技术封装

fetch 是底层api

axios 是一个库


## 3、防抖和节流

防抖：多次频繁的操作只执行最后一次

节流：多次频繁的操作有时间有序的执行

## 4、px em rem % vm vh

px 是一个逻辑像素

em 基于本身font-size

rem 基于根元素的font-size

% 基于父元素
 
vm 屏幕宽度的1%

vh 屏幕高度的1%

vmin vm,vh中的最小值

vmax vm,vh中的最大值

## 5、箭头函数的弊端

没有 argument

无法bind apply call 改变this指向

在对象中，原型方法中的this不会指向实例

不能为构造函数

回调函数中this指向不正确

vue中 metchods mounted 中this指向不正确

## 6、简要描述TCP 3次握手与4次挥手

TCP是连接协议  HTTP是传输协议

1、建立连接 3次握手 

客户端呼叫 服务端回答 客户端回复收到 握手结束 

2、断开连接 4次挥手

客户端发送关闭需求 服务端回复客户端一些东西需要整理请等待 整理完后回复客户端 客户端收到告诉客户端连接断开 完毕

## 7、for in 和 for of有什么区别

for in 遍历获得key

for of 遍历获得value

for in 不能遍历 map set

for of 不能遍历对象

## 8、for await of

遍历 promise 作用跟promise.all()一样

## 9、forEach 与 for那个更快？

for 更快

forEach 有回调函数，内部也有一些算法，在数据量大的情况下效率会低

## 10、offsetWidth clienWidth scrollWidth 有什么区别

offsetWidth: border + padding +content

clienWidth: padding + content

scrollWidth: padding + 实际内容尺寸

## 11、HTML Collection 与 NodeList 的区别

HTMLCollection是元素集合 children

NodeList是一个节点的集合 (包含文本与注释)  childNodes

## 12、js严格模式有什么特点

1、全局变量必须声明

2、禁止使用with

3、限制eval,有自己的作用域

4、禁止this指向window

5、函数参数不能重名

## 13、跨域为什么要发送options请求？

options 请求就是预检请求，可用于检测服务器允许的 http 方法

## 14、js 垃圾回收机制

1、回收未被引用的变量

2、 旧 引用计数算法 被引用+1 未被引用-1 为0则回收

    循环引用将不能回收

3、新 标记清除算法  定期遍历window各个属性 看能不能得到某个属性 得到保留 得不到则删除

4、闭包不是内存泄漏 只是变量不能被垃圾回收机制回收

5、内存泄漏如何检测 谷歌开发者工具 performance

6、内存泄漏的场景有哪些：vue中 未被清除的变量、定时器、未被解除绑定的事件

7、避免内存泄漏的es6语法：weakMap weakSet

## 15、浏览器与node.js的 事件循环

微任务 promise async

宏任务 setTimerout setInterval 网络请求

浏览器:

1、 先执行 微任务后宏任务 

2、微任务在渲染之前触发 宏任务在渲染之后触发 微与宏直接相差一个dom渲染,如果微任务阻塞将不会渲染

3、先执行同步任务 然后异步任务进入队列

4、enent loop ：宏任务队列与微任务队列开始执行，执行完后继续监听任务


node.js:

按优先级执行：

微：

process.nextTick promise async

宏：

setTimerout setInterval Io callback setImmediate


## 16、如何解决移动端点击事件300ms延迟

旧浏览器打开电脑网页点击的时候会判断是单击还是双击 所以有了延迟

1、fastClick.js库

2、现代浏览器中 meta width=device-width 就不会有延迟了

## 17、node js 如何开启多进程

1、child_process

process.fork()

2、cluster 

## 18、多标签页面如何进行通讯

1、websocket 服务端成本高 无法操作dom

2、监听 storage 事件 只能同域

3、sharedWorker 调试不方便

## 19、js-bridge 实现原理

1、APP可以在window全局注册api

2、URL scheme  利用网页的请求，拦截协议后做处理

## 20、requestIdleCallback 与 requestAnimationFrame

都是渲染帧

requestIdleCallback 会等待执行 

## 21、vue watch 与 compouted 有什么区别

1、watch 是监听数据

2、compouted 用于计算产出新数据，有缓存


## 22、vue组件传参的有几种方式

1、父组件传递子组件 props
  
  子组件传递父组件 $emit

2、自定义事件（消息与广播） 通过第三方库传递

3、$attrs 如果不包含在props emits中，将会传到attrs

4、$refs $parent 

5、provide inject

6 、vuex

## 23、如何确保vue中DOM一定会渲染成功

在 this.$nextTick中

## 24、vue2 vue3 react 中 diff算法

普通diff的算法 假设比较A与B A排序循环1次 B排序循环1次 AB比较循环一次 时间复杂度O(n^3)

优化后的：

1、key的作用 

react 递增比较

vue2  双端比较

vu3 最长递增子序列

## 25 token与cookie有什么区别

cookie:

http是无状态的，每次请求携带cookie已验证身份

服务端可以像客户端设置set-cookie 大小4kb

cookie 默认不跨域共享与传递

token:

cookie是http规范 token是自定义传递

token 需要自己存储

token 没有跨域限制

## 26 sso

用户访问页面A  发现没有ticket就302重定向到sso sso返回登录页面 用户输入账号与密码 登录成功后 sso种下登录信息 并且返回ticket

页面A存储ticket然后拿着ticket与sso校验 sso校验通过 返回业务

访问页面B 发现没有ticket就302重定向到sso sso发现之前种下了登录信息 无需返回登录 直接返回ticket 后面同A


## 27 http协议与tcp协议、udp协议有什么区别

http在应用层 tcp、udp在传输层

tcp协议 三次握手 4次挥手 稳定性高

udp协议 无连接 无断开 不稳定高 效率高  适用于 视频会议 语音通话

## 28 http协议1.0 2.0的区别

http 1.0 最基本的协议 支持get post

http 1.1 支持缓存 长连接 put delete方法 

http 2.0 压缩header 多路请求

## 29 https

https 是需要ssl/tls认证实现的

证书与各大浏览器厂商有合作，如果免费证书很有可能在浏览器报错（这不是一个私密连接）

首先是 服务端存储证书 证书中包含私钥与公钥 先把公钥传递给客户端 然后客户端用公钥加密一个随机字符串给服务端 服务端用私钥解密出来 非对称加密

然后 经过加密的随机字符串 就变成了公钥 进行通讯了  对称加密

由于客户端需要通过网络获取到服务器的公钥，但是客户端无法识别这个公钥是否是伪造的，所以才会出现黑客伪造的情况。

为了避免出现中间人攻击的隐患，就需要想办法让客户端能够识别其获取到的公钥是服务器发布的正版公钥，还是黑客伪造的虚假公钥，此时就需要引入第三方的公证机构。

## 30 script defer async 有什么区别

script 会经历过下载与执行阶段，正常会在dom渲染的时候阻塞

defer 会在下载阶段与dom渲染并行加载 然后再dom渲染完成后执行js

async 会在下载阶段与dom渲染并行加载,下载完js后马上执行，后再渲染dom

## 31 preload prefecth 

Prefetch预拉取 提前拉取下一个页面的资源

Preload 预加载 主要是为了让某个资源有更高的加载优先级

dns-prefetch 是尝试在请求资源之前解析域名

preconnect (预连接) 是会建立与服务器的连接。将两者结合起来可提供进一步减少跨域请求的感知延迟的机会

## 32前端攻击手段

xss csrf 点击劫持 DDOS攻击 SQL注入 

## 33 一个url的过程

DNS解析 建立tcp连接 http连接 得到html源码

解析html加载里面的静态资源

## 34 首屏优化

1、路由懒加载

2、ssr

3、app预取

4、分页

5、图片懒加载

6、hybrid 先下载到app内部 用file协议打开


## 35 vue优化

v-show v-if

compouted计算

路由/组件 懒加载

for key

keep-live

ssr

## 36后端返回10w数据怎么处理

1、nodejs中间解决

2、虚拟列表

3、 setTimeout 进行分页渲染 requestAnimationFrame createDocumentFragment

## 37 如何监听vue组件报错

1、window.onerror是监听js报错 无法捕获 try catch

2、errorCaptured vue监听 return false 不会向上传播 不能监听异步

3、errorHandler 与window.onerror 互斥 不能监听异步

## 38 前端性能指标

fp fcp fmp dcl lcp load

## 39 react优化

1、循环使用key

2、使用fragment

3、jsx中不定义函数 不写 bind this

4、shouldComponentUpdate 判断是否要更新 或者 React.pureComponetn 函数组件用 react.mome

5、异步组件 路由懒加载 ssr

# 编写代码相关

1、concat 连接数组扁平化   会比push快
 
2、Object.proptype.toString([])  typeof只能为原始类型与 function object 

3、promise.then 会交替执行 如果返回新的promise 会慢两拍

4、setState 是异步更新 合并更新的

   但是在settimout ajax回调 dom监听事件 是同步更新的 也是合并更新的

   setState 的回调函数写法 也是合并更新的


## 设计一个前端统计sdk

1、pv访问量  

2、用户点击行为

3、错误  window.onerror

4、性能 performance.timing


第一步，需要产品ID

第二步,pv url不能重复

第三步，发送数据使用img 可以跨域 兼容性好


## soure-map

## spa 与 mpa 如何选择

## 低代码平台

1、点击保存的时候 发送给后端的数据格式怎么设计？ 因为是有序的 设计成数组  vnode

```js
    const store = {
        page: {
            title: '标题',
            setting: { /* 其他扩展信息：多语言，微信分享的配置，其他 */ },
            props: { /* 当前页面的属性设置，背景 */ },
            components: [
                // components 有序，数组

                {
                    id: 'x1',
                    name: '文本1',
                    tag: 'text', // type
                    style: { color: 'red', fontSize: '16px' },
                    attrs: { /* 其他属性 */ },
                    text: '文本1',
                },
                {
                    // 文本2
                },
                {
                    id: 'x3',
                    name: '图片1',
                    tag: 'image',
                    style: { width: '100px' },
                    attrs: { src: 'xxx.png' }
                }
            ]
        },

        // 问题2 Vuex 画布与组件同步
        // 用于记录当前选中的组件，记录 id 即可
        activeComponentId: 'x3'
    }
```

