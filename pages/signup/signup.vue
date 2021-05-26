//注册页面
<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="toSignIn()">
				<image src="../../static/image/element/back.jpg" class="back-img"></image>
			</view>
		</view>
		<view class="main">
			<view class="title">注册</view>
			<view class="inputs">
				<view class="inputs-div">
					<input type="text" placeholder="请取个名字" class="user" placeholder-style="color=#bbb;font-weight:400;"@blur="matchUser"/>
					<view class="occupy"v-if="useroccupy">已占用</view>
					<image src="../../static/image/element/yes.jpg" class="ok" v-if="isuser"></image>
				</view>
				<view class="inputs-div">
					<input type="text" placeholder="请输入邮箱" class="email" placeholder-style="color=#bbb;font-weight:400;" @blur="isEmail"/>
					<view class="occupy" v-if="emailoccupy">已占用</view>
					<view class="invaild" v-if="invaild">邮箱无效</view>
					<image src="../../static/image/element/yes.jpg" class="ok" v-if="isemail"></image>
				</view>	
				<view class="inputs-div">
					<input :type="type"placeholder="请输入密码" class="psw" placeholder-style="color=#bbb;font-weight:400;"@input="getPsw"/>
					<image :src="lookurl"class="look"@tap="looks"></image>
				</view>			
				<view class="option-list">
				    <radio-group @change="radioChange">
				        <label class="cell" v-for="(item, index) in items" :key="item.value">
				                <radio :value="item.value" :checked="index === current" />{{item.name}}
				        </label>
				    </radio-group>
				</view>
			</view>
		</view>
		<view :class="[{submit:isok},{submit1:!isok}]"@tap="signup()">注册</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:'password',
				isuser:false,       //用户名是否可用
				isemail:false,      //邮箱是否可用
				look:true,          //密码是否显示
				invaild:false,      //邮箱是否有效
				useroccupy:false,   //用户是否被占用
				emailoccupy:false,  //邮箱是否被占用
				lookurl:"../../static/image/element/lock.jpg",
				email:'',
				isok:false,        //提交是否就绪
				user:'',           //用户名
				psw:'',            //密码
				items: [{
				            value: '0',
				            name: '面试官',
							checked: 'true'
				        },
				        {
				            value: '1',
				            name: '面试者',            
				        }				     
				        ],
				current: 0,
				usertype:'0',
			}
		},
		methods: {
			radioChange: function(evt) {
			            for (let i = 0; i < this.items.length; i++) {
			                if (this.items[i].value === evt.target.value) {
			                    this.current = i;
								this.usertype=this.items[i].value;
								console.log(this.usertype);
			                    break;
			                }
			            }
			        },
			//判断注册就绪
			isOk:function(){
				if(this.isuser&&this.isemail&&this.psw.length>5){
					this.isok=true;
				}
				else{
					this.isok=false;
				}
			},
			//密码显示与隐藏
			looks:function(){
				if(this.look){
					this.type="password";
					this.look=!this.look;
					this.lookurl="../../static/image/element/lock.jpg"
				}else{
					this.type="text";
					this.look=!this.look;
					this.lookurl="../../static/image/element/look.jpg"
				}
			},
			//判断是否为邮箱格式
			isEmail:function(e){
				let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
				this.email=e.detail.value;
				if(this.email.length>0){
					if(reg.test(this.email)){
						this.invaild=false;
						//后端验证邮箱是否被占用
						this.matchMail();
					}else{
						this.invaild=true;
						this.emailoccupy=false;
						this.isemail=false;
					}
				}else{
						this.invaild=false;
						this.emailoccupy=false;
						this.isemail=false;
				}	
				this.isOk();
			},
			//跳转到登录页面
			toSignIn:function(){
				uni.navigateBack({
					delta:1
				});
			},
			
			//匹配用户名
			matchUser:function(e){
				this.user=e.detail.value;
				if(this.user.length>0){
					uni.request({
						url:this.serverUrl+'/signup/judge',
						data:{
							data:this.user,									
							type:'name',
						},
						method:'POST',
						success:(data)=>{
							//console.log(data);
							let status=data.data.status;
							//访问后端成功
							if(status==200){
								let res=data.data.result;
								if(res>0){
									//用户名存在
									this.useroccupy=true;
									this.isuser=false;
								}else{
									//表示用户名不存在
									this.useroccupy=false;
									this.isuser=true;
								}
								this.isOk();
							}else if(status==500){
								uni.showToast({
									title:'服务器出现错误啦！',
									icon:'none',
									duration:2000,
								})				
							}						
						}
					})
				}else{
					this.useroccupy=false;
					this.isuser=false;
					this.isOk();
				}
			},
			//匹配邮箱
			matchMail:function(){
					uni.request({
						url:this.serverUrl+'/signup/judge',
						data:{
							data:this.email,									
							type:'email',
						},
						method:'POST',
						success:(data)=>{
							//console.log(data);
							let status=data.data.status;
							//访问后端成功
							if(status==200){
								let res=data.data.result;
								if(res>0){
									//邮箱存在
									this.emailoccupy=true;
									this.isemail=false;
								}else{
									//表示邮箱不存在
									this.emailoccupy=false;
									this.isemail=true;
								}
								this.isOk();
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
			//获取密码
			getPsw:function(e){
				this.psw=e.detail.value;
				this.isOk();
			},
			//注册提交
			signup:function(){
				if(this.isok){
					uni.request({
						url:this.serverUrl+'/signup/add',
						data:{
							data:this.user,									
							mail:this.email,
							pwd:this.psw,
							usertype:this.usertype,
						},
						method:'POST',
						success:(data)=>{
							let status=data.data.status;
							//访问后端成功
							if(status==200){
								//注册成功跳转到登录页
								uni.navigateTo({
									url:'../signin/signin?user='+this.user,
								})
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
			}
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
		.top-bar-left{
			float: left;
			padding-right:80rpx;
			.text{
				font-size: 30rpx;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 60rpx;
			}
			.back-img{
				width: 100rpx;
				height: 100rpx;
			}
		}
			
	}
.main{
	padding-top: 300rpx;
	padding-left: 1000rpx;
	padding-bottom: 80rpx;
	//border: 1px solid blue;
	.title{
		//border: 1px solid black;
		font-size: 60rpx;
		font-weight: 500;
		color: $uni-text-color;
		line-height: 80rpx;
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
	.inputs-div{
		position: relative;
	}
	.occupy {
		position: relative;
		right: 60rpx;
		top: -40rpx;
		float: right;
		font-size: 25rpx;
		font-weight: 500;
		color: $uni-color-warning;
		line-height: 35rpx;
		margin-right: 1000rpx;
	}
	.invaild{
		position: relative;
		right: 60rpx;
		top: -40rpx;
		float: right;
		font-size: 25rpx;
		font-weight: 500;
		color: $uni-color-warning;
		line-height: 35rpx;
		margin-right: 1000rpx;
	}
	.ok{
		width: 42rpx;
		height: 32rpx;
		position: absolute;
		right: 1050rpx;
		top: 45rpx;
	}
	.look{
		width: 65rpx;
		height: 65rpx;
		position: absolute;
		right: 1040rpx;
		top: 15rpx;
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
.submit1{
	margin: 0 auto;
	width: 150rpx;
	height: 60rpx;
	background: rgba(39,40,50,0.2);
	box-shadow: 0rpx 20rpx 16rpx -18rpx rgba(255,228,49,0.4);
	border-radius: 48rpx;
	font-size: 25rpx;
	font-weight: 500;
	color: $uni-text-color-inverse;
	line-height: 50rpx;
	text-align: center;
}
.option-list{
	padding-top: 10rpx;
}
</style>
