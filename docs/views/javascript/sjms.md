---
title: 设计模式
date: 2022-04-14
sidebar: 'auto'
categories:
 - 学习
tags:
 - javasctip
---


## 工厂模式

```js
// 1 简单工厂模式
//  抽分变与不变
function User1(name,age,career,work){
    this.name = name;
    this.age = age;
    this.career = career;
    this.work= work;
}

function Factory(name,age,career){
    let work;
    switch(career) {
        case 'coder':
            work =  ['写代码','写系分', '修Bug'] 
            break
        case 'product manager':
            work = ['订会议室', '写PRD', '催更']
            break
        case 'boss':
            work = ['喝茶', '看报', '见客户'];
            break;
    }
    return new User1(name, age, career, work)

}

const Boos1 = new Factory('chenyao','27','boss');
console.log(Boos1);

```

## 抽象工厂模式

```js
    //2 抽象工厂
    // 对修改封闭 对拓展开放
    
    class Faker{
        createUser(){
            throw new Error('抽象方法不允许直接调用，你需要将我重写！');
        }
        createWork(){
            throw new Error('抽象方法不允许直接调用，你需要将我重写！');
        }
    }
    
    class User2 extends Faker{
        createUser(name,age){
            this.name = name;
            this.age = age;
        }
        createWork(career,work){
            this.career =career;
            this.work = work;
        }
    }

    const Boss2 = new User2();
    
    Boss2.createUser('chenyao','27');
    Boss2.createWork('boss',['喝茶', '看报', '见客户']);

    console.log(Boss2)

```


## 单例模式

```js
    // 3单例模式
    function User3(name,age,isBoss){
        this.name = name;
        this.age = age;
        this.isBoss = isBoss;
    }   
    const OneUse = (function(){
        let instance = null;
        return function(name,age,isBoss){
            if(!instance){
                instance =  new User3(name,age,isBoss)
            }
            return instance;
        }
    })()
    

    const Boss3 = new OneUse('chenyao','27',true);
    const Boss4 = new OneUse('chenyao_faker','27_faker',false);

    console.log(Boss4);

```

## 装饰器模式

在不修改原有代码的基础上，用一个方法包装原有代码与新代码 实现原有代码的迭代

```js
    //   5:装饰器模式
       function User4(){}
       User4.prototype.old = function(){
           console.log('old');
       }

       function User5(params){
           this.self = params;
       }
       User5.prototype.new = function(){
            this.self.old();
            console.log('new');
       }
       const boss5 = new User4();
       const boss6 = new User5(boss5);
       boss6.new()

```