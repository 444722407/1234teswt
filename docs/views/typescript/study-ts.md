---
title: typescrip入门
date: 2021-07-20
sidebar: 'auto'
categories:
 - 学习
tags:
 - typesctip
---

# 安装

    npm install -g typescript


## vscode 自动编译 

    1). 生成配置文件tsconfig.json

    tsc --init

    2). 修改tsconfig.json配置

    "outDir": "./js",

    "strict": false,

    3). 启动监视任务:

    终端 -> 运行任务 -> 监视tsconfig.json

## 使用 webpack 打包 TS

    yarn add -D typescript

    yarn add -D webpack webpack-cli

    yarn add -D webpack-dev-server

    yarn add -D html-webpack-plugin clean-webpack-plugin

    yarn add -D ts-loader

    yarn add -D cross-env

### webpack.config.js
```js
    const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === 'production' // 是否生产环境

module.exports = {
    mode: isProd ? 'production' : 'development',
    entry:{
        main:'./src/main.ts'
    },
    output:{
        path: path.resolve(__dirname,'dist'),
        filename: '[name].[contenthash:8].js'
    },
    module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            include: path.resolve(__dirname,'src')
          },
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"],
          },
        ]
      },
    plugins: [
        new MiniCssExtractPlugin({
          filename:'css/style.[hash:4].css'
        }),
        new CleanWebpackPlugin({}),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],  
    // 哪些文件可以作为模块被引入
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: isProd ? 'cheap-module-source-map' : 'eval-cheap-source-map',
    devServer: {
        contentBase: "./dist",
        host: 'localhost', // 主机名
        stats: 'errors-only', // 打包日志输出输出错误信息
        port: 8081,
        open: true
      }
}
```

## tsconfig.json 配置介绍
```json

{
  "compilerOptions": {

      "target": "es5",  // 转换成什么js版本

      "module": "commonjs",  //模块化标准

      "lib": [],         //需要用到哪些库对ts进行语法检查

      "outDir": "./",      //输出路径

      "outFile": "./",  //引入的模块可以合并成一个文件

      "allowJs": true,  //是否对js文件编译

      "checkJs": true,  // 是否对js文件进行检查
       
      "noEmit": true,   // 不对代码进行编译

      "removeComments": true,  // 是否移除注释

      "strict": true,   //严格模式
     
      "noImplicitAny": true,     // 不能隐式声明any类型

      "strictNullChecks": true,    //  严格检查空值

      "noImplicitThis": true,    //  不允许不明确类型this

  }
} 


```


# 基础

## 类型

```ts
// 布尔值
let isDone: boolean = false;

// 数字

let a1: number = 10 // 十进制
let a2: number = 0b1010 // 二进制
let a3: number = 0o12 // 八进制
let a4: number = 0xa // 十六进制

//字符串

let name: string = 'tom'

// undefined 和 null
let u: undefined = undefined
let n: null = null

//数组

let list1: number[] = [1, 2, 3]
let list2: Array<number> = [1, 2, 3]

// 元组 Tuple

let t1: [string, number]
t1 = ['hello', 10] // OK
t1 = [10, 'hello'] // Error

// 枚举

enum Color {
  Red,
  Green,
  Blue
}

// 枚举数值默认从0开始依次递增
// 根据特定的名称得到对应的枚举数值
let myColor: Color = Color.Green // 0
console.log(myColor, Color.Red, Color.Blue)



//any 


let notSure: any = 4
notSure = 'maybe a string'
notSure = false // 也可以是个 boolean

let list: any[] = [1, true, 'free']
list[1] = 100

// void
/* 表示没有任何类型, 一般用来说明函数的返回值不能是undefined和null之外的值 */
function fn(): void {
  console.log('fn()')
  // return undefined
  // return null
  // return 1 // error
}

// 联合类型
function toString2(x: number | string): string {
  return x.toString()
}

// 类型断言

/*
类型断言(Type Assertion): 可以用来手动指定一个值的类型
语法:
    方式一: <类型>值
    方式二: 值 as 类型  tsx中只能用这种方式
*/

/* 需求: 定义一个函数得到一个字符串或者数值数据的长度 */
function getLength(x: number | string) {
  if ((<string>x).length) {
    return (x as string).length
  } else {
    return x.toString().length
  }
}
console.log(getLength('abcd'), getLength(1234))


```



## 接口

```ts
// TypeScript 的核心原则之一是对值所具有的结构进行类型检查。我们使用接口（Interfaces）来定义对象的类型
// 定义人的接口

interface IPerson {
  readonly id: number  //只读
  name: string
  age: number
  sex?: string  //?表示可选属性
}

const person1: IPerson = {
  id: 1,
  name: 'tom',
  age: 20,
  sex: '男'
}

```


## 类

```ts
/*
类的基本定义与使用
*/

class Greeter {
  // 声明属性
  message: string //   readonly 只读 默认是public 公开的 private 私有 不能访问   protected 只在当前类私有，类内部和子类可以访问
  static name2: string = 'B'  // 静态属性
  // 构造方法
  constructor(message: string) {
    this.message = message
  }

  // 一般方法
  greet(): string {
    return 'Hello ' + this.message
  }
}

// 创建类的实例
const greeter = new Greeter('world')
// 调用实例的方法
console.log(greeter.greet())


```

## 泛型

```ts
function createArray2<T>(value: T, count: number) {
  const arr: Array<T> = []
  for (let index = 0; index < count; index++) {
    arr.push(value)
  }
  return arr
}
const arr3 = createArray2<number>(11, 3)
console.log(arr3[0].toFixed())
// console.log(arr3[0].split('')) // error
const arr4 = createArray2<string>('aa', 3)
console.log(arr4[0].split(''))
// console.log(arr4[0].toFixed()) // error


```

### 泛型接口

```ts
interface IbaseCRUD<T> {
  data: T[]
  add: (t: T) => void
  getById: (id: number) => T
}

class User {
  id?: number //id主键自增
  name: string //姓名
  age: number //年龄

  constructor(name, age) {
    this.name = name
    this.age = age
  }
}

class UserCRUD implements IbaseCRUD<User> {
  data: User[] = []

  add(user: User): void {
    user = { ...user, id: Date.now() }
    this.data.push(user)
    console.log('保存user', user.id)
  }

  getById(id: number): User {
    return this.data.find(item => item.id === id)
  }
}

const userCRUD = new UserCRUD()
userCRUD.add(new User('tom', 12))
userCRUD.add(new User('tom2', 13))
console.log(userCRUD.data)
```