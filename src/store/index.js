import Vue from 'vue'
import Vuex from 'vuex'
import toast from './module/toast'
Vue.use(Vuex)
const state = {
  serveSrc: 'http://localhost:8080/api',
  // header标题
  topNm: '',
  // 作者
  artists: [],
  // 播放列表
  topList: [],
  // 播放url
  ids: ''
}
const getters = {
  get_artists: (state) => {
    return state.artists
  },
  get_topList: (state) => {
    return state.topList
  },
  get_topNm: (state) => {
    return state.topNm
  },
  get_ids: (state) => {
    return state.ids
  }
}
const mutations = {
  update_artists (state, obj) {
    // Object.assign(state.topList, obj)
    state.artists = obj
  },
  update_topList (state, obj) {
    // Object.assign(state.topList, obj)
    state.topList = obj
  },
  update_topNm (state, obj) {
    // Object.assign(state.topList, obj)
    state.topNm = obj
  },
  update_ids (state, obj) {
    // Object.assign(state.topList, obj)
    state.ids = obj
  }
}
const actions = {
  commit_artists (context, obj) {
    context.commit('update_artists', obj)
  },
  commit_topList (context, obj) {
    context.commit('update_topList', obj)
  }
}
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
export default store
