---
title: React学习总结
date: 2021-08-25
sidebar: "auto"
tags:
  - react
categories:
  - 学习
---



## 基本语法

jsx语法,循环与判断等在本章节忽略

## 生命周期

![生命周期](./react_images/life.png)


* 初始化阶段: 由ReactDOM.render()触发---初次渲染

>constructor() 构造器

>static getDerivedStateFromProps 它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。

>render() 渲染函数，这时候出现了虚拟dom,更新和挂载都会被调用

>componentDidMount() 常用一般在这个钩子中做一些初始化的事，例如：开启定时器、发送网络请求、订阅消息

* 更新阶段: 由组件内部this.setSate()或父组件重新render触发

>getDerivedStateFromProps

>shouldComponentUpdate()  更新的阀门，retuen true 才可以触发下面的生命周期

>render()

>getSnapshotBeforeUpdate 获取一个更新的快照并且可以返回给componentDidUpdate，通常用在dom更新前调用取得dom信息后交给componentDidUpdate处理

>componentDidUpdate()  会在更新后会被立即调用。首次渲染不会执行此方法。当组件更新后，可以在此处对 DOM 进行操作。

* 卸载组件: 由ReactDOM.unmountComponentAtNode()触发

>componentWillUnmount() 

>一般在这个钩子中做一些收尾的事，例如：关闭定时器、取消订阅消息

## 路由的基本使用

* 导航区的a标签改为Link标签 
```react
<Link to="/xxxxx">Demo</Link>
```

* 展示区写Route标签进行路径的匹配
```react
 <Route path='/xxxx' component={Demo}/>
```

* 路由的模式有2种：BrowserRouter与HashRouter

>通常包裹在APP组件

>BrowserRouter使用的是H5的history API，不兼容IE9及以下版本。HashRouter使用的是URL的哈希值(类似锚点技术)

>BrowserRouter的路径中没有#,例如：localhost:3000/demo/test。HashRouter的路径包含#,例如：localhost:3000/#/demo/test

>HashRouter刷新后会导致路由state参数的丢失

* 路由组件可以接收到三个固定的属性

>history:包含函数式路由中的一些方法(push,go,goback...,location)

>location:包含路由中的params参数,state参数

>match:包含路由中的search参数()
	
* NavLink可以实现路由链接的高亮，通过activeClassName指定样式名

* Switch的使用 单一匹配只匹配一个路由

* 严格匹配  exact={true} 在嵌套路由中切忌使用
```react
<Route exact={true} path="/about" component={About}/>
```
* Redirect的使用 一般写在所有路由注册的最下方，当所有路由都无法匹配时，跳转到Redirect指定的路由

* 嵌套路由

>注册子路由时要写上父路由的path值 path = /home/child

## 路由的进阶使用

* 解决多级路径刷新页面样式丢失的问题

>public/index.html 中 引入样式时不写 ./ 写 / （常用）

>public/index.html 中 引入样式时不写 ./ 写 %PUBLIC_URL% （常用）

>使用HashRouter

### 向路由组件传递参数

* params参数

路由链接(携带参数)：Link to='/demo/test/tom/18'}>详情Link

注册路由(声明接收)：Route path="/demo/test/:name/:age" component={Test}

接收参数：this.props.match.params

* search参数

路由链接(携带参数)：Link to='/demo/test?name=tom&age=18'}>详情Link

注册路由(无需声明，正常注册即可)：Route path="/demo/test" component={Test}

接收参数：this.props.location.search

备注：获取到的search是urlencoded编码字符串，需要借助querystring库解析

* state参数

路由链接(携带参数)：

```react
<Link to={{pathname:'/demo/test',state:{name:'tom',age:18}}}>详情</Link>
```

注册路由(无需声明，正常注册即可)：Route path="/demo/test" component={Test}

接收参数：this.props.location.state

备注：刷新也可以保留住参数

