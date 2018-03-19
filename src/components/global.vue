<script type="text/javascript">
const commonParams = {
  serveSrc: "http://zhaoyn2.ngrok.xiaomiqiu.cn",
  getLyric: function(that) {
    $.ajax({
      url: this.serveSrc + '/lyric',
      type: 'get',
      dataType: 'json',
      data: { id: that.ids },
      success: function(data) {
        if (data.lrc.lyric) {
          that.lyric = data.lrc.lyric.split("\n");
          for (let i = 0; i < that.lyric.length; i++) {
            that.lyric[i] = that.lyric[i].replace(/\[|\]/g, '')
          }
        }
      },
      error: function(err) {}
    });
  },
  musicToggle: function(that, audio, type) {
    if (type == 1) {
      that.MusicIndex = that.MusicIndex - 1;
    } else if (type == 0) {
      that.MusicIndex = that.MusicIndex + 1;
    }
    that.ids = that.toplist[that.MusicIndex].id;
    that.playStatus = true;
    that.musicNm = that.toplist[that.MusicIndex].name;
    that.musician = that.toplist[that.MusicIndex].artists ? that.toplist[that.MusicIndex].artists : that.toplist[that.MusicIndex].ar;
    $.ajax({
      url: this.serveSrc + '/music/url',
      type: 'get',
      dataType: 'json',
      async: false,
      data: { id: that.ids },
      success: function(data) {
        that.url = data.data[0].url;
        that.playStatus = false;
        setTimeout(function() {
          audio.play();
        }, 500);
        that.lyric = that.GLOBAL.commonParams.getLyric(that);
      },
      error: function(err) {}
    });
  }

};
export default {
  commonParams
}

</script>
