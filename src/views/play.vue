<template>
  <div class="container">
    <x-header id="x-header">
      {{musicNm}}&nbsp;
      <template v-for="(siginal,index) in musician" v-if="musician">{{siginal.name}}{{musician.length==(1+index)?'':'、'}}</template>
    </x-header>
    <section>
      <p v-for="item in lyric" :data-timeline="item.match(/\d{2}:\d{2}.\d{2}/g)" class="lyricline">{{item.replace(/\d{2}:\d{2}.\d{2,}/g,'')}}</p>
    </section>
    <p class="progress" id="slide" v-bind:style="{width:musicPercent}" @click="setProgress($event)"></p>
    <p class="progress" id="buffer" v-bind:style="{width:bufferPercent}" @click="setProgress($event)"></p>
    <p class="progress" @click="setProgress($event)"></p>
    <footer>
      <div class="playType">
        <img src="/static/icon/loopPlay.png" class="hideImg" style="display:inline-block" data-type="0" @click="changePlayType($event)">
        <img src="/static/icon/singlePlay.png" class="hideImg" data-type="1" @click="changePlayType($event)">
        <img src="/static/icon/randomPlay.png" class="hideImg" data-type="2" @click="changePlayType($event)">
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
    <audio :src="url" @timeupdate="lyricStep" @onended="autoChange" @progress="bufferProgress"></audio>
  </div>
