---
title: vue3学习
date: 2021-07-15
sidebar: 'auto'
categories:
- 学习
tags:
- vue
---


## vue3中的代码格式

```vue

<template>
  <div>

  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
export default defineComponent({
  name:"App",
  setup() {
    return {
    }
  }
})
</script>

<style lang="css" scoped>
</style>

```

## vscode 代码片段的编辑

```json

	{
        "Print to console": {
        "prefix": "vv3",
        "body": [
            "<template>",
            "  <div>\n",
            "  </div>",
                "</template>\n",
                "<script lang=\"ts\">",
                "import {defineComponent} from \"vue\"",
                "export default defineComponent({",
                "  name:\"App\",",
                "  setup() {",
                "    return {",
                "    }",
                "  }",
                "})",
                "</script>\n",
                "<style lang=\"css\" scoped>",
                "</style>",
                "$2"

        ],
        "description": "Log output to console"
        }
    }

```


## setup

1、vue3中新的函数，函数如果返回对象, 对象中的属性或方法, 模板中可以直接使用；

2、执行的周期在 在 beforeCreate 之前执行(一次), 此时组件对象还没有创建 访问不到this

3、返回对象中的属性会与 data 函数返回对象的属性合并成为组件对象的属性  

4、返回对象中的方法会与 methods 中的方法合并成功组件对象的方法

5、如果有重名, setup 优先

6、一般不要混合使用: methods 中可以访问 setup 提供的属性和方法, 但在 setup 方法中不能访问 data 和 methods

7、setup 不能是一个 async 函数: 因为返回值不再是 return 的对象, 而是 promise, 模板看不到 return 对象中的属性数据

setup 的参数：

    setup(props, context) / setup(props, {attrs, slots, emit})

    props: 包含 props 配置声明且传入了的所有属性的对象

    attrs: 包含没有在 props 配置中声明的属性的对象, 相当于 this.$attrs

    slots: 包含所有传入的插槽内容的对象, 相当于 this.$slots

    emit: 用来分发自定义事件的函数, 相当于 this.$emit


## ref

作用: 定义一个数据的响应式

一般用来定义一个基本类型的响应式数据




## reactive

定义多个数据的响应式

const proxy = reactive(obj): 接收一个普通对象然后返回该普通对象的响应式代理器对象

响应式转换是“深层的”：会影响对象内部所有嵌套的属性

内部基于 ES6 的 Proxy 实现，通过代理对象操作源对象内部数据都是响应式的




## 比较 Vue2 与 Vue3 的响应式

vue2:

对象: 通过 defineProperty 对对象的已有属性值的读取和修改进行劫持(监视/拦截)

数组: 通过重写数组更新数组一系列更新元素的方法来实现元素修改的劫持


vue3:

通过 Proxy(代理): 拦截对 data 任意属性的任意(13 种)操作, 包括属性值的读写, 属性的添加, 属性的删除等...

通过 Reflect(反射): 动态对被代理对象的相应属性进行特定的操作


```js

new Proxy(data, {
  // 拦截读取属性值
  get(target, prop) {
    return Reflect.get(target, prop)
  },
  // 拦截设置属性值或添加新属性
  set(target, prop, value) {
    return Reflect.set(target, prop, value)
  },
  // 拦截删除属性
  deleteProperty(target, prop) {
    return Reflect.deleteProperty(target, prop)
  }
})

proxy.name = 'tom'

```


## ref 与 reactive 的比较

ref 用来处理基本类型数据, reactive 用来处理对象(递归深度响应式)

如果用 ref 对象/数组, 内部会自动将对象/数组转换为 reactive 的代理对象

ref 内部: 通过给 value 属性添加 getter/setter 来实现对数据的劫持

reactive 内部: 通过使用 Proxy 来实现对对象内部所有数据的劫持, 并通过 Reflect 操作对象内部数据

ref 的数据操作: 在 js 中要.value, 在模板中不需要(内部解析模板时会自动添加.value)

## 计算属性与监视

computed 函数:

与 computed 配置功能一致

有 getter 和 setter

watch 函数

与 watch 配置功能一致

监视指定的一个或多个响应式数据, 一旦数据变化, 就自动执行监视回调

默认初始时不执行回调, 但可以通过配置 immediate 为 true, 来指定初始时立即执行第一次

