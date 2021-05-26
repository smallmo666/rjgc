<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left">
				<image :src="imgurl"></image>
			</view>
			<view class="top-bar-center">
				<view class="head">{{this.name}}</view>
			</view>
			<view class="top-bar-right">
				<view class="search"><image src="../../static/image/element/search.jpeg"></image></view>
				<view class="add"><image src="../../static/image/element/add.jpg"@tap="add()"></image></view>
			</view>
		</view>
		<view class="main">
			<view class="list">
				<view class="exes">
					<view class="exes-list" v-for="(item,index) in exelist":key="index"@click="execlick(index)">
						<view class="exes-list-r">
							<view class="name"><p v-html=item.topic></p></view>
							<view class="message"><p v-html=item.content></p></view>
						</view>
					</view>
				</view>
			</view>
			<view class="room">
				<view class="exe">
					<view class="title">
						<view class="titletip">请输入标题</view>
						<vue-editor class="title-editor"v-model="title"></vue-editor>
					</view>
					<view class="text">
						<view class="texttip">请输入题目内容</view>
						<vue-editor class="text-editor"v-model="content"></vue-editor>
					</view>
				</view>
				<view class="send">
					<input type="text" v-model="rename" placeholder="面试学生名字" class="rename" placeholder-style="color=#bbb;font-weight:400;"/>
					<view class="tips":style="{display:mon}">没有这个面试者！</view>
					<view class="btn">						
						<view class="submitbtn" @tap="submmit">提交</view>
						<view class="sendbtn" @tap="send">发送</view>
					</view>				
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import datas from "../../common/js/data.js"
	import myfun from "../../common/js/myfun.js"
	import { VueEditor } from 'vue2-editor'
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	
	import { quillEditor } from 'vue-quill-editor'
	export default {
		data() {
			return {            
				exelist:[],          //练习题列表信息
				isSend:false,        //发送键是否点击
				
				uid:'',				 //当前用户id
				imgurl:'',			 //当前用户头像地址
				token:'',			 //当前用户token 
				
				name:'',			 //当前用户名
				title:'',			 //练习题标题
				content:'',          //练习题内容
				usertype:'',          //用户类型
				rename:'',           //要发送的面试者名字
				reid:'',			 //要发送的面试者id
				
				mon:'none',
				iscoder:false,       //是否为面试者
				issummit:false,
				
				exeid:'',            //当前练习题id
			}
		},
		onLoad() {
			this.getStorages();
			this.getExelist();
			this.join(this.uid);
		},
		components:{
			VueEditor,
			quillEditor,
		},
		methods: {
			//socket模块
			//用户登录socket注册
			join:function(uid){
				this.socket.emit('login',uid);
			},
			//点击添加键
			add:function(){
				this.title='';
				this.content='';
				this.exeid='';
				this.rename='';
			},
			//选中练习题
			execlick:function(index){
				//console.log(this.exelist[index].id);
				this.exeid=this.exelist[index].id;
				this.content=this.exelist[index].content;
				this.title=this.exelist[index].topic;
				this.rename=this.exelist[index].rename;
			},
			//服务器消息接收
			//sockettest:function(){
			//	this.socket.on('msg',id=>{
			//		console.log('接收的消息为:'+id);
			//	})
			//},
			//获取缓存数据
			getStorages:function(){
				try {
				    const value = uni.getStorageSync('user');
				    if (value) {
				        this.uid=value.id;
						this.token=value.token;
						this.name=value.name;
						this.imgurl=this.serverUrl+value.imgurl;
						this.usertype=value.userType;
				    }else{
						uni.navigateTo({
							url:'../signin/signin',
						});
					}
				} catch (e) {
				    // error
				}
			},
			//判断面试者是否存在
			judgeExist:function(){
					uni.request({
						url:this.serverUrl+'/index/judgeExist',
						data:{
							data:this.rename,									
						},
						method:'POST',
						success:(data)=>{
							let status=data.data.status;	
							//访问后端成功
							if(status==200){
								//有该用户
								let usertype=data.data.result[0].userType;
								let reid=data.data.result[0]._id;
								if(usertype=='1'){
									this.mon='none';
									this.iscoder=true;
									this.reid=reid;
								}else if(usertype=='0'){	
									this.mon='block';
									this.iscoder=false;
									this.reid='';
								}
							}else if(status==400){
								//无此用户
								this.mon='block';
								this.iscoder=false;
								this.reid='';
							}		
							else if(status==500){
								this.iscoder=false;
								this.reid='';
								uni.showToast({
									title:'服务器出现错误啦！',
									icon:'none',
									duration:2000,
								})				
							}						
						}
					})
			},
			//修改面试题
			revise:function(){		
				uni.request({
					url:this.serverUrl+'/index/reviseExe',
					data:{
						exeid:this.exeid,
						topic:this.title,									
						content:this.content,
						rename:this.rename,
					},
					method:'POST',
					success:(data)=>{
						console.log(data);
						let status=data.data.status;
						//访问后端成功
						if(status==200){
							this.getExelist();
						}else if(status==500){
							uni.showToast({
								title:'服务器出现错误啦！',
								icon:'none',
								duration:2000,
							})				
						}						
					}
				})
						
			},
			//新建面试题
			submmit:function(){
				this.judgeExist();
				if(this.iscoder&&this.title&&this.content){
					let isrevise=0;
					for(let i=0;i<this.exelist.length;i++){
						if(this.exelist[i].id==this.exeid)isrevise=1;
					}
					if(isrevise==1){
						this.revise();
						}
					else if(isrevise==0){
						uni.request({
							url:this.serverUrl+'/index/add',
							data:{
								userId:this.uid,
								name:this.name,									
								topic:this.title,
								content:this.content,
								rename:this.rename,
							},
							method:'POST',
							success:(data)=>{
								console.log(data);
								let status=data.data.status;
								//访问后端成功
								if(status==200){
									this.getExelist();
								}else if(status==500){
									uni.showToast({
										title:'服务器出现错误啦！',
										icon:'none',
										duration:2000,
									})				
								}						
							}
						})
					}
					console.log(isrevise,this.title,this.content);
					this.issummit=true;
				}else{
					this.issummit=false;
				}
								
			},
			//发送面试题给面试者
			send:function(){
				this.submmit();
				//console.log('2'+this.iscoder);
				if(this.issummit){
					try{
						uni.setStorageSync('exe',{'reid':this.reid,'title':this.title,'usertype':this.usertype,'content':this.content,'uid':this.uid,'rename':this.rename,'name':this.name});
					}catch(e){
						console.log('数据存储出错');
					}
					uni.navigateTo({
						url:'../coding/coding',
					});		
				}
			},
			//获取练习题列表
			getExelist:function(){
				uni.request({
					url:this.serverUrl+'/index/getExe',
					data:{
						uid:this.uid,
					},
					method:'POST',
					success:(data)=>{
						let status=data.data.status;
						//访问后端成功
						if(status==200){
							this.exelist=data.data.result;
						}else if(status==500){
							uni.showToast({
								title:'服务器出现错误啦！',
								icon:'none',
								duration:2000,
							})				
						}						
					}
				})
			},
			
		}
	}