</template>
<script>
import { XHeader } from 'vux';
export default {
  props: {
    musicurl: {
      type: String,
      default: ''
    },
    musicimg: {
      type: String,
      default: ''
    },
    musicid: {
      type: String,
      default: ''
    },

  },
  components: {
    XHeader
  },
  data() {
    return {
      musicNm: this.$route.params.name, //歌曲名
      musician: this.$route.params.artists, //歌手数组
      url: this.$route.params.url, //歌曲url
      playStatus: true, //播放暂停切换
      lyric: [], //歌词
      toplist: this.$route.params.topList, //歌单列表
      MusicIndex: this.$route.params.MusicIndex, //歌曲序号
      ids: this.$route.params.ids, //歌曲id
      listStatus: false, //控制歌单列表显隐
      changeType: 0, //切换方式:0 循环 ，1 单曲，2 随机
      bufferPercent: '0%', //缓存进度
      musicPercent:"0%"  //播放进度
    };
  },
  mounted() {
    var that = this;
    that.lyric = that.GLOBAL.commonParams.getLyric(that);

  },
  methods: {
    playAndPause() {
      var audio = $("audio").get(0);
      if (audio.paused) {
        this.playStatus = false;
        audio.play();
      } else {
        this.playStatus = true;
        audio.pause();
      }
    },
    lyricStep(e) {
      var currentTime = e.target.currentTime.toFixed(2);
      var duration=e.target.duration.toFixed(2);
      this.musicPercent=((currentTime/duration)*100).toFixed(3)+"%";
      if (this.lyric) {
        var str = ".lyricline";
        $(str).each(function(index) {
          var lyricTime = $(this).attr("data-timeline");
          if (lyricTime) {
            lyricTime = lyricTime.split(":");
            lyricTime = parseInt(lyricTime[0]) * 60 + parseFloat(lyricTime[1]);
            console.log("222")
            if (currentTime >= lyricTime) {
              $(".lyricline").removeClass('red');
              $(this).addClass('red');
              $("section").get(0).scrollTop = $(this).get(0).offsetTop - 200;
              return;
            }
          }
        })
      }
    },
    nexPlay() {
      $(".lyricline").removeClass('red');
      var that = this;
      that.playStatus = false;
      var audio = $("audio").get(0);
      if (that.changeType == 0) {
        if (that.MusicIndex != (that.toplist.length - 1)) {
          that.GLOBAL.commonParams.musicToggle(that, audio, 0);
        } else {
          that.MusicIndex = 0;
          that.GLOBAL.commonParams.musicToggle(that, audio, 2);
        }
      } else if (that.changeType == 1) {
        audio.load();
        audio.play();
      } else {
        var random = Math.floor(Math.random() * that.toplist.length);
        random = (random == that.MusicIndex) ? (Math.floor(Math.random() * that.toplist.length)) : random;
        that.MusicIndex = random;
        that.GLOBAL.commonParams.musicToggle(that, audio, 2);
      }
    },
    prevPlay() {
      $(".lyricline").removeClass('red');
      var that = this;
      that.playStatus = false;
      var audio = $("audio").get(0);
      if (that.changeType == 0) {
        if (that.MusicIndex != 0) {
          that.GLOBAL.commonParams.musicToggle(that, audio, 1);
        } else {
          that.MusicIndex = that.toplist.length - 1;
          that.GLOBAL.commonParams.musicToggle(that, audio, 2);
        }
      } else if (that.changeType == 1) {
        audio.load();
        audio.play();
      } else {
        var random = Math.floor(Math.random() * that.toplist.length);
        random = (random == that.MusicIndex) ? (Math.floor(Math.random() * that.toplist.length)) : random;
        that.MusicIndex = random;
        that.GLOBAL.commonParams.musicToggle(that, audio, 2);
      }
    },
    showList() {
      if (this.listStatus) {
        this.listStatus = false;
      } else {
        this.listStatus = true;
      }
    },
    shadowHide() {
      this.listStatus = false;
    },
    playList(index) {
      $(".lyricline").removeClass('red');
      var that = this;
      var audio = $("audio").get(0);
      that.MusicIndex = index;
      this.listStatus = false;
      that.GLOBAL.commonParams.musicToggle(that, audio, 2);
    },
    autoChange() {
      $(".lyricline").removeClass('red');
      var that = this;
      that.playStatus = false;
      var audio = $("audio").get(0);
      if (that.changeType == 0) {
        if (that.MusicIndex != (that.toplist.length - 1)) {
          that.GLOBAL.commonParams.musicToggle(that, audio, 0);
        } else {
          that.MusicIndex = 0;
          that.GLOBAL.commonParams.musicToggle(that, audio, 2);
        }
      } else if (that.changeType == 1) {
        audio.load();
        audio.play();
      } else {
        var random = Math.floor(Math.random() * that.toplist.length);
        random = (random == that.MusicIndex) ? (Math.floor(Math.random() * that.toplist.length)) : random;
        that.MusicIndex = random;
        that.GLOBAL.commonParams.musicToggle(that, audio, 2);
      }
    },
    changePlayType(event) {
      var that = this;
      $(".playType img").hide();
      if (that.changeType == 0) {
        $(".playType img").each(function() {
          if ($(this).attr("data-type") == 1) {
            $(this).show();
            that.changeType = 1;
          }
        })
      } else if (that.changeType == 1) {
        $(".playType img").each(function() {
          if ($(this).attr("data-type") == 2) {
            $(this).show();
            alert("循环")
            that.changeType = 2;
          }
        })
      } else {
        $(".playType img").each(function() {
          if ($(this).attr("data-type") == 0) {
            $(this).show();
            that.changeType = 0;
          }
        })
      }
    },
    bufferProgress() {
      var that=this;
      //以缓冲对象
      var timeRanges = $("audio").get(0).buffered;
      if(timeRanges){
          //以缓冲时间
          var timeBuffer = timeRanges.end(timeRanges.length - 1);
      }
      //当前缓存百分比
      that.bufferPercent = (timeBuffer / $("audio").get(0).duration).toFixed(3) * 100 + "%";
    },
    setProgress(e){
        var audio=$("audio").get(0);
        var TimeRanges =audio.seekable;
        var setPercent=(e.clientX/document.body.clientWidth).toFixed(2);
        var setProgress=setPercent*(audio.duration.toFixed(2));
        if('fastSeek' in audio){
            audio.fastSeek(setProgress);//改变audio.currentTime的值
        }else{
            audio.currentTime=setProgress;
        }
        this.musicPercent=setPercent*100+"%";
    }
  },
  created() {},
  computed: {}
};

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
  background: rgba(150,150,150,0.3);;
}

#slide {
  z-index: 16;
  background:#0F0;
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
