---
title: vuex demo
date: 2021-04-09
categories:
- 学习
tags:
- vue
---


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
     <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/vuex@3.6.2/dist/vuex.js"></script>
    
</head>
<body>
    <div id="app">
     
          <div v-if='requesting'>加载中...</div>
          <div v-else>
            {{hello}}
            {{count}}
            <button @click='increment'>++</button>
            <chen></chen>
          </div>
    </div>
   
    <script>
       
        
        Vue.use(Vuex); 
        const INCREMENT = 'increment';
        const INIT ='init';
        const CHEN_INCREMENT = 'chen_increment';
         // 局部的 store
        const chenStore ={
            state:{
                chenNum:10000
            },
            getters:{
                chenNum: state => state.chenNum
            },

            actions:{
                    increment ({commit,state,rootState}) {
                        rootState.requesting = true;
                            setTimeout(()=>{
                                rootState.requesting = false;
                                commit(INCREMENT)
                                commit(CHEN_INCREMENT)
                    },1000)}
                    
            },
            mutations: {
                [CHEN_INCREMENT] (state) {
                    state.chenNum++;
                },
            },

        }

        const store = new Vuex.Store({
            state: {
                count: 0,
                requesting:true
            },
            actions:{
                       init ({commit,state}) {
                            setTimeout(()=>{
                                state.requesting = false;
                                commit(INIT)
                        },1000)
                    }
            },
            mutations: {
                [INCREMENT] (state) {
                    state.count++;
                },
                [INIT](state){
                    state.count = 100;
                }
            },
            modules:{
                chenStore
            }

        })   

        const chen = {
            data(){
              return {
                 
              }  
            },
            template:`<div @click='increment'>chenyao{{chenNum}}</div>`,
            computed:{
                ...Vuex.mapGetters(['chenNum'])
            },
            methods:{
                ...Vuex.mapActions(['increment'])
            },
        }
        
        var vm = new Vue({
            el:"#app",
            components:{
                chen
            },
            data() {
                return {
                    hello: "hello world"
                }
            },
            mounted(){
                this.init()
            },
            store: store,
            methods:{
                ...Vuex.mapActions(['increment','init'])
            },
            
            computed:{
                ...Vuex.mapState(['count','requesting'])
            }
        })
 
    </script>
</body>
</html>
```


:::tip
子组件将获取不到state,可以用getters：
```js
 computed:{
        ...Vuex.mapGetters(['chenNum'])
    },
```
:::

:::tip
需要改变全局的state,用rootState
```js
 increment ({commit,state,rootState}) {
    rootState.requesting = true;
        setTimeout(()=>{
            rootState.requesting = false;
            commit(INCREMENT)
            commit(CHEN_INCREMENT)
},1000)}
```
:::


:::tip
通过改变全局state中的requesting 来处理loading
:::

