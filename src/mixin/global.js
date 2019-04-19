import axios from '@/lib/http'
import store from '@/store'
const commonParams = {
  getLyric: (that) => {
    axios.$get({
      url: store.state.serveSrc + '/lyric',
      data: { id: that.ids }
    }).then(res => {
      if (res && res.lrc && res.lrc.lyric) {
        that.lyric = res.lrc.lyric.split('\n')
        for (let i = 0; i < that.lyric.length; i++) {
          that.lyric[i] = that.lyric[i].replace(/\[|\]/g, '')
        }
      }else{
        return []
      }
   }).catch((err)=>{
     console.log(err)
   })
  },
  musicToggle: (that, audio, type) => {
    var _this = this
    if (type == 1) {
      that.MusicIndex = that.MusicIndex - 1
    } else if (type == 0) {
      that.MusicIndex = that.MusicIndex + 1
    }
    that.ids = that.toplist[that.MusicIndex].id
    that.playStatus = true
    that.musicNm = that.toplist[that.MusicIndex].name
    that.musician = that.toplist[that.MusicIndex].artists ? that.toplist[that.MusicIndex].artists : that.toplist[that.MusicIndex].ar
    axios.$get({
      url: store.state.serveSrc + '/music/url',
      data: { id: that.ids }
    }).then(res => {
      that.url = res.data[0].url
      that.playStatus = false
      setTimeout(() => {
        audio.play()
      }, 500)
      that.lyric = that.GLOBAL.commonParams.getLyric(that)
    })
  }

}
export default {
  commonParams
}
