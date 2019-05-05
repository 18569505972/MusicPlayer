<template>
  <div class="recommendList">
    <pageHead></pageHead>
    <header class="recommend-head">
      <div class="header-top">
        <img :src="coverImgUrl" class="coverImg">
        <div class="listIntro">
          <p class="listNm">{{listNm}}</p>
          <Tag color="blue" class="nickName">
            {{creator.nickname}}
          </Tag>
          <p>
            <template v-for="(item,index) in listTags" v-if="index<4">
              <Tag :color="colors[index]">{{item}}</Tag>
            </template> 
          </p>
        </div>
      </div>
      <div class="listDescription">{{listDescription}}</div>
    </header>
    <section>
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
    </section>
  </div>
</template>
<script>
import { Tag } from 'ant-design-vue'
import { mapActions } from 'vuex'
export default {
  components: {
    Tag
  },
  data () {
    return {
      albumList: [],
      coverImgUrl: require('@/assets/icon/alt.png'),
      creator: {},
      listNm: '',
      listDescription: '',
      listTags: [],
      colors: ['#F50', '#2db7f5', '#87d068', '#108ee9'],
      musicid: '',
      musicurl: '',
      musicimg: ''
    }
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
            listId: this.$route.params.albumId,
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
  created () {
    this.$http.$get({
      url: '/playlist/detail?id=' + this.$route.params.albumId,
      data: {}
    }).then(res => {
      if (res) {
        this.coverImgUrl = res.result.coverImgUrl
        this.creator = res.result.creator
        this.listNm = res.result.name
        this.listTags = res.result.tags
        this.listDescription = res.result.description
        this.albumList = res.result.tracks
        this.commit_topList(this.albumList)
      } else {
        this.$message.error('获取歌单详情失败')
      }
    })
  },
  computed: {}
}

</script>
<style lang="less">
.recommendList {
  width: 100%;
  overflow: hidden;
  .recommend-head {
    margin-top: 1rem;
    padding: .2rem;
    background: #001529;
    height: fit-content;
    color: #fff;
    position: fixed;
    z-index: 2;
    .header-top {
      display: flex;
      align-items: top;
      .coverImg {
        height: 2rem;
        width: 2rem;
        flex: 1;
      }
      .listIntro {
        flex: 2;
        margin-left: .15rem;
        .listNm {
          margin: 0;
          font-size: .35rem;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .nickName {
          margin: .1rem 0;
        }
      }
    }
    .listDescription {
      margin-top: .2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size: .25rem;
    }
  }
  section{
    position: absolute;
    top: 4.3rem; 
  }
  .albumList {
    display: flex;
    padding: .2rem;
    box-shadow: 0 .01rem .01rem #ddd;
    img {
      height: 2rem;
      width: 2rem;
    }
    p {
      flex: 1;
      padding-left: .2rem;
      margin: 0;
      .musicNm {
        font-size: .4rem;
        font-weight: bolder;
      }
      .musician,
      .album {
        font-size: .3rem;
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
