<template>
  <div class="container">
    <x-header id="x-header">
      {{musicNm}}&nbsp;
      <template v-for="(siginal,index) in artistsList" v-if="artistsList">{{siginal.name}}{{artistsList.length==(1+index)?'':'、'}}</template>
    </x-header>
    <section ref="section">
      <p v-for="(item,index) in lyric" :data-timeline="item.match(/\d{2}:\d{2}.\d{2}/g)" :class="['lyricline',{'red':lyricIndex == index}]">{{item.replace(/\d{2}:\d{2}.\d{2,}/g,'')}}</p>
    </section>
    <p class="progress" id="slide" v-bind:style="{width:musicPercent}" @click="setProgress($event)"></p>
    <p class="progress" id="buffer" v-bind:style="{width:bufferPercent}" @click="setProgress($event)"></p>
    <p class="progress" @click="setProgress($event)"></p>
    <footer>
      <div class="playType">
        <img v-show="showimg==0" src="/static/icon/loopPlay.png" style="display:inline-block" data-type="0" @click="changePlayType($event)">
        <img v-show="showimg==1" src="/static/icon/singlePlay.png" data-type="1" @click="changePlayType($event)">
        <img v-show="showimg==2" src="/static/icon/randomPlay.png" data-type="2" @click="changePlayType($event)">
      </div>
      <p>
        <img src="/static/icon/prev.png" id="prev" @click="prevPlay">
        <img v-show="playStatus" src="/static/icon/play.png" class="play" @click="playAndPause">
        <img v-show="(!playStatus)" src="/static/icon/pause.png" class="play" @click="playAndPause">
        <img src="/static/icon/next.png" id="next" @click="nexPlay">
      </p>
      <div>
        <img src="/static/icon/list.png" @click="showList">
      </div>
    </footer>
    <div class="shadow" v-show="listStatus" @click="shadowHide"></div>
    <div class="list" v-show="listStatus">
      <p v-for="(item,index) in toplist" @click="playList(index)">
        <span>{{item.name}}</span>
      </p>
    </div>
    <audio :src="url" @timeupdate="lyricStep" @ended="autoChange" @progress="bufferProgress" ref="audio"></audio>
  </div>
