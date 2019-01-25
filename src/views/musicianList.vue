<template>
  <div>
    <x-header id="x-header">{{topnm}}</x-header>
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
import { XHeader } from 'vux'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    XHeader
  },
  data () {
    return {
      hotSongs: [],
      coverImgUrl: '',
      listNm: '',
      listDescription: '',
      musicid: '',
      musicurl: '',
      musicimg: ''
    }
  },
  created () {
    this.http.$get({
      url: this.$store.state.serveSrc + '/artists',
      data: { id: this.$route.query.id }
    }).then(res => {
      this.coverImgUrl = res.artist.img1v1Url
      this.listNm = res.artist.name
      this.listDescription = res.artist.briefDesc
      this.hotSongs = res.hotSongs
      this.commit_topList(res.hotSongs)
    })
  },
  methods: {
    ...mapActions(['commit_artists', 'commit_topList']),
    playMusic (index, ids, img, name, artists) {
      this.musicId = ids
      this.musicimg = img
      this.http.$get({
        url: this.$store.state.serveSrc + '/music/url',
        data: { id: this.musicId }
      }).then(res => {
        this.commit_artists(artists)
        this.$router.push({
          name: 'play',
          query: {
            ids: ids,
            url: encodeURIComponent(res.data[0].url),
            name: name,
            listId: this.$route.query.id,
            MusicIndex: index
          }
        })
      })
    }
  },
  computed: {
    ...mapGetters(['get_topNm']),
    topnm () {
      return this.get_topNm
    }
  }
}

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