### 编程式路由导航

    借助this.prosp.history对象上的API对操作路由跳转、前进、后退

    -this.prosp.history.push()

    -this.prosp.history.replace()

    -this.prosp.history.goBack()

    -this.prosp.history.goForward()

    -this.prosp.history.go()


## redux

![redux](./react_images/redux.png)

redux 是一种集中式状态管理的技术，并不是存在在react中


reducer.js  注册reducer  action的方法将会在这里调用, 并且返回newState,告诉store

```js
import {INCREMENT,DECREMENT} from './constant'
// preState设置默认值 为了在挂载的时候显示
export default function countReducer(preState = 0,action){
    const {type,data} = action;
    switch (type) {
        case INCREMENT:
            return preState + data;
        case DECREMENT:
            return preState - data;
        default:
            return preState;
    }
}

```

核心：store.js 通过createStore方法传入reducer创建store。在组件中引入就可以调用store.dispatch(action.js) 触发action->调用reducer注册的方法->返回state

```js
import { createStore,applyMiddleware } from "redux"
import countReducer from './count_reducer'
// 处理异步任务的中间件
import thunk from 'redux-thunk' 

export default createStore(countReducer,applyMiddleware(thunk))

```


action.js 注册方法，在store.dispatch中传入的参数可以调用

```js
import {INCREMENT,DECREMENT} from './constant'

export const createIncrement = data=>({type:INCREMENT,data})
export const createDecrement = data=>({type:DECREMENT,data})

export const createAsyncIncrement = (data,time) => {
    return (dispatch)=>{ 
        setTimeout(() => {
            dispatch(createIncrement(data))
        }, time)
    }
}
```

constant.js 为了防止字符串被修改

```js
export const INCREMENT = 'increment'
export const DECREMENT = 'decrement'
```

count组件：
```js
import React, { Component } from 'react'
import store from '../../redux/store'
import {createDecrement,createIncrement,createAsyncIncrement} from '../../redux/count_action'

export default class Count extends Component {

	state = {count:0}

	//加法
	increment = ()=>{
		const {value} = this.selectNumber
        store.dispatch(createIncrement(value*1))
	}
	//减法
	decrement = ()=>{
		const {value} = this.selectNumber
        store.dispatch(createDecrement(value*1))
	}
	//奇数再加
	incrementIfOdd = ()=>{
		const {value} = this.selectNumber
		const count = store.getState()
    
		if(count % 2 !== 0){
            
            store.dispatch(createIncrement(value*1))
		}
	}
	//异步加
	incrementAsync = ()=>{
		const {value} = this.selectNumber
		store.dispatch(createAsyncIncrement(value*1,500))
		
	}

	render() {
		return (
			<div>
				<h1>当前求和为：{store.getState()}</h1>
				<select ref={c => this.selectNumber = c}>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
				</select>&nbsp;
				<button onClick={this.increment}>+</button>&nbsp;
				<button onClick={this.decrement}>-</button>&nbsp;
				<button onClick={this.incrementIfOdd}>当前求和为奇数再加</button>&nbsp;
				<button onClick={this.incrementAsync}>异步加</button>&nbsp;
			</div>
		)
	}
}

```
index.js 监测监听：
```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import store from './redux/store'


ReactDOM.render(
    <React.StrictMode>
          <App />
    </React.StrictMode>,
    document.getElementById('root')
);

store.subscribe(()=>{
  ReactDOM.render(
    <React.StrictMode>
          <App />
    </React.StrictMode>,
    document.getElementById('root')
);
})

```


## react-redux

![react-redux](./react_images/react-redux.png)

react-redux 是由react社区开发，专用于react中的一款redux插件；

与redux 不同的是 需要 注册容器组件与ui组件

redux 案例中的文件不需要任何改动。

store将会是通过组件间传递参数的方式传入

APP.js:

```js
import React, { Component } from 'react'
import Count from './containers/Count'
import store from './redux/store'

export default class App extends Component {
	render() {
		return (
			<div>
				{/* 给容器组件传递store */}
				<Count store={store} />
			</div>
		)
	}
}
```