通过配置 deep 为 true, 来指定深度监视

watchEffect 函数

不用直接指定要监视的数据, 回调函数中使用的哪些响应式数据就监视哪些响应式数据

默认初始时就会执行第一次, 从而可以收集需要监视的数据

监视数据发生变化时回调


## vue3生命周期

vue2中的 destroyed ->vue3中的 unmounted

vue2中的 beforeDestroy ->vue3中的 beforeUnmount


setup函数中可以使用生命周期

beforeCreate -> 使用 setup()

created -> 使用 setup()

beforeMount -> onBeforeMount

mounted -> onMounted

beforeUpdate -> onBeforeUpdate

updated -> onUpdated

beforeDestroy -> onBeforeUnmount

destroyed -> onUnmounted

errorCaptured -> onErrorCaptured



## 自定义 hook 函数


## toRefs

把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref

可以在不丢失响应式的情况下对返回的对象进行分解使用

```vue
<template>
  <h2>App</h2>
  <h3>foo: {{ foo }}</h3>
  <h3>bar: {{ bar }}</h3>
  <h3>foo2: {{ foo2 }}</h3>
  <h3>bar2: {{ bar2 }}</h3>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue'
/*
toRefs:
  将响应式对象中所有属性包装为ref对象, 并返回包含这些ref对象的普通对象
  应用: 当从合成函数返回响应式对象时，toRefs 非常有用，
        这样消费组件就可以在不丢失响应式的情况下对返回的对象进行分解使用
*/
export default {
  setup() {
    const state = reactive({
      foo: 'a',
      bar: 'b'
    })

    const stateAsRefs = toRefs(state)

    setTimeout(() => {
      state.foo += '++'
      state.bar += '++'
    }, 2000)

    const { foo2, bar2 } = useReatureX()

    return {
      // ...state,
      ...stateAsRefs,
      foo2,
      bar2
    }
  }
}

function useReatureX() {
  const state = reactive({
    foo2: 'a',
    bar2: 'b'
  })

  setTimeout(() => {
    state.foo2 += '++'
    state.bar2 += '++'
  }, 2000)

  return toRefs(state)
}
</script>
```


##  ref 获取元素


利用 ref 函数获取组件中的标签元素

功能需求: 让输入框自动获取焦点

```vue
<template>
  <h2>App</h2>
  <input type="text" />
  ---
  <input type="text" ref="inputRef" />
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
/*
ref获取元素: 利用ref函数获取组件中的标签元素
功能需求: 让输入框自动获取焦点
*/
export default {
  setup() {
    const inputRef = ref<HTMLElement | null>(null)

    onMounted(() => {
      inputRef.value && inputRef.value.focus()
    })

    return {
      inputRef
    }
  }
}
</script>

```


## 其他组合api


shallowReactive：浅响应式；

shallowRef: 只响应式到value层级；

以上2个一旦有其他的发生响应式的操作，将会触发响应式）；

readonly：深度只读；

shallowReadonly：浅度只读；

toRaw：响应式对象转换成普通对象；

markRaw：标记某个属性为普通对象

toRef: 为响应式对象上的某个属性创建一个 ref 对象

```js
const foo = toRef(state, 'foo');
```


customRef:创建一个自定义的 ref,有get(),set()方法；

```js
    customRef((track, trigger) => {
    return {
        get() {
            // 告诉Vue追踪数据
            track()
            return value
        },
        set(newValue: T) {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                value = newValue
                // 告诉Vue去触发界面更新
                trigger()
            }, delay)
        }
    }
})
```

vue3新组件的使用：

Fragment:片段 不需要像vue2一样需要根标签包裹

Teleport：瞬移 

```vue
  <teleport to="body"></teleport>  
  
  // 指定插入到某个元素中去

```


Suspense：它们允许我们的应用程序在等待异步组件时渲染一些后备内容，可以让我们创建一个平滑的用户体验

   ```vue
    <template>
        <Suspense>
            <template v-slot:default>
                     //    会去判断setup函数中是否是异步 如果是 就走下面的 v-slot:fallback
                 <AsyncComp />
            </template>

            <template v-slot:fallback>
                <h1>LOADING...</h1>
            </template>
        </Suspense>
    </template>
   ```




