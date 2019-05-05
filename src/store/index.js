import Vue from 'vue'
import Vuex from 'vuex'
import toast from './module/toast'
Vue.use(Vuex)
const state = {
  // header标题
  topNm: '歌单',
  // 作者
  artists: [],
  // 播放列表
  topList: [],
  // 播放页初始化参数
  playObj: {
    ids: '',
    url: '',
    name: '',
    listId: '',
    MusicIndex: '',
    artists: []
  },
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
  get_playObj: (state) => {
    return state.playObj
  },
}
const mutations = {
  update_artists (state, obj) {
    state.artists = obj
  },
  update_topList (state, obj) {
    state.topList = obj
  },
  update_topNm (state, obj) {
    state.topNm = obj
  },
  update_playObj (state, obj) {
    Object.assign(state.playObj, obj)
  }
}
const actions = {
  commit_artists (context, obj) {
    context.commit('update_artists', obj)
  },
  commit_topList (context, obj) {
    context.commit('update_topList', obj)
  },
  commit_playObj(context, obj) {
    context.commit('update_playObj', obj)
  }
}
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
export default store
