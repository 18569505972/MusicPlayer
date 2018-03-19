<template>
  <div>
    <x-header id="x-header">{{topNm}}</x-header>
    <div class="recommendList">
      <header>
        <div class="header-top">
          <img :src="coverImgUrl" class="coverImg">
          <div class="listIntro">
            <p class="listNm">{{listNm}}</p>
            <div class="listDescription" :if="listDescription">{{listDescription}}</div>
          </div>
        </div>
      </header>
      <div v-for="(item,index) in hotSongs" class="albumList" @click="playMusic(index,item.id,item.al.picUrl,item.name,item.ar)">
        <span style="width:30px;text-align:center;">{{index+1+'、'}}</span>
        <p>
          <span class="musicNm">{{item.name}}</span>
        </p>
      </div>
    </div>
    <!--<playMusic :musicurl="musicurl" :musicid="musicid" :musicimg="musicimg"></playMusic>-->
  </div>
</template>
<script>
import { XHeader } from 'vux';
export default {
  props: {
    title: { // 标题
      type: String,
      default: '标题'
    }
  },
  components: {
    XHeader,
  },
  data() {
    return {
      hotSongs: [],
      coverImgUrl: "",
      listNm: "",
      listDescription: "",
      musicid: "",
      musicurl: "",
      musicimg: "",
      topNm:this.$route.params.name
    };
  },
  mounted() {
    var that = this;
    $.ajax({
      url: that.GLOBAL.commonParams.serveSrc+'/artists',
      type: 'get',
      dataType: 'json',
      data: { id: that.$route.params.id },
      success: function(data) {
        that.coverImgUrl = data.artist.img1v1Url;
        that.listNm = data.artist.name;
        that.listDescription = data.artist.briefDesc;
        that.hotSongs=data.hotSongs;
      },
      error: function(err) {}
    });
  },
  methods: {
    playMusic(index,ids, img ,name ,artists) {
      var that = this;
      that.musicId = ids;
      that.musicimg = img;
      $.ajax({
          url: that.GLOBAL.commonParams.serveSrc+'/music/url',
          type: 'get',
          dataType: 'json',
          data: {id:that.musicId},
          success: function(data) {
              that.$router.push({
                name: 'play',
                params: {
                  ids: ids,
                  url: data.data[0].url,
                  artists:artists,
                  name:name,
                  topList:that.hotSongs,
                  listId:that.$route.params.id,
                  MusicIndex:index
                }
              });
          },
          error: function(err) {
          }
      });
    }
  },
  created() {},
  computed: {}
};

</script>
<style lang="less" scoped>
#x-header {
  background: #000;
  position: fixed;
  width: 100%;
}

.recommendList {
  padding-top: 46px;
  header {
    padding: 10px;
    background: rgba(100, 100, 100, 0.2);
    .header-top {
      display: flex;
      align-items: top;
      .coverImg {
        height: 100px;
        width: 100px;
        flex: 1;
      }
      .listIntro {
        flex: 2;
        margin-left: 15px;
        .listNm {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
    .listDescription {
      margin-top: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }
  }
  .albumList {
    display: flex;
    padding: 10px;
    box-shadow: 0 1px 1px #ddd;
    span {
      flex: 1;
    }
    p {
      flex: 8;
      padding-left: 15px;
      .musicNm {
        font-size: 13px;
        font-weight: bolder;
      }
    }
  }
}

</style>
