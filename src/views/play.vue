<template>
  <div id="playerPage">
    <pageHead></pageHead>
    <section ref="section">
      <template v-if="lyric && lyric.length>0">
        <p v-for="(item,index) in lyric" :data-timeline="item.match(/\d{2}:\d{2}.\d{2}/g)" :class="['lyricline',{'red':lyricIndex == index}]">{{item.replace(/\d{2}:\d{2}.\d{2,}/g,'')}}</p>
      </template>
      <template v-else>
        <p class="empty">暂未获取到歌词</p>
      </template>
    </section>
    <p class="progress" id="slide" v-bind:style="{width:musicPercent}" @click="setProgress($event)"></p>
    <p class="progress" id="buffer" v-bind:style="{width:bufferPercent}" @click="setProgress($event)"></p>
    <p class="progress" @click="setProgress($event)"></p>
    <footer>
      <div class="playType">
        <img v-show="showimg==0" src="@/assets/icon/loopPlay.png" style="display:inline-block" data-type="0" @click="changePlayType($event)">
        <img v-show="showimg==1" src="@/assets/icon/singlePlay.png" data-type="1" @click="changePlayType($event)">
        <img v-show="showimg==2" src="@/assets/icon/randomPlay.png" data-type="2" @click="changePlayType($event)">
      </div>
      <p>
        <img src="@/assets/icon/prev.png" id="prev" @click="prevPlay">
        <img v-show="playStatus" src="@/assets/icon/play.png" class="play" @click="playAndPause">
        <img v-show="(!playStatus)" src="@/assets/icon/pause.png" class="play" @click="playAndPause">
        <img src="@/assets/icon/next.png" id="next" @click="nexPlay">
      </p>
      <div>
        <img src="@/assets/icon/list.png" @click="showList">
      </div>
    </footer>
    <Drawer :title="`播放列表（${toplist&&toplist.length}）`" width="100%" :visible="listStatus" placement="bottom" height="300px" @close="shadowHide" :closable="false">
      <div class="drawContainer">
        <template v-if="toplist.length>0">
          <p v-for="(item,index) in toplist" @click="playList(index)" class="toplistItem">
            <span>{{item.name}}</span>
            <img src="@/assets/icon/listPlay.png">
          </p>
        </template>
        <template v-else>
          <p class="empty">没有正在播放歌单</p>
        </template>
      </div>
    </Drawer>
    <audio :src="url" @timeupdate="lyricStep" @ended="autoChange" @progress="bufferProgress" ref="audio"></audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { Drawer } from 'ant-design-vue'