改写 count组件

核心是 connect方法，connect(mapStateToProps,mapDispatchToProps)(CountUI)

第一个括号内是 传入将要暴露的 state 和 注册的 dispatch

第二个参数传入UI组件

```js
import {connect} from 'react-redux'
import {increment,decrement,incrementAsync} from '../../redux/actions/count'

import React, { Component } from 'react'

class Count extends Component {

	state = {count:0}

	//加法
	increment = ()=>{
		const {value} = this.selectNumber
		this.props.increment(value*1)
	}
	//减法
	decrement = ()=>{
		const {value} = this.selectNumber
		this.props.decrement(value*1)
	}
	//奇数再加
	incrementIfOdd = ()=>{
		const {value} = this.selectNumber
		const {count} = this.props;
		if(count % 2 !== 0){
			this.props.increment(value*1)
		}
		
	}
	//异步加
	incrementAsync = ()=>{
		const {value} = this.selectNumber
		this.props.incrementAsync(value*1,500)
		
	}

	render() {
	
		return (
			<div>
                <h1>count组件</h1>
				<h1>当前求和为：{this.props.count}</h1>
                <h1>person组件的人数是：{this.props.persons}</h1>
				<select ref={c => this.selectNumber = c}>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
				</select>&nbsp;
				<button onClick={this.increment}>+</button>&nbsp;
				<button onClick={this.decrement}>-</button>&nbsp;
				<button onClick={this.incrementIfOdd}>当前求和为奇数再加</button>&nbsp;
				<button onClick={this.incrementAsync}>异步加</button>&nbsp;
			</div>
		)
	}
}


export default connect(
    state =>({
		count:state.count,
		persons:state.persons.length
	}),{
		increment,
        decrement,
        incrementAsync
    }
    
)(Count)

```


## 数据共享

多个组件间的状态都要创建Reducer.js 所以可以汇总成一个

所有变量名字要规范，尽量触发对象的简写形式
```js
/* 
	该文件用于汇总所有的reducer为一个总的reducer
*/
//引入combineReducers，用于汇总多个reducer
import {combineReducers} from 'redux'
//引入为Count组件服务的reducer
import count from './count'
//引入为Person组件服务的reducer
import persons from './person'

//汇总所有的reducer变为一个总的reducer
export default  combineReducers({
	count,
	persons
})

```

## react 拓展

* setState(stateChange, [callback])------对象式的setState

>callback是可选的回调函数, 它在状态更新完毕、界面也更新后(render调用后)才被调用
					
* setState(updater, [callback])------函数式的setState

>updater可以拿到更新前的state与传入的props;


* lazyLoad

```js
	//1.通过React的lazy函数配合import()函数动态加载路由组件 ===> 路由组件代码会被分开打包
	const Login = lazy(()=>import('@/pages/Login'))
	
	//2.通过<Suspense>指定在加载得到路由打包文件前显示一个自定义loading界面
	<Suspense fallback={<h1>loading.....</h1>}>
        <Switch>
            <Route path="/xxx" component={Xxxx}/>
            <Redirect to="/login"/>
        </Switch>
    </Suspense>
```

### Hooks

是在函数式的组件中能使用class组件中的一些能力

* useState

const [count, setCount] = React.useState(initValue);

count 即 state的值

setCount(99) 直接赋值给state

* Effect Hook

```js

React.useEffect(()=>{
	//  挂载前的生命周期
	let timer = setInterval(()=>{
		setCount(count => count+1 )
	},1000)
	// return 卸载后的生命周期
	return ()=>{
		clearInterval(timer)
	}
},[])

// 如果第二个参数传入了state 那么就会监听state 的变化

React.useEffect(()=>{

},[count])

```
* Ref Hook

const refContainer = useRef()

保存标签对象,功能与React.createRef()一样

* Fragment

react会在渲染的时候省略render所需要的根元素

