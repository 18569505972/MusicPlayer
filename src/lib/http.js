import axios from 'axios'
import qs from 'qs'
var instance = axios.create({
  baseURL: 'http://114.115.139.24:80',
  timeout: 20000,
  // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false, // 默认的
})
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';
// 请求拦截器
instance.interceptors.request.use((request) => {
  return request;
})
// 响应拦截器
instance.interceptors.response.use((response) => {
  return response;
})
const $post = function({ url, data = {}, headerObj = {} }) {
  return instance({
    url: url,
    method: 'post',
    headers: Object.assign({
      'content-type': 'application/x-www-form-urlencoded',
      'tpken': 'token'
    }, headerObj),
    data: data,
    transformRequest: [function(data) {
      return data //修改请求数据,只能用于post、put、patch
    }],
    transformResponse: [function(data) {
      return data //修改响应数据
    }]
  }).then((data) => {
    if (data.status != '0000') {
      // 提示错误信息
    }
    return data
  }).catch(error => {
    alert('网络不给力')
  })
}
const $get = function({ url, data = {}, headerObj = {} }) {
  return instance({
    url: url,
    method: 'get',
    params: data,
    dataType: 'json',
    paramsSerializer: function(params) {
      return qs.stringify(params) //序列化params参数
    },
    transformResponse: [function(data) {
      return data //修改响应数据
    }]
  }).then((res) => {
    if (res.status != '0000') {
      // 提示错误信息
    }
    return JSON.parse(res.data)
  }).catch(error => {
    alert('网络不给力' + error)
  })
}
export default { $get, $post, axios }
