<template>
  <div>
    <header>
      <tab>
        <tab-item selected @click.native="introList">推荐</tab-item>
        <tab-item @click.native="topList">排行榜</tab-item>
        <tab-item @click.native="getMusicianList">歌手</tab-item>
      </tab>
    </header>
    <section v-show="isIntro==1" class="recommendSection">
      <div v-for="item in recommengList" class="recommendList" @click="jumpRecommendAlbum(item.id)">
        <img :src="item.picUrl" class="recommengPic">
        <div>
          <p>{{item.copywriter}}</p>
          {{item.name}}
        </div>
      </div>
    </section>
    <section v-show="isIntro==2">
      <div class="official">
        <p class="topNm" style="margin-top:10px;">官方榜</p>
        <div class="topClass" @click="jumpTopList(0,'新歌榜')">
          <div><img src="/static/images/0newMusicList.jpg"></div>
          <article>
            <p v-for="(item,index) in newList">{{index+1}}、{{item.name}}-<span v-for="arNm in item.ar.slice(0,1)" v-if="arNm.name">{{arNm.name}}</span></p>
          </article>
        </div>
        <div class="topClass" @click="jumpTopList(1,'热歌榜')">
          <div><img src="/static/images/1hotMusicList.jpg"></div>
          <article>
            <p v-for="(item,index) in hotList">{{index+1}}、{{item.name}}-<span v-for="arNm in item.ar.slice(0,1)" v-if="arNm.name">{{arNm.name}}</span></p>
          </article>
        </div>
        <div class="topClass" @click="jumpTopList(2,'原创榜')">
          <div><img src="/static/images/2createMusicList.jpg"></div>
          <article>
            <p v-for="(item,index) in createList">{{index+1}}、{{item.name}}-<span v-for="arNm in item.ar.slice(0,1)" v-if="arNm.name">{{arNm.name}}</span></p>
          </article>
        </div>
        <div class="topClass" @click="jumpTopList(3,'飙升榜')">
          <div><img src="/static/images/3upMusicList.jpg"></div>
          <article>
            <p v-for="(item,index) in upList">{{index+1}}、{{item.name}}-<span v-for="arNm in item.ar.slice(0,1)" v-if="arNm.name">{{arNm.name}}</span></p>
          </article>
        </div>
      </div>
      <div class="earth">
        <p class="topNm">全球榜</p>
        <div class="earthList">
          <p class="leftNm mNcom" @click="jumpTopList(23,'嘻哈榜')"><img src="/static/images/hiphap.jpg"></p>
          <p class="middleNm mNcom" @click="jumpTopList(8,'电音榜')"><img src="/static/images/electric.jpg"></p>
          <p class="rightNm mNcom" @click="jumpTopList(22,'ACG音乐榜')"><img src="/static/images/ACG.jpg"></p>
        </div>
        <div class="earthList">
          <p class="leftNm mNcom" @click="jumpTopList(4,'云音乐新电力榜')"><img src="/static/images/4electricMusicList.jpg"></p>
          <p class="middleNm mNcom" @click="jumpTopList(17,'金典音乐榜')"><img src="/static/images/classical.jpg"></p>
          <p class="rightNm mNcom" @click="jumpTopList(21,'电竞音乐榜')"><img src="/static/images/game.jpg"></p>
        </div>
        <div class="earthList">
          <p class="leftNm mNcom" @click="jumpTopList(7,'KTV唛榜')"><img src="/static/images/7KTVMusicList.jpg"></p>
          <p class="middleNm mNcom"></p>
          <p class="rightNm mNcom"></p>
        </div>
      </div>
    </section>
    <section v-show="isIntro==3">
      <div v-for="(item,index) in musicianList" class="musicianList" @click="jumpMusicianList(item.id,item.name)">
        <span style="width:30px;text-align:center;">{{index+1+'、'}}</span>
        <p class="imgBox"><img :src="item.img1v1Url"></p>
        <div>
          {{item.name}}
        </div>
        <img src="/static/icon/right.png" class="right">
      </div>
    </section>
  </div>
