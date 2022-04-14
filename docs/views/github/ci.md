---
title: GitHub自动部署
date: 2021-03-31
sidebar: 'auto'
categories:
 - 学习
tags:
 - git
---
# 前言

GitHub自动部署：

每次监听push 通过github Action 运行自动化的脚本为项目打包和部署

当然也可以发布到codeing其他代码平台 

方便之处就只要push 就行了 不用本地打包构建在上传 提升效率


## 1、获取token

[github获取token官方文档](https://docs.github.com/cn/github/authenticating-to-github/creating-a-personal-access-token)

通过上一步创建了个人token后,然后添加到secrets，token_key的名称要一致

![secrets](./secrets.png)

## 2、创建yml脚本文件

[github Action 简介](https://docs.github.com/cn/actions/learn-github-actions/introduction-to-github-actions)

在github库的action 选项卡下新建yml文件

以下是node.js的模板:

![node](./node.png)

![node_yml](./nodeyml.png)

## 3、编写yml脚本文件

我们不能按模板给的脚本来执行自动化命令，需要编写自己的

先git pull 拉下来模板，在这基础上编写

[构建流程语法](https://docs.github.com/cn/actions/reference/workflow-syntax-for-github-actions#onpushpull_requestpaths)

完整代码:

```yml
# This workflow will do a clean install of node dependencies, build the source code and run tests across different versions of node
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions

name: CI

# 在master分支发生push事件时触发。
on: 
  push:
    branches:
      - master
jobs: # 工作流
  build:
    runs-on: ubuntu-latest #运行在虚拟机环境ubuntu-latest

    strategy:
      matrix:
        node-version: [10.x]

    steps: 
      - name: Checkout # 步骤1
        uses: actions/checkout@v1 # 使用的动作。格式：userName/repoName。作用：检出仓库，获取源码。 官方actions库：https://github.com/actions
      - name: Use Node.js ${{ matrix.node-version }} # 步骤2
        uses: actions/setup-node@v1 # 作用：安装nodejs
        with:
          node-version: ${{ matrix.node-version }} # 版本
      - name: run deploy.sh # 步骤3 （同时部署到github和coding）
        env: # 设置环境变量
          GITHUB_TOKEN: ${{ secrets.ACCESS_TOKEN }} # toKen私密变量
        run: npm install && npm run push # 执行的命令  
        # package.json 中添加 "deploy": "bash deploy.sh"
```
::: tip
ACCESS_TOKE 是保存在github仓库的Settings/Secrets位置的私密变量，仓库代码中可以通过<secrets.变量名>来获取，保证了token的私密性。
::: 

::: tip
npm run push 是在package.json中定义的脚本 
 { "push":"bash deploy.sh" }
::: 



## 4、编写deploy.sh

```sh
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# deploy to github
# 如果有token环境变量
if [ -z "$GITHUB_TOKEN" ]; then
  msg='deploy'
  githubUrl=git@github.com:xugaoyi/blog.git
else
  msg='来自github action的自动部署'
  githubUrl=https://44722407:${GITHUB_TOKEN}@github.com/444722407/444722407.github.io.git
  git config --global user.name "chenyao"
  git config --global user.email "444722407@qq.com"
fi


git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
git push -f $githubUrl  master

cd -
```

::: tip
Shell 可以获取到上一步yml中设置的GITHUB_TOKEN环境变量。

如果没有说明是在本地自己的电脑上运行的部署，使用ssh代码仓库地址，如果有token环境变量，说明是GitHub Actions自动触发的部署，此时使用的是可以通过toKen来获取代码提交权限的提交地址。最后通过git命令

提交到各自的仓库，完成部署。
::: 

![deploy](./deploy.png)

## 5、github cdn静态资源
https://cdn.jsdelivr.net/gh/GitHub用户名/仓库名@分支名/文件路径

例子：[https://cdn.jsdelivr.net/gh/444722407/blog@master/docs/.vuepress/public/bg.jpg](https://cdn.jsdelivr.net/gh/444722407/blog@master/docs/.vuepress/public/bg.jpg)

## 5、参考文献
[GitHub Actions 实现自动部署静态博客](https://xugaoyi.com/pages/6b9d359ec5aa5019/#%E5%AE%9E%E7%8E%B0)

[VuePress教程之部署到Github Action](https://cloud.tencent.com/developer/article/1777585)

