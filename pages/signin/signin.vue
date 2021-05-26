//登录页面
<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-right" @tap="toSignup()">
				<view class="text">注册</view>
			</view>
		</view>
		<view class="main">
			<view class="text">登录</view>
			<view class="slogan"@tap="testFun2">您好，欢迎！</view>
			<view class="inputs">
				<input type="text" v-model="user" placeholder="用户名/邮箱" class="user" placeholder-style="color=#bbb;font-weight:400;"/>
				<input type="password"v-model="psw" placeholder="密码" class="psw" placeholder-style="color=#bbb;font-weight:400;"/>
			</view>
			<view class="tips":style="{display:mon}">输入用户名或密码错误！</view>
		</view>
		<view class="submit" @tap="login">登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user:'',
				psw:'',
				token:'',
				mon:'none',
			}
		},
		onLoad:function(e){
			this.psw='';
			if(e.user){
				this.user=e.user;
				uni.showToast({
					title:'注册成功请登录',
					icon:'none,',
					duration:1500,
				});
			}
		},
		methods: {
			//跳转到注册页面
			toSignup:function(){
				uni.navigateTo({
					url:'../signup/signup',
				})
			},
			//登录提交
			login:function(){
				if(this.user&&this.psw){
					uni.request({
						url:this.serverUrl+'/signin/match',
						data:{
							data:this.user,									
							pwd:this.psw,
						},
						method:'POST',
						success:(data)=>{
							let status=data.data.status;
							//访问后端成功
							if(status==200){
								//登录成功
								let res=data.data.back;
								let usertype=data.data.back.userType;
								this.mon='none';
								//本地存储用户信息
								try{
									uni.setStorageSync('user',{'id':res.id,'name':res.name,'imgurl':res.imgurl,'token':res.token,'userType':res.userType});
								}catch(e){
									console.log('数据存储出错');
								}
								//socket模块
								//用户登录socket注册
								//this.socket.emit('login',res.id);
								//跳转到首页
								if(usertype=='0'){
									uni.navigateTo({
										url:'../index/index',
									});
								}else if(usertype=='1'){
									this.socket.emit('login',res.id);
									uni.navigateTo({
										url:'../coding2/coding2',
									});
								}
								
							}else if(status==400){
								//用户匹配失败
								this.mon='block';
								this.psw='';
							}		
							else if(status==500){
								uni.showToast({
									title:'服务器出现错误啦！',
									icon:'none',
									duration:2000,
								})				
							}						
						}
					})
				}
			},
		}
	}
</script>

<style lang="scss">
.top-bar{
	//border: 1px solid red;
		position: fixed;
		z-index: 1001;
		top: 0;
		left: 0;
		width: 100%;
		height: 88rpx;
		box-sizing: border-box;
		background: rgba(255,255,255,0.9);
		.top-bar-right{
			float: right;
			padding-right:80rpx;
			.text{
				font-size: 30rpx;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 60rpx;
			}
		}
			
	}
.main{
	padding-top: 300rpx;
	padding-left: 1000rpx;
	padding-bottom: 80rpx;
	//border: 1px solid blue;
	.text{
		//border: 1px solid black;
		font-size: 60rpx;
		font-weight: 500;
		color: $uni-text-color;
		line-height: 80rpx;
	}
	.slogan{
		//border: 1px solid black;
		font-size: 60rpx;
		color: $uni-bg-color-grey;
		line-height: 60rpx;
	}
	.inputs{
		//border: 1px solid black;
		padding-top:20rpx;
		input{
			padding-top: 40rpx;
			height: 40rpx;
			font-size: 25rpx;
			font-weight: 500;
			color: $uni-text-color;
			line-height: 35rpx;
			border-bottom: 1px solid $uni-border-color;
			margin-right: 1000rpx;
		}
	}
	.tips{
		padding-top:5rpx ;
		float: left;
		font-size: 16rpx;
		color: $uni-color-warning;
		line-height: 16rpx;
	}
}
.submit{
	margin: 0 auto;
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
}

</style>
