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
                            <img src="/static/images/right.png">
                        </p>
                        <p>
                            <span v-for="item in listTags">{{item}}#</span>
                        </p>
                    </div>
                </div>
                <div class="listDescription">{{listDescription}}</div>
            </header>
            <div v-for="item in albumList" class="albumList">
                <img :src="item.album.picUrl">
                <p>
                    <span class="musicNm">{{item.name}}</span><br>
                    <span v-for="siginal in item.artists" class="musician">歌手：{{siginal.name}}</span><br>
                    <span class="album">专辑：{{item.album.name}}</span>
                </p>
            </div>
        </div>
	</div>
</template>
<script>
import {XHeader} from 'vux';
export default {
    props: {
        title: { // 标题
            type: String,
            default: '标题'
        }
    },
    components: {
        XHeader
    },
    data() {
        return {
        	albumList:[],
            coverImgUrl:"",
            creator:{},
            listNm:"",
            listDescription:"",
            listTags:[],
        };
    },
    mounted(){
        var that=this;
            $.ajax({
            url: 'http://localhost:3000/playlist/detail?id='+that.$route.params.albumId,
            type: 'get',
            dataType: 'json',
            data: {},
            success: function(data) {
                that.coverImgUrl=data.result.coverImgUrl;
                that.creator=data.result.creator;
                that.listNm=data.result.name;
                that.listTags=data.result.tags;
                that.listDescription=data.result.description;
                that.albumList=data.result.tracks;
            },
            error: function(err) {
            }
        });
    },
    methods: {

    },
    created() {
    },
    computed: {
    }
};
</script>
<style lang="less" scoped>
#x-header{
    background:#000;
    position:fixed;
    width:100%;
}
.recommendList{
    padding-top:46px;
    header{
        padding:10px; 
        background: rgba(100,100,100,0.2);
        .header-top{
            display:flex;
            align-items:top;
            .coverImg{
                height:100px;
                width:100px;
                flex:1;
            }
            .listIntro{
                flex:2;
                margin-left:15px;
                .listNm{
                    font-size:14px;
                    font-weight:bold;
                }
                .nickname{
                    border-radius: 10px;
                    margin:5px 0;
                    padding: 1px 5px;
                    display: inline-block;
                    background: rgba(256,256,256,0.8);
                    background-repeat:no-reapeat;
                    img{
                        height:10px;
                    }
                }
            }
        }
        .listDescription{
            margin-top:10px;
            overflow:hidden; 
            text-overflow:ellipsis;
            display:-webkit-box; 
            -webkit-box-orient:vertical;
            -webkit-line-clamp:2; 
        }
    }
    .albumList{
        display:flex;
        padding:10px;
        box-shadow: 0 1px 1px #ddd;
        img{
            flex:1;
            height: 35px;
            width: 35px;
        }
        p{
            flex:8;
            padding-left: 10px;
            .musicNm{
                font-size: 13px;
                font-weight: bolder;
            }
            .musician,.album{
                color: #666;
            }
        }
    }
}
</style>