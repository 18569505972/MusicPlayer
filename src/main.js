import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index'
import store from '@/store/index' 
import axios from '@/lib/http'
import { message } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import PageHead from '@/components/header/pageHead'

Vue.config.productionTip = false
// 全局绑定axios
Vue.prototype.$http = axios
// 全局气泡组件
message.config({
  top: `50%`,
  duration: 2,
  maxCount: 3,
});
Vue.prototype.$message = message
// 全局头部导航条
Vue.use(PageHead)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
