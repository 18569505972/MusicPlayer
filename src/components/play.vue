<template>
	<div>
		<div class="container">
		    <img :src="musicimg?musicimg:'http://p1.music.126.net/N2HO5xfYEqyQ8q6oxCw8IQ==/18713687906568048.jpg'">
			<audio :src="musicurl" controls autoplay></audio>
		</div>
	</div>
</template>
<script>
import {XHeader} from 'vux';
export default {
    props: {
        musicurl:{
        	type:String,
        	default:''
        },
        musicimg:{
        	type:String,
        	default:''
        },
        musicid:{
        	type:String,
        	default:''
        },

    },
    components: {
        XHeader
    },
    data() {
        return {
        };
    },
    mounted(){
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
.container{
	position:fixed;
	width:100%;
	height:50px;
	line-height:50px;
	z-index: 999;
    left: 0;
    bottom: 0;
    background:#000;
    padding:5px;
    img{
    	height:40px;
    	width:40px;
    }
    #playIcon{
    	height:30px;
    	width:30px;
    }
    audio{
    	background:#000;
    }
}
</style>