</script>

<style lang="scss">
	@import"../../common/css/mycss.scss";
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: rgba(255,228,49,0.1);
	}
	.main{
		width: 98%;
		height: 1350rpx;
		padding: 88rpx $uni-spacing-col-base 0;
		//border: 1px solid blue;
	}
	.list{
		float:left;
		height: 1300rpx;
		width: 500rpx;
		border: 1px solid $uni-border-color;
		overflow-y:auto;
	}
	.list::-webkit-scrollbar {
	      width: 2rpx;    
	 }
	.exes-list{
		height: 96rpx;
		width: 100%;
		margin-top: 2rpx;
		padding: 16rpx 0;
		border: 1px solid $uni-border-color;
		&:active{
			background-color: $uni-bg-color-grey;
		}
		.exes-list-r{
			padding-left: 20rpx;			
			.name{		
				padding-top: 10rpx;
				font-size: 30rpx;
				font-weight:400;
				color: $uni-text-color;
				line-height: 30rpx;
				display: -webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:1;
				overflow: hidden;
			}					
			.message{
				padding-top: 5rpx;
				font-size: $uni-font-size-base;
				color: $uni-text-color-grey;
				line-height: 30rpx;
				display: -webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:1;
				overflow: hidden;
			}
		}
		
		
	}
	.room{
		float: right;
		border: 1px solid $uni-border-color;
		width: 2450rpx;
		height: 1300rpx;
		.exe{
			width: 100%;
			height: 1100rpx;
			//border: 1px solid blue;
		}
	}
	.title{
		width: 100%;
		height: 550rpx;
		border: 1px solid $uni-border-color;
		.title-editor{
			width: 80%;
			height: 100rpx;
			padding-left: 200rpx;
		}
		.titletip{
			text-align: center;
		}
	}
	.text{
		width: 100%;
		height: 550rpx;
		border: 1px solid $uni-border-color;
		.text-editor{
			width: 80%;
			height: 200rpx;
			padding-left: 200rpx;
		}
		.texttip{
			text-align: center;
		}
	}
	.send{
		width: 100%;
		height: 200rpx;
		border: 1px solid $uni-border-color;
		.rename{
			width: 500rpx;
			height: 50rpx;
			border: 1px solid $uni-border-color;
			margin-top: 50rpx;
			margin-left: 200rpx;
		}
	}
	.tips{
		margin-left: 200rpx;
		font-size: 16rpx;
		color: $uni-color-warning;
		line-height: 16rpx;
	}
	.btn{
		.submitbtn{
			float: left;
			width: 150rpx;
			height: 60rpx;
			background: $uni-color-primary;
			box-shadow: 0rpx 20rpx 16rpx -18rpx rgba(255,228,49,0.4);
			border-radius: 48rpx;
			font-size: 25rpx;
			font-weight: 500;
			color: $uni-text-color;
			line-height: 50rpx;
			text-align: center;
			margin-left: 1800rpx;
		}
		.sendbtn{
			float: right;
			width: 150rpx;
			height: 60rpx;
			background: $uni-color-primary;
			box-shadow: 0rpx 20rpx 16rpx -18rpx rgba(255,228,49,0.4);
			border-radius: 48rpx;
			font-size: 25rpx;
			font-weight: 500;
			color: $uni-text-color;
			line-height: 50rpx;
			text-align: center;
			margin-right: 300rpx;
		}
	}
	
	
	
</style>

