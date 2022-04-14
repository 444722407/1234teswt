---
title: 脱单盲盒项目的总结
date: 2021-10-20
tags:
  - 微信小程序
categories:
  - 经验
---


1、input弹窗顶页面的解决方案：

```js
setScrollFocus: function (x, y) {
    document.getElementsByClassName("mask_setBox")[0].style.bottom = "-140px";
},
setScrollBlur: function (x, y) {
    document.getElementsByClassName("mask_setBox")[0].style.bottom = "-0px";
},
```

2、jssdk 在app.vue中引用后出现 调用分享不生效

解决：入口html中调用

3、微信上传图片接口不能循环调用，需要递归

```js
  async inputFileClick() {
      let count = 3 - this.imageList2.length;
      let _this = this;
      if (!this.is_upload) {
        wx.chooseImage({
          count: count, // 默认9
          sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album"], // 可以指定来源是相册还是相机，默认二者都有
          success: async function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

            _this.imageList = [..._this.imageList, ...localIds];
            _this.localIds = localIds;
            _this.syncUpload();
          },
        });
      }
    },
    async syncUpload() {
      let _this = this;
      if (!this.localIds.length) {
        setTimeout(() => {
          this.is_upload = false;
        }, 200);
        return;
      } else {
        this.is_upload = true;
        var localId = _this.localIds.pop();
        wx.uploadImage({
          localId: localId,
          isShowProgressTips: 0,
          success: async function (res) {
            var serverId = res.serverId;
            var imgdata = await upLoadImage({ serverid: serverId });
            _this.is_upload = false;
            _this.imageList2.push(imgdata.data.data.img_url);
            _this.syncUpload();
          },
        });
      }
    },
```

4、登录代码

```js


function goWxlogin(pid){
  window.location.href ="https://api.mkrun.cn/login/wx_web?pid=" + pid;
 }
 function getQueryVariable(variable)
 {
        var query = window.location.search.substring(1);
       
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1];}
        }
        return(false);
 }


router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }

  
  let code = getQueryVariable('code');
  let pid = to.query.pid || getQueryVariable('pid');
  console.log(code,pid)
  let token = localStorage.getItem("token");

  if (code && !token) {
   
    try{
      await getAccessTokne({code,pid});
      next()
    }catch(err){
      goWxlogin(pid)
      next()
    }
   
  } else if (token) {
    //已登录，有token，判断是否过期
    console.log('您已登录')
    next()
  } else {
    //未登录，没有token，去登录
    //去登录
    goWxlogin(pid)
    next()
  }
});

```