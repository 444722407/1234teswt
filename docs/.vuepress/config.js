const path = require('path')
module.exports = {
    theme: 'reco',
    title: "本杰明蚂蚁",
    description: '壮志凌云几分愁，知己难逢几人留',
    head: [
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
    ],
    locales: {
    '/': {
            lang: 'zh-CN'
        }
    },
    plugins: [
        'go-top',
        'cursor-effects', 
        [
         'dynamic-title',
            {
                showIcon: '/favicon.ico',
                showText: '(/≧▽≦/)咦！又好了！',
                hideIcon: '/failure.ico',
                hideText: '(●—●)喔哟，崩溃啦！',
                recoverTime: 2000,
         },
        ],
        ['@vuepress-reco/vuepress-plugin-kan-ban-niang',{
            theme:['haru1'],
            clean:true,
            width:220,
            height:352

        }],
    ],
    themeConfig: {
        type:'blog',
        startYear: '2021',
        author: '陈瑶',
        authorAvatar: '/avatar.png',
        nav: [
         { text: '首页', link: '/', icon: 'reco-home' },
         { text: '时间轴', link: '/timeline/', icon: 'reco-date' }
        ],
             // 博客配置
        blogConfig: {
            category: {
                location: 2,     // 在导航栏菜单中所占的位置，默认2
                text: '分类' // 默认文案 “分类” 
            },
            tag: {
                location: 3,  //在导航栏菜单中所占的位置，默认3
                text: '标签'      // 默认文案 “标签”
            },
            socialLinks: [     // 信息栏展示社交信息
                { icon: 'reco-github', link: 'https://github.com/444722407' }
              
            ]
        }
    }
  
    
  }

