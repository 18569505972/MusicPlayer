import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import recommendAlbum from '@/views/recommendAlbum'
import topList from '@/views/topList'
import play from '@/views/play'
vue.component("playMusic", {
  template: play
})

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/recommendAlbum/:albumId',
      name: 'recommendAlbum',
      component: recommendAlbum
    },
    {
      path: '/topList/:idx/:topNm',
      name: 'topList',
      component: topList
    }
  ]
})