</template>
<script>
import { Tab, TabItem, Flexbox, FlexboxItem } from 'vux'
import { mapMutations } from 'vuex'
export default {
  components: {
    Tab,
    TabItem,
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      recommengList: [],
      isIntro: 1,
      newList: [],
      hotList: [],
      createList: [],
      upList: [],
      musicianList: []
    }
  },
  created () {
    // 获取推荐歌单
    this.http.$get({
      url: this.$store.state.serveSrc + '/personalized',
      data: {}
    }).then(res => {
      this.recommengList = res.result
    })
  },
  methods: {
    ...mapMutations(['update_topNm']),
    jumpRecommendAlbum (id) {
      this.$router.push({
        name: 'recommendAlbum',
        params: {
          albumId: id
        }
      })
    },
    topList () {
      this.isIntro = 2
      if (!this.newList[0]) {
        this.http.$get({
          url: this.$store.state.serveSrc + '/top/list',
          data: { idx: 0, type: 2 }
        }).then(res1 => {
          this.newList = res1
        }).catch(err => {
          alert(0 + err)
        })
        this.http.$get({
          url: this.$store.state.serveSrc + '/top/list',
          data: { idx: 1, type: 2 }
        }).then(res1 => {
          this.hotList = res1
        }).catch(err => {
          alert(0 + err)
        })
        this.http.$get({
          url: this.$store.state.serveSrc + '/top/list',
          data: { idx: 2, type: 2 }
        }).then(res1 => {
          this.createList = res1
        }).catch(err => {
          alert(0 + err)
        })
        this.http.$get({
          url: this.$store.state.serveSrc + '/top/list',
          data: { idx: 3, type: 2 }
        }).then(res1 => {
          this.upList = res1
        }).catch(err => {
          alert(0 + err)
        })
      }
    },
    getMusicianList () {
      this.isIntro = 3
      this.http.$get({
        url: this.$store.state.serveSrc + '/toplist/artist',
        data: {}
      }).then(res => {
        this.musicianList = res.list.artists
      })
    },
    introList () {
      this.isIntro = 1
    },
    jumpTopList (idx, topNm) {
      this.update_topNm(topNm)
      this.$router.push({
        name: 'topList',
        query: {
          idx: idx
        }
      })
    },
    jumpMusicianList (id, topNm) {
      this.update_topNm(topNm)
      this.$router.push({
        name: 'musicianList',
        query: {
          id: id
        }
      })
    }
  },
  computed: {}
}

</script>
<style lang="less" scoped>
header {
  position: fixed;
  width: 100%
}

section {
  padding-top: 44px;
  background: rgba(0, 0, 0, 0.1);
  .recommendList,
  .musicianList {
    display: flex;
    align-items: center;
    margin-top: 10px;
    padding: 0 5px;
    background: #fff;
    .recommengPic {
      height: 80px;
      width: 80px;
      flex: 1;
    }
    .imgBox {
      height: 40px;
      width: 40px;
      flex: 0.5;
    }
    div {
      flex: 3;
      padding-left: 5px;
    }
  }
  .musicianList {
    font-size: 15px;
    font-weight: bolder;
    img {
      width: 40px;
      height: 40px;
    }
    .right {
      width: 20px;
      height: 20px;
    }
  }
  .topNm {
    font-size: 14px;
    text-align: center;
    height: 40px;
    line-height: 40px;
    font-weight: bold
  }
  .topClass {
    margin-bottom: 10px;
    background: #fff;
    display: flex;
    div {
      flex: 1;
      font-size: 0;
    }
    img {
      width: 96%;
    }
    article {
      flex: 2;
      align-self: center;
      p {
        display: -webkit-box;
        padding: 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
      p:nth-child(2) {
        padding: 15px 10px;
      }
    }
  }
  .earthList {
    background: #fff;
    display: flex;
    padding: 10px 0;
    .mNcom {
      flex: 1;
      font-size: 0;
    }
    .leftNm {
      text-align: left;
    }
    .middleNm {
      text-align: center;
    }
    .rightNm {
      text-align: right;
    }
    img {
      width: 95%;
    }
  }
}

</style>
