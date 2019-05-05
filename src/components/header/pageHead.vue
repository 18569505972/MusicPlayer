<template>
    <div id="page-head">
     	<img src="@/assets/icon/left.png" @click="backPrevPage">
        <b>{{topnm}}</b>
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
    components: {},
    props:['pageTitle'],
    data() {
        return {
        }
    },
    methods: {
    	...mapMutations(['update_topNm']),
    	backPrevPage() {
	      this.$router.go(-1);
	    }
    },
    computed: {
    	topnm() {
    		return this.$store.state.topNm
    	} 
    },
    created() {
    	if (this.$route.name == 'play'){
    		let topNm = `${this.$store.state.playObj.name}  `,
    			artists = this.$store.state.playObj.artists,
    		 	artistsNm = ""
    		if (artists.length>0) {
    			for(let i=0;i<artists.length;i++) {
    				if (i<artists.length-1) {
    					artistsNm+=artists[i].name + '、'
    				} else {
    					artistsNm+=artists[i].name
    				}
    			}
    		}
    		let topnm = topNm + artistsNm
    		this.update_topNm(topnm)
    	}
    }
}
</script>
<style lang="less">
#page-head {
    position: fixed;
    top: 0;
    width: 100%;
    height: 1rem;
    background: #1989F0;
    color: #fff;
    z-index: 3;
    img{
    	position: absolute;
    	left: .2rem;
    	top: 50%;
    	height: .6rem;
    	width: .6rem;
    	transform: translate3d(0, -50%, 0);
    }
    b{
    	position: absolute;
    	left: 50%;
    	top: 50%;
    	font-size: .4rem;
    	width: 70%;
    	transform: translate3d(-50%, -50%, 0);
    	overflow: hidden;
    	display: inline-block;
    	white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        text-align: center;
    }
}
</style>