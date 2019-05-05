<template>
  <div id="indexPag">
    <header>
      <Row class="headerContainer" type="flex" justify="center" align="middle">
        <Col span="8" :class="['tabChoose',activeKey==1?'choosed':'']" @click="changeTab(1)">推荐</Col>
        <Col span="8" :class="['tabChoose',activeKey==2?'choosed':'']" @click="changeTab(2)">排行榜</Col>
        <Col span="8" :class="['tabChoose',activeKey==3?'choosed':'']" @click="changeTab(3)">歌手</Col>
      </Row>
    </header>
    <section v-show="activeKey==1" class="recommendSection">
      <div v-for="item in recommengList" class="recommendList" @click="jumpRecommendAlbum(item.id)">
        <img :src="item.picUrl" class="recommengPic">
        <div>
          <p>{{item.copywriter}}</p>
          {{item.name}}
        </div>
      </div>
    </section>
    <section v-show="activeKey==2" class="topSection">
      <div class="official">
        <p class="topNm">官方榜</p>
        <div class="topClass" @click="jumpTopList(0,'新歌榜')">
          <div><img src="@/assets/images/0newMusicList.jpg"></div>
          <article>
            <p v-for="(item,index) in newList">{{index+1}}、{{item.name}}-<span v-for="arNm in item.ar.slice(0,1)" v-if="arNm.name">{{arNm.name}}</span></p>
          </article>
        </div>
        <div class="topClass" @click="jumpTopList(1,'热歌榜')">
          <div><img src="@/assets/images/1hotMusicList.jpg"></div>
          <article>
            <p v-for="(item,index) in hotList">{{index+1}}、{{item.name}}-<span v-for="arNm in item.ar.slice(0,1)" v-if="arNm.name">{{arNm.name}}</span></p>
          </article>
        </div>
        <div class="topClass" @click="jumpTopList(2,'原创榜')">
          <div><img src="@/assets/images/2createMusicList.jpg"></div>
          <article>
            <p v-for="(item,index) in createList">{{index+1}}、{{item.name}}-<span v-for="arNm in item.ar.slice(0,1)" v-if="arNm.name">{{arNm.name}}</span></p>
          </article>
        </div>
        <div class="topClass" @click="jumpTopList(3,'飙升榜')">
          <div><img src="@/assets/images/3upMusicList.jpg"></div>
          <article>
            <p v-for="(item,index) in upList">{{index+1}}、{{item.name}}-<span v-for="arNm in item.ar.slice(0,1)" v-if="arNm.name">{{arNm.name}}</span></p>
          </article>
        </div>
      </div>
      <div class="earth">
        <p class="topNm">全球榜</p>
        <div class="earthList">
          <p class="leftNm mNcom" @click="jumpTopList(23,'嘻哈榜')"><img src="@/assets/images/hiphap.jpg"></p>
          <p class="middleNm mNcom" @click="jumpTopList(8,'电音榜')"><img src="@/assets/images/electric.jpg"></p>
          <p class="rightNm mNcom" @click="jumpTopList(22,'ACG音乐榜')"><img src="@/assets/images/ACG.jpg"></p>
        </div>
        <div class="earthList">
          <p class="leftNm mNcom" @click="jumpTopList(4,'云音乐新电力榜')"><img src="@/assets/images/4electricMusicList.jpg"></p>
          <p class="middleNm mNcom" @click="jumpTopList(17,'金典音乐榜')"><img src="@/assets/images/classical.jpg"></p>
          <p class="rightNm mNcom" @click="jumpTopList(21,'电竞音乐榜')"><img src="@/assets/images/game.jpg"></p>
        </div>
        <div class="earthList">
          <p class="leftNm mNcom" @click="jumpTopList(7,'KTV唛榜')"><img src="@/assets/images/7KTVMusicList.jpg"></p>
          <p class="middleNm mNcom"></p>
          <p class="rightNm mNcom"></p>
        </div>
      </div>
    </section>
    <section v-show="activeKey==3">
      <div v-for="(item,index) in musicianList" class="musicianList" @click="jumpMusicianList(item.id,item.name)">
        <span style="width:30px;text-align:center;">{{index+1+'、'}}</span>
        <p class="imgBox"><img :src="item.img1v1Url"></p>
        <div>
          {{item.name}}
        </div>
        <img src="../assets/icon/right.png" class="right">
      </div>
    </section>
  </div>
