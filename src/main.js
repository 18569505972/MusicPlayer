// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import play from '@/components/play'
import publicVar from '@/components/global'

Vue.config.productionTip = false

Vue.component("playMusic", play)

Vue.prototype.GLOBAL=publicVar;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