import publicVar from '@/mixin/global'
export default {
  components: {
    Drawer
  },
  data() {
    return {
      url: decodeURIComponent(this.$store.state.playObj.url), // 歌曲url
      playStatus: true, // 播放暂停切换
      lyric: [], // 歌词
      lyricIndex: 0,
      MusicIndex: this.$store.state.playObj.MusicIndex, // 歌曲序号
      ids: this.$store.state.playObj.ids, // 歌曲id
      listStatus: false, // 控制歌单列表显隐
      changeType: 0, // 切换方式:0 循环 ，1 单曲，2 随机
      bufferPercent: '0%', // 缓存进度
      musicPercent: '0%', // 播放进度
      showimg: 0 // 控制展示图片
    }
  },
  created() {
    this.lyric = publicVar.commonParams.getLyric(this)
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['update_topNm']),
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
          publicVar.commonParams.musicToggle(this, audio, 0)
        } else {
          this.MusicIndex = 0
          publicVar.commonParams.musicToggle(this, audio, 2)
        }
      } else if (this.changeType == 1) {
        var isLoadAudio = audio.load()
        if (isLoadAudio !== undefined) {
          isLoadAudio.then(() => {
            audio.play()
          }).catch(() => {
            this.$message.error('未知播放源')
          })
        }
      } else {
        var random = Math.floor(Math.random() * this.toplist.length)
        random = (random == this.MusicIndex) ? (Math.floor(Math.random() * this.toplist.length)) : random
        this.MusicIndex = random
        publicVar.commonParams.musicToggle(this, audio, 2);
      }
    },
    prevPlay() {
      this.lyricIndex = 0
      var audio = this.$refs.audio
      if (this.changeType == 0) {
        if (this.MusicIndex != 0) {
          publicVar.commonParams.musicToggle(this, audio, 1)
        } else {
          this.MusicIndex = this.toplist.length - 1
          publicVar.commonParams.musicToggle(this, audio, 2)
        }
      } else if (this.changeType == 1) {
        var isLoadAudio = audio.load()
        if (isLoadAudio !== undefined) {
          isLoadAudio.then(() => {
            audio.play()
          }).catch(() => {
            this.$message.error('未知播放源')
          })
        }
      } else {
        var random = Math.floor(Math.random() * this.toplist.length);
        random = (random == this.MusicIndex) ? (Math.floor(Math.random() * this.toplist.length)) : random
        this.MusicIndex = random
        publicVar.commonParams.musicToggle(this, audio, 2)
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
      publicVar.commonParams.musicToggle(this, audio, 2)
    },
    autoChange() {
      this.lyricIndex = 0
      var audio = this.$refs.audio
      this.playStatus = false
      if (this.changeType == 0) {
        if (this.MusicIndex != (this.toplist.length - 1)) {
          publicVar.commonParams.musicToggle(this, audio, 0)
        } else {
          this.MusicIndex = 0
          publicVar.commonParams.musicToggle(this, audio, 2)
        }
      } else if (this.changeType == 1) {
        var isLoadAudio = audio.load()
        audio.play()
      } else {
        var random = Math.floor(Math.random() * this.toplist.length)
        random = (random == this.MusicIndex) ? (Math.floor(Math.random() * this.toplist.length)) : random
        this.MusicIndex = random
        publicVar.commonParams.musicToggle(this, audio, 2)
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
    ...mapGetters(['get_topList']),
    toplist() {
      return this.get_topList
    }
  }
}

</script>
<style lang="less">
.ant-drawer-header {
  background: #f52 !important;
  border-bottom: none !important;
  border-radius: unset !important;
}
.ant-drawer-title {
  color: #fff !important;
  text-align: center;
  font-size: .4rem !important;
}
.ant-drawer-content {
  background: #fff !important;
  .drawContainer{
    overflow-y: scroll;
    height: 250px;
    .toplistItem {
      margin: 0;
      padding: .2rem .6rem;
      border-bottom:1px solid #EBEDF0;
      position: relative;
      span{
        display: inline-block;
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
      img{
        display: inline-block;
        width: 0.5rem;
        height: 0.5rem;
        position: absolute;
        top: 0.2rem;
        right: .5rem;
      }
    }
    .empty{
      margin: 0;
      padding: .5rem .6rem;
      text-align: center;
      color: #D0D0D0;
    }
  }
}
.ant-drawer-body{
  padding: 0 !important;
}
#playerPage {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  height: 100%;
  width: 100%;
  .red {
    color: red;
  }

  section {
    padding: 0 .3rem;
    position: fixed;
    overflow-y: scroll;
    color: #fff;
    font-size: .15rem;
    text-align: center;
    z-index: 10;
    bottom: 2.4rem;
    top: 1.8rem;
    left: 0;
    right: 0;
    .lyricline {
      padding: 0.1rem 0;
    }
    .empty{
      margin: 0;
      margin-top: 3rem;
      text-align: center;
      color: #D0D0D0;
      font-size: .3rem;
    }
  }

  .progress {
    position: fixed;
    z-index: 12;
    width: 100%;
    background: #fff;
    height: 0.1rem;
    bottom: 1.6rem;
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
    height: 1.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    p {
      flex: 4;
      text-align: center;
      margin: 0;
      img {
        height: 0.8rem;
        width: 0.8rem;
      }
      .play {
        margin: 0 0.5rem;
      }
    }
    div {
      flex: 1;
      align-self: center;
      text-align: center;
      img {
        width: 0.6rem;
      }
      .hideImg {
        display: none;
      }
    }
    audio {
      background: #000;
    }
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
