# 基于网易云音乐api的播放器

## 技术栈
vue-cli3.0+vue-router+vuex+ant-design-vue。  
ant-design-vue中的ui组件，按需引入，未全部引用。在babel.config.js中配置。    
样式采用less语法，vue.config.js中单独配置了less-loader。  

## 项目运行
```
git@github.com:18569505972/MusicPlayer.git
cnpm install
npm run serve
```

## 项目结构
```
│  babel.config.js                   // babel配置文件
│  package.json                      // 依赖包
│  vue.config.js                     // vue环境配置文件
│
├─public
│  │  index.html                     // html模板
│  │
│  └─static
│          base.css                  // 全局css
│          fixScreen.js              // rem自适应
│
└─src
    │  App.vue                       // 根组件
    │  main.js                       // 入口文件
    │
    ├─assets
    │  ├─icon                        // 图标库
    │  │      alt.png
    │  │      left.png
    │  │      list.png
    │  │      listPlay.png
    │  │      loopPlay.png
    │  │      next.png
    │  │      pause.png
    │  │      play.png
    │  │      prev.png
    │  │      randomPlay.png
    │  │      right.png
    │  │      singlePlay.png
    │  │
    │  └─images                       // 图片资源
    │          0newMusicList.jpg
    │          1hotMusicList.jpg
    │          2createMusicList.jpg
    │          3upMusicList.jpg
    │          4electricMusicList.jpg
    │          7KTVMusicList.jpg
    │          ACG.jpg
    │          classical.jpg
    │          electric.jpg
    │          game.jpg
    │          hiphap.jpg
    │
    ├─components                      // 公共组件 
    │  └─header                       // 头部导航条组件
    │          pageHead.js
    │          pageHead.vue
    │
    ├─lib                             // 插件库
    │      http.js                    // axios封装
    │
    ├─mixin                           // 公共方法
    │      global.js
    │
    ├─router                          // 路由管理
    │      index.js
    │
    ├─store                           // vuex状态管理
    │  │  index.js
    │  │
    │  └─module
    │          toast.js
    │
    └─views                           // 视图组件
            index.vue                 // 推荐歌单
            musicianList.vue          // 歌手排行榜
            play.vue                  // 播放器
            recommendAlbum.vue        // 歌单详情
            topList.vue               // 音乐榜单
```

## 接口数据
### /api/personalized
获取推荐歌单
### /api/top/list
获取歌曲排行榜
### /api/toplist/artists
获取歌手榜单
### /api/artists
获取歌手详情
### /api/playlist/detail
获取歌单详情
### /api/music/url
获取播放地址
### /api/lyric
获取歌词
### 备注
参考项目：[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)  
针对以上参考项目做了接口以及返回数据量的一些精简。  
本项目精简Api:[精简版api](https://github.com/18569505972/wangyi/tree/master)  