</template>
<script>
import { Col, Row } from 'ant-design-vue'
import { mapMutations } from 'vuex'
export default {
  components: {
    Col,
    Row
  },
  data () {
    return {
      recommengList: [],
      newList: [],
      hotList: [],
      createList: [],
      activeKey:1,
      upList: [],
      musicianList: []
    }
  },
  created () {
    // 获取推荐歌单
    this.$http.$get({
      url: '/personalized',
      data: {}
    }).then(res => {
      if (res) {
        this.recommengList = res.result
      } else {
        this.$message.error('获取推荐歌单失败')
      }
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
    changeTab(num){
     this.activeKey = num
     if(num == 2) {
        this.topList()
      } else if(num == 3) {
        this.getMusicianList()
      }
    },
    topList () {
      if (this.newList.length<=0) {
        this.$http.$get({
          url: '/top/list',
          data: { idx: 0, type: 2 }
        }).then(res => {
          if (res) {
            this.newList = res
          } else {
            this.$message.error('获取排行榜失败')
          }
        })
        this.$http.$get({
          url: '/top/list',
          data: { idx: 1, type: 2 }
        }).then(res => {
          if (res) {
            this.hotList = res
          } else {
            this.$message.error('获取排行榜失败')
          }
        })
        this.$http.$get({
          url: '/top/list',
          data: { idx: 2, type: 2 }
        }).then(res => {
          if (res) {
            this.createList = res
          } else {
            this.$message.error('获取排行榜失败')
          }
        })
        this.$http.$get({
          url: '/top/list',
          data: { idx: 3, type: 2 }
        }).then(res => {
          if (res) {
            this.upList = res
          } else {
            this.$message.error('获取排行榜失败')
          }
        })
      }
    },
    getMusicianList () {
      if(this.musicianList.length<=0){
        this.$http.$get({
          url: '/toplist/artist',
          data: {}
        }).then(res => {
          if (res) {
            this.musicianList = res.list.artists
          } else {
            this.$message.error('获取歌手榜失败')
          }
        })
      }
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
<style lang="less">
#indexPag{
  width: 100%;
  overflow: hidden;
  header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 1rem;
    .headerContainer{
      height: 1rem;
      background:#1989F0;
      color: rgba(255, 255, 255, 0.65);
    }
    .tabChoose{
      text-align: center;
      height: 1rem;
      line-height: 1rem;
    }
    .choosed{
      background: #00a0e9;
      color: #fff;
    }
  }

  section {
    padding-top: 1rem;
    background: #222222;
    .recommendList,
    .musicianList {
      display: flex;
      align-items: center;
      margin-top: .2rem;
      padding: 0 .1rem;
      background: #001529;
      color: #fff;
      .recommengPic {
        width: 2.5rem;
        flex: 1.5;
      }
      .imgBox {
        height: 1rem;
        width: 1rem;
        flex: 0.5;
        margin: 0;
      }
      div {
        flex: 3;
        padding-left: .05rem;
      }
    }
    .musicianList {
      font-size: .4rem;
      font-weight: bolder;
      img {
        width: 1rem;
        height: 1rem;
      }
      .right {
        width: .5rem;
        height: .5rem;
      }
    }
    .topNm {
      font-size: .5rem;
      text-align: center;
      height: 1.5rem;
      line-height: 1.5rem;
      font-weight: bold;
      color: #fff;
      margin: 0;
    }
    .topClass {
      margin-top: .2rem;
      background: #001529;
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
        color: #fff;
        p {
          margin:0;
          display: -webkit-box;
          margin: 0 .2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        p:nth-child(2) {
          margin: .25rem .2rem;
        }
      }
    }
    .earthList {
      background: #001529;
      display: flex;
      padding: .2rem 0;
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
}

</style>
