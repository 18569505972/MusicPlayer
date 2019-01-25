<template>
  <div>
    <x-header id="x-header">歌单</x-header>
    <div class="recommendList">
      <header>
        <div class="header-top">
          <img :src="coverImgUrl" class="coverImg">
          <div class="listIntro">
            <p class="listNm">{{listNm}}</p>
            <p class="nickname">
              {{creator.nickname}}
              <img src="/static/icon/right.png">
            </p>
            <p>
              <span v-for="item in listTags">{{item}}#</span>
            </p>
          </div>
        </div>
        <div class="listDescription">{{listDescription}}</div>
      </header>
      <div v-for="(item,index) in albumList" class="albumList" @click="playMusic(index,item.id,item.artists.picUrl,item.name,item.artists)">
        <img :src="item.album.picUrl">
        <p>
          <span class="musicNm">{{item.name}}</span>
          <br>
          <span class="musician">歌手：
            <template v-for="(siginal,index) in item.artists" v-if="item.artists">{{siginal.name}}{{item.artists.length==(1+index)?'':'、'}}</template>
          </span>
          <br>
          <span class="album">专辑：{{item.album.name}}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { XHeader } from 'vux'
import { mapActions } from 'vuex'
export default {
  components: {
    XHeader
  },
  data () {
    return {
      albumList: [],
      coverImgUrl: '',
      creator: {},
      listNm: '',
      listDescription: '',
      listTags: [],
      musicid: '',
      musicurl: '',
      musicimg: ''
    }
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
            listId: this.$route.params.albumId,
            MusicIndex: index
          }
        })
      })
    }
  },
  created () {
    this.http.$get({
      url: this.$store.state.serveSrc + '/playlist/detail?id=' + this.$route.params.albumId,
      data: {}
    }).then(res => {
      this.coverImgUrl = res.result.coverImgUrl
      this.creator = res.result.creator
      this.listNm = res.result.name
      this.listTags = res.result.tags
      this.listDescription = res.result.description
      this.albumList = res.result.tracks
      this.commit_topList(this.albumList)
    })
  },
  computed: {}
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
        .nickname {
          border-radius: 10px;
          margin: 5px 0;
          padding: 1px 5px;
          display: inline-block;
          background: rgba(256, 256, 256, 0.8);
          background-repeat: no-reapeat;
          img {
            height: 10px;
          }
        }
      }
    }
    .listDescription {
      margin-top: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
  .albumList {
    display: flex;
    padding: 10px;
    box-shadow: 0 1px 1px #ddd;
    img {
      flex: 1;
      height: 35px;
      width: 35px;
    }
    p {
      flex: 8;
      padding-left: 10px;
      .musicNm {
        font-size: 13px;
        font-weight: bolder;
      }
      .musician,
      .album {
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
  }
}

</style>
