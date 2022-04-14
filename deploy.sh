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