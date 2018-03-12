<template>
	<div>
		<header>
			<tab>
			  <tab-item selected @click.native="introList">推荐</tab-item>
			  <tab-item @click.native="topList">排行榜</tab-item>
			</tab>
		</header>
		<section v-show="isIntro" class="recommendSection">
			<div v-for="item in recommengList" class="recommendList" @click="jumpRecommendAlbum(item.id)">
				<img :src="item.picUrl">
				<div>
					<p>{{item.copywriter}}</p>
					{{item.name}}
				</div>
			</div>
		</section>
		<section v-show="!isIntro">
			<div class="official">
				<p class="topNm" style="margin-top:10px;">官方榜</p>
				<div class="topClass" @click="jumpTopList(0,'新歌榜')">
					<div><img src="/static/images/0newMusicList.jpg"></div>
					<article>
						<p v-for="(item,index) in newList">{{index+1}}、{{item.name}}-<span v-for="arNm in item.ar">{{arNm.name}}</span></p>
					</article>
				</div>
				<div class="topClass" @click="jumpTopList(1,'热歌榜')">
					<div><img src="/static/images/1hotMusicList.jpg"></div>
					<article>
						<p v-for="(item,index) in hotList">{{index+1}}、{{item.name}}-<span v-for="arNm in item.ar">{{arNm.name}}</span></p>
					</article>
				</div>
				<div class="topClass" @click="jumpTopList(2,'原创榜')">
					<div><img src="/static/images/2createMusicList.jpg"></div>
					<article>
						<p v-for="(item,index) in createList">{{index+1}}、{{item.name}}-<span v-for="arNm in item.ar">{{arNm.name}}</span></p>
					</article>
				</div>
				<div class="topClass" @click="jumpTopList(3,'飙升榜')">
					<div><img src="/static/images/3upMusicList.jpg"></div>
					<article>
						<p v-for="(item,index) in upList">{{index+1}}、{{item.name}}-<span v-for="arNm in item.ar">{{arNm.name}}</span></p>
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

	</div>
</template>
<script>
import {Tab,TabItem,Flexbox,FlexboxItem} from 'vux';
export default {
    props: {
        title: { // 标题
            type: String,
            default: '标题'
        }
    },
    components: {
        Tab,
        TabItem,
        Flexbox,
        FlexboxItem
    },
    data() {
        return {
        	recommengList:[],
        	isIntro:true,
        	newList:[],
        	hotList:[],
        	createList:[],
        	upList:[]
        };
    },
    mounted(){
		var that=this;
        $.ajax({
            url: 'http://localhost:3000/personalized',
            type: 'get',
            dataType: 'json',
            data: {},
            success: function(data) {
            	that.recommengList=data.result;
            },
            error: function(err) {
            }
        });
    },
    methods: {
    	jumpRecommendAlbum(id){
    		this.$router.push({
	            name:'recommendAlbum',
	            params:{
	              albumId:id
	            }
	          }); 
    	},
    	topList(){
    		var that=this;
    		that.isIntro=false;
			if(!that.newList[0]){
		        $.ajax({
		            url: 'http://localhost:3000/top/list',
		            type: 'get',
		            dataType: 'json',
		            data: {idx:0},
		            success: function(data) {
		            	that.newList=data.playlist.tracks.slice(0,3);
		            },
		            error: function(err) {
		            }
		        });
		        $.ajax({
		            url: 'http://localhost:3000/top/list',
		            type: 'get',
		            dataType: 'json',
		            data: {idx:1},
		            success: function(data) {
		            	that.hotList=data.playlist.tracks.slice(0,3);
		            },
		            error: function(err) {
		            }
		        });
		        $.ajax({
		            url: 'http://localhost:3000/top/list',
		            type: 'get',
		            dataType: 'json',
		            data: {idx:2},
		            success: function(data) {
		            	that.createList=data.playlist.tracks.slice(0,3);
		            },
		            error: function(err) {
		            }
		        });
		        $.ajax({
		            url: 'http://localhost:3000/top/list',
		            type: 'get',
		            dataType: 'json',
		            data: {idx:3},
		            success: function(data) {
		            	that.upList=data.playlist.tracks.slice(0,3);
		            },
		            error: function(err) {
		            }
		        });
		    }
    	},
    	introList(){
    		this.isIntro=true;
    	},
    	jumpTopList(idx,topNm){
    		this.$router.push({
	            name:'topList',
	            params:{
	              idx:idx,
	              topNm:topNm
	            }
	          }); 
    	},
    },
    created() {
    },
    computed: {
    }
};
</script>
<style lang="less" scoped>
header{
	position:fixed;
	width:100%
}
section{
	padding-top:44px;
	background: rgba(0,0,0,0.1);
	.recommendList{
		display:flex;
		align-items:center;
		margin-top:10px;
		padding:0 5px;
		background: #fff;
		img{
			height:80px; 
			width:80px;
			flex:1;
		}
		div{
			flex:3;
			padding-left:5px;
		}
	}
	.topNm{
		font-size: 14px;
		text-align: center;
		height: 40px;
		line-height: 40px;
		font-weight: bold
	}
	.topClass{
		margin-bottom: 10px;
    	background: #fff;
    	display:flex;
    	div{
    		flex:1;
    		font-size:0;
    	}
		img{
			width:96%;
		}
		article{
			flex:2;
			align-self:center;
			p{
				padding:0 10px;
			}
			p:nth-child(2){
				padding:15px 10px;
			}
		}
	}
	.earthList{
		background: #fff;
		display:flex;
		padding:10px 0;
		.mNcom{
			flex:1;
			font-size:0;
		}
		.leftNm{
			text-align:left;
		}
		.middleNm{
			text-align:center;
		}
		.rightNm{
			text-align:right;
		}
		img{
			width:95%;
		}
	}
}
</style>