```js
render() {
		return (
			<Fragment key={1}>
				<input type="text"/>
				<input type="text"/>
			</Fragment>
		)
	}
// 也可以写成下面的方式 不过不可以传递属性
render() {
		return (
			<>
				<input type="text"/>
				<input type="text"/>
			<>
		)
	}

```

* 组件优化

> 1. 只要执行setState(),即使不改变状态数据, 组件也会重新render()

> 2. 只当前组件重新render(), 就会自动重新render子组件 ==> 效率低

	优化：只有当组件的state或props数据发生改变时才重新render()

	原因：Component中的shouldComponentUpdate()总是返回true

	解决：

	办法1: 
		重写shouldComponentUpdate()方法

		比较新旧state或props数据, 如果有变化才返回true, 如果没有返回false

	办法2:  
		使用PureComponent

		PureComponent重写了shouldComponentUpdate(), 只有state或props数据有变化才返回true

		注意: 

			只是进行state和props数据的浅比较, 如果只是数据对象内部数据变了, 返回false  

			不要直接修改state数据, 而是要产生新数据

		项目中一般使用PureComponent来优化

* render props
	
>如何向组件内部动态传入带内容的结构(标签)?

>Vue中: 使用slot技术, 也就是通过组件标签体传入结构  <AA><BB/></AA>

>React中: 使用children props: 通过组件标签体传入结构

	A组件：
	<A>
	  <B>xxxx</B>
	</A>

	B组件：
	{this.props.children}

	问题: 如果B组件需要A组件内的数据, ==> 做不到 


>使用render props: 通过组件标签属性传入一个回调函数

```js
import React, { Component } from 'react'
import './index.css'
import C from '../1_setState'

export default class Parent extends Component {
	render() {
		return (
			<div className="parent">
				<h3>我是Parent组件</h3>
				<A render={(name)=><C name={name}/>}/>
			</div>
		)
	}
}

class A extends Component {
	state = {name:'tom'}
	render() {
		console.log(this.props);
		const {name} = this.state
		return (
			<div className="a">
				<h3>我是A组件</h3>
				{this.props.render(name)}
			</div>
		)
	}
}



```


* 错误边界

```js

import React from "react";

class ShowMyError extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  componentDidCatch(error, info) {
   
    this.setState({ error, info });
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          <h1>
            Error AGAIN: {this.state.error.toString()}
          </h1>
          {this.state.info &&
            this.state.info.componentStack.split("\n").map(i => {
              return (
                <div key={i}>
                  {i}
                </div>
              );
            })}
        </div>
      );
    }
    return this.props.children;
  }
}

class Broken extends React.Component {
  constructor(props) {
    super(props);
    this.state = { throw: false, count: 0 };
  }

  render() {
    if (this.state.throw) {
      throw new Error("YOLO");
    }

    return (
      <div>
        <button
          onClick={e => {
            this.setState({ throw: true });
          }}
        >
          button will render error.
        </button>
        
        <button onClick={e => {
          this.setState(({ count }) => ({
            count: count + 1
          }));
        }}>button will not throw</button>

        <div>
          {"All good here. Count: "}{this.state.count}
        </div>
      </div>
    );
  }
}

export default class App extends React.Component {
  render() {
    const styles = {
      fontFamily: "sans-serif",
      textAlign: "center"
    };
    return (
      <div>
      <p style={{maxWidth: "400px", margin: "0 auto", lineHeight: "1.5rem", border: "1px solid black", borderRadius: "8px", padding: "10px 15px", background: "gold"}}>
      CODESANDBOX is running in an environment that prevents <code>componentDidCatch</code> from working properly. 
      <br/> 
      <a href="https://codepen.io/blairbear/pen/GQrMPW">Checkout this CodePen instead</a>
      <br/>
      component preserved below for posterity.
      </p>
      <div style={styles}>
  
        <h2>Start clicking to see some {"\u2728"}magic{"\u2728"}</h2>
          <ShowMyError>
            <Broken />
          </ShowMyError>
      </div>
      </div>
    );
  }
}


```