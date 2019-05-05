<template>
  <div id="artistPage">
    <pageHead></pageHead>
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
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  components: {
  },
  data () {
    return {
      hotSongs: [],
      coverImgUrl: require('@/assets/icon/alt.png'),
      listNm: '',
      listDescription: '',
      musicid: '',
      musicurl: '',
      musicimg: ''
    }
  },
  created () {
    this.$http.$get({
      url: '/artists',
      data: { id: this.$route.query.id }
    }).then(res => {
      if (res) {
        this.coverImgUrl = res.artist.img1v1Url
        this.listNm = res.artist.name
        this.listDescription = res.artist.briefDesc
        this.hotSongs = res.hotSongs
        this.commit_topList(res.hotSongs)
      } else {
        this.$message.error('获取歌单失败')
      }
    })
  }, 
  methods: {
    ...mapActions(['commit_topList', 'commit_playObj']),
    playMusic (index, ids, img, name, artists) {
      this.musicId = ids
      this.musicimg = img
      this.$http.$get({
        url: '/music/url',
        data: { id: this.musicId }
      }).then(res => {
        if (res) {
          let obj = {
            ids: ids,
            url: encodeURIComponent(res.data[0].url),
            name: name,
            listId: this.$route.query.id,
            MusicIndex: index,
            artists: artists
          }
          this.commit_playObj(obj)
          this.$router.push({
            name: 'play'
          })
        } else {
          this.$message.error('获取播放链接失败')
        }
      })
    }
  },
  computed: {
  }
}

</script>
<style lang="less">
#artistPage{
  width: 100%;
  overflow: hidden;
  .recommendList {
    padding-top: 1rem;
    header {
      padding: .3rem .2rem;
      background: #001529;
      color: #fff;
      .header-top {
        display: flex;
        align-items: top;
        .coverImg {
          height: 2rem;
          width: 2rem;
          flex: 0.8;
        }
        .listIntro {
          flex: 2;
          margin-left: .15rem;
          .listNm {
            font-size: .35rem;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            font-weight: bold;
          }
        }
      }
      .listDescription {
        margin-top: .2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        font-size: .25rem;
      }
    }
    .albumList {
      display: flex;
      padding: .2rem;
      box-shadow: 0 .02rem .02rem #ddd;
      span {
        flex: 1;
      }
      p {
        flex: 8;
        padding-left: .15rem;
        .musicNm {
          font-size: .3rem;
          font-weight: bolder;
        }
      }
    }
  }
}

</style>
