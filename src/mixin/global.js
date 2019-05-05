import axios from '@/lib/http'
const commonParams = {
  getLyric: (that) => {
    axios.$get({
      url: '/lyric',
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
     console.log('getLyric' + err)
     that.$message.error('网络超时')
   })
  },
  musicToggle: (that, audio, type) => {
    if (type == 1) {
      that.MusicIndex = that.MusicIndex - 1
    } else if (type == 0) {
      that.MusicIndex = that.MusicIndex + 1
    }
    that.ids = that.toplist[that.MusicIndex].id
    that.playStatus = true
    let musician = that.toplist[that.MusicIndex].artists ? that.toplist[that.MusicIndex].artists : that.toplist[that.MusicIndex].ar
    that.$set(that.$store.state.playObj, 'artists', musician)
    let topNm = that.toplist[that.MusicIndex].name,
        artistsNm = ""
    if (musician.length>0) {
      for(let i=0;i<musician.length;i++) {
        if (i<musician.length-1) {
          artistsNm+=musician[i].name + '、'
        } else {
          artistsNm+=musician[i].name
        }
      }
    }
    let topnm = topNm + artistsNm
    that.update_topNm(topnm)
    axios.$get({
      url: '/music/url',
      data: { id: that.ids }
    }).then(res => {
      if (res) {
        that.url = res.data[0].url
        that.playStatus = false
        setTimeout(() => {
          audio.play()
        }, 500)
        that.lyric = commonParams.getLyric(that)
      } else {
        that.$message.error('获取播放链接失败')
      }
    })
  }

}
export default {
  commonParams
}
