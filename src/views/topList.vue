<template>
  <div id="toplist">
    <pageHead></pageHead>
    <div class="toplist">
      <header>
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
        <div class="listDescription" :if="listDescription">{{listDescription}}</div>
      </header>
      <div v-for="(item,index) in topList" class="albumList" @click="playMusic(index,item.id,item.al.picUrl,item.name,item.ar)">
        <span class="topNo">{{index+1+'、'}}</span>
        <img :src="item.al.picUrl">
        <p>
          <span class="musicNm">{{item.name}}</span>
          <br>
          <span class="musician">
          歌手：
            <template v-for="(siginal,index) in item.ar">{{siginal.name}}{{item.ar.length==(1+index)?'':'、'}}</template>
          </span>
        </p>
      </div>
    </div>
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
      topList: [],
      coverImgUrl: require('@/assets/icon/alt.png'),
      creator: {},
      listNm: '',
      listDescription: '',
      colors: ['#F50', '#2db7f5', '#87d068', '#108ee9'],
      listTags: [],
      musicid: '',
      musicurl: '',
      musicimg: ''
    }
  },
  created () {
    this.$http.$get({
      url: '/top/list',
      data: { idx: this.$route.query.idx }
    }).then(res => {
      if (res) {
        this.coverImgUrl = res.coverImgUrl
        this.creator = res.creator
        this.listNm = res.name
        this.listTags = res.tags
        this.listDescription = res.description
        this.topList = res.tracks
        this.commit_topList(this.topList)
      } else {
        this.$message.error('获取排行榜失败')
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
  computed: {
  }
}

</script>
<style lang="less" scoped>
#toplist{
  width: 100%;
  overflow: hidden;
  .toplist {
    margin-top: 1rem;
    header {
      padding: .2rem;
      background: #001529;
      height: fit-content;
      color: #fff;
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
            white-space: nowrap;
          }
          .nickname {
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
    .albumList {
      display: flex;
      padding: .2rem;
      box-shadow: 0 .01rem .01rem #ddd;
      img {
        flex: 1;
        height: 1rem;
        width: 1rem;
      }
      .topNo{
        width:.6rem;
        text-align:center;
        display:inline-block;
      }
      p {
        flex: 8;
        padding-left: .2rem;
        margin: 0;
        .musicNm {
          font-size: .4rem;
          font-weight: bolder;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          white-space: nowrap;
          display: inline-block;
          width: 60%;
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
}

</style>
