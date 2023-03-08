#!/usr/bin/env sh
# 确保脚本抛出遇到的错误
set -e

# 如果$GITHUB_TOKEN环境变量字符串 长度为0则为true  本地长度为0 线上打包环节为保密的值不为0
if [ -z "$GITHUB_TOKEN" ]; then
  msg='deploy-local'
  githubUrl=git@github.com:444722407/blog.git

else
  # 生成静态文件
  npm run docs:build
  # 进入生成的文件夹
  cd docs/.vuepress/dist
  
  msg='来自github action的自动部署'

  githubUrl=https://44722407:${GITHUB_TOKEN}@github.com/444722407/444722407.github.io.git

  git config --global user.name "chenyao"

  git config --global user.email "444722407@qq.com"

fi


git init
git add -A
git commit -m $msg

# # 如果发布到 https://<USERNAME>.github.io
git push -f $githubUrl  master

