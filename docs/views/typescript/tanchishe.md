---
title: typescrip 贪吃蛇
date: 2021-07-23
sidebar: 'auto'
categories:
 - 学习
tags:
 - typesctip
---


# 主要逻辑部分

## Food 类

在范围内 随机生成点的位置 

```ts

class Foot{
    element:HTMLElement

    constructor(){
        this.element = document.getElementById('food')!;
    }

    get X(){
        return this.element.offsetLeft;
    }
    get Y(){
        return this.element.offsetTop;
    }

    change(){
        let top = Math.round(Math.random() * 29) * 10;
        let left = Math.round(Math.random() * 29) * 10;

        this.element.style.left = left + 'px';
        this.element.style.top = top + 'px';
    }
    
}


export default Foot;

```

## ScorePanel 类

生成记分板，有分数与等级

分数每10分就加1级


```ts
class ScorePanel {
    score = 0;
    level = 1;
  
    scoreEle:HTMLElement;
    levelEle:HTMLElement;
  
    maxLevel:number;
    upScore:number;
  
  
    constructor(maxLevel: number = 10, upScore: number = 10){
      this.scoreEle = document.getElementById('score')!;
      this.levelEle = document.getElementById('level')!;
      this.maxLevel = maxLevel;
      this.upScore = upScore;
  
    }
  
  
    addScore(){
      this.scoreEle.innerHTML = ++this.score +"";
       // 判断分数是多少
       if (this.score % this.upScore === 0) {
         this.levelUp();
      }
    }
  
    levelUp(){
       if (this.level < this.maxLevel) {
          this.levelEle.innerHTML = ++this.level + '';
      }
    }
  }

  export default ScorePanel

```
## Snake 类

主要的逻辑：

1、 如何判断撞墙？

    如果设置的X,Y值大于或小于边界即撞墙了

2、 如何让蛇不能反向移动？

    蛇的第二个位置不能等于当前设置的位置就可以判断是反向移动

3、 如何移动身体？

    后一个身体的位置等于前一个身体的位置

4、如何判断蛇咬到自己？

    获取所有节的位置，如果与蛇头位置重叠那么就咬到自己了;




```ts

class Snake {
    head:HTMLElement
    bodies: HTMLCollection
    element: HTMLElement

    constructor(){
        this.element = document.getElementById('snake')!;
        this.head = document.querySelector('#snake > div')!;
        this.bodies = this.element.getElementsByTagName('div');
    }

   // 获取蛇的坐标（蛇头坐标）
   get X() {
        return this.head.offsetLeft;
    }

    // 获取蛇的Y轴坐标
    get Y() {
        return this.head.offsetTop;
    }


    set X(value:number){
        if (this.X === value) {
            return;
        }
        if (value < 0 || value > 290) {
            throw new Error('蛇撞墙了！');
        }
         // 修改x时，是在修改水平坐标，蛇在左右移动，蛇在向左移动时，不能向右掉头，反之亦然
         if (this.bodies[1] && (this.bodies[1] as HTMLElement).offsetLeft === value) {
            if (value > this.X) {
                // 如果新值value大于旧值X，则说明蛇在向右走，此时发生掉头，应该使蛇继续向左走
                value = this.X - 10;
            } else {
                // 向左走
                value = this.X + 10;
            }
        }

        this.moveBody();
        this.head.style.left = value + 'px';
        this.checkHeadBody()
       
    }

    set Y(value:number){
        if (this.Y === value) {
            return;
        }
        if (value < 0 || value > 290) {
            throw new Error('蛇撞墙了！');
        }
         // 修改y时，是在修改垂直坐标，蛇在上下移动，蛇在向上移动时，不能向下掉头，反之亦然
         if (this.bodies[1] && (this.bodies[1] as HTMLElement).offsetTop === value) {
            if (value > this.Y) {
                value = this.Y - 10;
            } else {
                value = this.Y + 10;
            }
        }

        this.moveBody();
        this.head.style.top = value + 'px';
        this.checkHeadBody()
    }
    
    addBody(){
        this.element.insertAdjacentHTML("beforeend", "<div></div>");
    }
    moveBody() {
        /*
        *   将后边的身体设置为前边身体的位置
        *       举例子：
        *           第4节 = 第3节的位置
        *           第3节 = 第2节的位置
        *           第2节 = 蛇头的位置
        */
        // 遍历获取所有的身体
        for (let i = this.bodies.length - 1; i > 0; i--) {
            // 获取前边身体的位置
            let X = (this.bodies[i - 1] as HTMLElement).offsetLeft;
            let Y = (this.bodies[i - 1] as HTMLElement).offsetTop;

            // 将值设置到当前身体上
            (this.bodies[i] as HTMLElement).style.left = X + 'px';
            (this.bodies[i] as HTMLElement).style.top = Y + 'px';
        }
    }

      // 检查蛇头是否撞到身体的方法
      checkHeadBody() {
        // 获取所有的身体，检查其是否和蛇头的坐标发生重叠
        for (let i = 1; i < this.bodies.length; i++) {
            let bd = this.bodies[i] as HTMLElement;
            if (this.X === bd.offsetLeft && this.Y === bd.offsetTop) {
                // 进入判断说明蛇头撞到了身体，游戏结束
                throw new Error('撞到自己了！');
            }
        }
    }
}


export default Snake



```

##  GameControl 类

用来操作各个类之间的逻辑

绑定与判断键盘事件

判断失败与成功

```ts

import Snake from './Snake';
import ScorePanel from './ScorePanel';
import Foot from './Foot';

class GameControl {
    Snake:Snake;
    ScorePanel:ScorePanel;
    Foot:Foot;

    direction:string = "";
   
    isLive = true;
    constructor(){
        this.Snake = new Snake();
        this.ScorePanel = new ScorePanel();
        this.Foot = new Foot();
        this.init();
    }

    init(){
        document.addEventListener('keydown', this.keydownHandler.bind(this));
        this.run()
    }

    keydownHandler(event: KeyboardEvent) {
     
        this.direction = event.key;
       
    }
    
      

    run(){
       
        let X = this.Snake.X;
        let Y = this.Snake.Y;

        // 根据按键方向来计算X值和Y值（未更新）
        switch (this.direction) {
            case "ArrowUp":
            case "Up":
                // 向上移动 top 减少
                Y -= 10;
                break;
            case "ArrowDown":
            case "Down":
                // 向下移动 top 增加
                Y += 10;
                break;
            case "ArrowLeft":
            case "Left":
                // 向左移动 left 减少
                X -= 10;
                break;
            case "ArrowRight":
            case "Right":
                // 向右移动 left 增加
                X += 10;
                break;
        }
        // 检查蛇是否吃到了食物
        this.checkEat(X, Y);

       try{

        this.Snake.X = X;
        this.Snake.Y = Y;

       }catch(e){
           
        alert(e.message);
        this.isLive = false;
       }
        this.isLive && setTimeout(this.run.bind(this),200 - (this.ScorePanel.level - 1) * 30);
    }

    checkEat(X: number, Y: number) {
        if (X === this.Foot.X && Y === this.Foot.Y) {
            // 食物的位置要进行重置
            this.Foot.change();
            // 分数增加
            this.ScorePanel.addScore();
            // 蛇要增加一节
            this.Snake.addBody();
        }
    }
        
}

export default GameControl;

```