</template>
<script>
import { XHeader } from 'vux'
import { mapGetters } from 'vuex'
export default {
  components: {
    XHeader
  },
  data() {
    return {
      musicNm: this.$route.query.name, // 歌曲名
      url: decodeURIComponent(this.$route.query.url), // 歌曲url
      playStatus: true, // 播放暂停切换
      lyric: [], // 歌词
      lyricIndex: 0,
      MusicIndex: this.$route.query.MusicIndex, // 歌曲序号
      ids: this.$route.query.ids, // 歌曲id
      listStatus: false, // 控制歌单列表显隐
      changeType: 0, // 切换方式:0 循环 ，1 单曲，2 随机
      bufferPercent: '0%', // 缓存进度
      musicPercent: '0%', // 播放进度
      showimg: 0 // 控制展示图片
    }
  },
  created() {
    this.lyric = this.GLOBAL.commonParams.getLyric(this)
  },
  mounted() {
  },
  methods: {
    playAndPause() {
      var audio = this.$refs.audio
      if (audio.paused) {
        this.playStatus = false
        audio.play()
      } else {
        this.playStatus = true
        audio.pause()
      }
    },
    lyricStep(e) {
      var currentTime = e.target.currentTime.toFixed(2)
      var duration = e.target.duration.toFixed(2)
      this.musicPercent = ((currentTime / duration) * 100).toFixed(3) + '%'
      if (this.lyric) {
        var lyriclines = document.querySelectorAll('.lyricline')
        lyriclines.forEach((item, index) => {
          var lyricTime = item.getAttribute('data-timeline')
          if (lyricTime) {
            lyricTime = lyricTime.split(':')
            lyricTime = parseInt(lyricTime[0]) * 60 + parseFloat(lyricTime[1])
            if (currentTime >= lyricTime) {
              this.lyricIndex = index
              this.$refs.section.scrollTop = item.offsetTop - 200
              return
            }
          }
        })
      }
    },
    nexPlay() {
      this.lyricIndex = 0
      var audio = this.$refs.audio
      if (this.changeType == 0) {
        if (this.MusicIndex != (this.toplist.length - 1)) {
          this.GLOBAL.commonParams.musicToggle(this, audio, 0)
        } else {
          this.MusicIndex = 0
          this.GLOBAL.commonParams.musicToggle(this, audio, 2)
        }
      } else if (this.changeType == 1) {
        var isLoadAudio = audio.load()
        if (isLoadAudio !== undefined) {
          isLoadAudio.then(() => {
            audio.play()
          }).catch(() => {
            alert('未知播放源')
          })
        }
      } else {
        var random = Math.floor(Math.random() * this.toplist.length)
        random = (random == this.MusicIndex) ? (Math.floor(Math.random() * this.toplist.length)) : random
        this.MusicIndex = random
        this.GLOBAL.commonParams.musicToggle(this, audio, 2);
      }
    },
    prevPlay() {
      this.lyricIndex = 0
      var audio = this.$refs.audio
      if (this.changeType == 0) {
        if (this.MusicIndex != 0) {
          this.GLOBAL.commonParams.musicToggle(this, audio, 1)
        } else {
          this.MusicIndex = this.toplist.length - 1
          this.GLOBAL.commonParams.musicToggle(this, audio, 2)
        }
      } else if (this.changeType == 1) {
        var isLoadAudio = audio.load()
        if (isLoadAudio !== undefined) {
          isLoadAudio.then(() => {
            audio.play()
          }).catch(() => {
            alert('未知播放源')
          })
        }
      } else {
        var random = Math.floor(Math.random() * this.toplist.length);
        random = (random == this.MusicIndex) ? (Math.floor(Math.random() * this.toplist.length)) : random
        this.MusicIndex = random
        this.GLOBAL.commonParams.musicToggle(this, audio, 2)
      }
    },
    showList() {
      if (this.listStatus) {
        this.listStatus = false
      } else {
        this.listStatus = true
      }
    },
    shadowHide() {
      this.listStatus = false
    },
    playList(index) {
      this.lyricIndex = 0
      var audio = this.$refs.audio
      this.MusicIndex = index
      this.listStatus = false
      this.GLOBAL.commonParams.musicToggle(this, audio, 2)
    },
    autoChange() {
      this.lyricIndex = 0
      var audio = this.$refs.audio
      this.playStatus = false
      if (this.changeType == 0) {
        if (this.MusicIndex != (this.toplist.length - 1)) {
          this.GLOBAL.commonParams.musicToggle(this, audio, 0)
        } else {
          this.MusicIndex = 0
          this.GLOBAL.commonParams.musicToggle(this, audio, 2)
        }
      } else if (this.changeType == 1) {
        var isLoadAudio = audio.load()
        audio.play()
      } else {
        var random = Math.floor(Math.random() * this.toplist.length)
        random = (random == this.MusicIndex) ? (Math.floor(Math.random() * this.toplist.length)) : random
        this.MusicIndex = random
        this.GLOBAL.commonParams.musicToggle(this, audio, 2)
      }
    },
    changePlayType(event) {
      if (this.showimg == 0) {
        this.showimg = 1
        this.changeType = 1
      } else if (this.showimg == 1) {
        this.showimg = 2
        this.changeType = 2
      } else {
        this.showimg = 0
        this.changeType = 0
      }
    },
    bufferProgress() {
      // 以缓冲对象
      var timeRanges = this.$refs.audio.buffered
      if (timeRanges.length > 1) {
        // 以缓冲时间
        var timeBuffer = timeRanges.end(timeRanges.length - 1)
      }
      // 当前缓存百分比
      this.bufferPercent = (timeBuffer / this.$refs.audio.duration).toFixed(3) * 100 + '%'
    },
    setProgress(e) {
      var audio = this.$refs.audio
      // var TimeRanges = audio.seekable
      var setPercent = (e.clientX / document.body.clientWidth).toFixed(2)
      var setProgress = setPercent * (audio.duration.toFixed(2))
      if ('fastSeek' in audio) {
        audio.fastSeek(setProgress) // 改变audio.currentTime的值
      } else {
        audio.currentTime = setProgress
      }
      this.musicPercent = setPercent * 100 + '%'
    }
  },
  computed: {
    ...mapGetters(['get_artists', 'get_topList']),
    artistsList() {
      return this.get_artists
    },
    toplist() {
      return this.get_topList
    }
  }
}

</script>
<style lang="less" scoped>
.container {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  height: 100%;
  width: 100%;
}

#x-header {
  background: #000;
  width: 100%;
}

.red {
  color: red;
}

section {
  padding: 0 30px;
  position: fixed;
  overflow-y: scroll;
  color: #fff;
  font-size: 15px;
  text-align: center;
  z-index: 10;
  bottom: 120px;
  top: 90px;
  left: 0;
  right: 0;
  .lyricline {
    padding: 5px 0;
  }
}

.progress {
  position: fixed;
  z-index: 12;
  width: 100%;
  background: #fff;
  height: 5px;
  bottom: 80px;
}

#buffer {
  z-index: 14;
  background: rgba(150, 150, 150, 0.3);
  ;
}

#slide {
  z-index: 16;
  background: #0F0;
}

footer {
  position: fixed;
  width: 100%;
  left: 0;
  z-index: 11;
  bottom: 0;
  background: #000;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    flex: 4;
    text-align: center;
    img {
      height: 40px;
      width: 40px;
    }
    .play {
      margin: 0 25px;
    }
  }
  div {
    flex: 1;
    align-self: center;
    text-align: center;
    img {
      width: 30px;
    }
    .hideImg {
      display: none;
    }
  }
  audio {
    background: #000;
  }
}

.shadow {
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 18;
  background: rgba(0, 0, 0, 0.1);
}

.list {
  position: fixed;
  height: 300px;
  bottom: 0;
  z-index: 19;
  background: #7b4c37;
  width: 100%;
  overflow-y: scroll;
  color: #2d0e01;
  font-size: 14px;
  animation: listMove 1s;
  -moz-animation: listMove 1s;
  /* Firefox */
  -webkit-animation: listMove 1s;
  /* Safari and Chrome */
  -o-animation: listMove 1s;
  /* Opera */
  p {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #fbd6c6;
    padding: 0 20px;
  }
}

@keyframes listMove {
  0% {
    height: 0;
  }
  100% {
    height: 300px;
  }
}

</style>
