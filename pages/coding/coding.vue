<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left">
				<image src="../../static/image/tx/tx1.jpg"></image>
			</view>
			<view class="top-bar-center">
				<view class="head">{{this.name}}</view>
			</view>
			<view class="top-bar-right">
				<view class="search"><image src="../../static/image/element/search.jpeg"@tap="sendSocketId()"></image></view>
				<view class="add"><image src="../../static/image/element/add.jpg"@tap="getoldMsg()"></image></view>
			</view>
		</view>
		<view class="main">
			<view class="question">
				<scroll-view class="qustitle" scroll-y="true" scroll-with-animation="true":scroll-into-view="scrollToView"show-scrollbar="false">
				<p v-html=title></p>
				</scroll-view>				
				<scroll-view class="quscontent" scroll-y="true" scroll-with-animation="true":scroll-into-view="scrollToView"show-scrollbar="false">
				<p v-html=content></p>
				</scroll-view>
			</view>
			<view class="code">
				<prism-editor class="editor height-300" v-model="code" :highlight="highlighter":line-numbers="lineNumbers"@input="getCode()">
				</prism-editor>
			</view>
			<view class="room">
				<view class="title-bar">
					<view class="title">{{rename}}</view>
				</view>
				<view class="chat">
					<view class="chat-main">
						<view class="chat-ls" v-for="(item,index) in msg":key="index">
							<view class="chat-time" v-if="item.time!=''">{{changeTime1(item.time)}}</view>
							<view class="msg-m msg-left" v-if="item.fromId==reid">
								<view class="msg" >
									<view class="msg-text">{{item.message}}</view>
								</view>					
							</view>
							<view class="msg-m msg-right" v-if="item.fromId==uid">
								<view class="msg" >
									<view class="msg-text">{{item.message}}</view>
								</view>						
							</view>
						</view>
					</view>
				</view>
				<view class="bottom-bar">
					<view class="bottom-bar-top">
						<view class="img-emoji">
							<image src="../../static/image/element/emoji.png"></image>
						</view>
						<view class="img-file">
							<image src="../../static/image/element/file.jpg"></image>
						</view>						
					</view>
					<view class="bottom-bar-text">
						<textarea class="chat-send btn" @input="inputs" v-model="inputmsg"></textarea>
					</view>
				</view>
		</view>
	</view>
	</view>
</template>



<script>	
	import datas from "../../common/js/data.js"
	import myfun from "../../common/js/myfun.js"
	import {PrismEditor} from "vue-prism-editor";
	import "vue-prism-editor/dist/prismeditor.min.css";
	import {
		highlight,
		languages
	} from "prismjs/components/prism-core";
	import "prismjs/components/prism-clike";
	import "prismjs/components/prism-javascript";
	import "prismjs/components/prism-c";
	import "prismjs/components/prism-python";
	import "prismjs/themes/prism-tomorrow.css";
	export default {
		data() {
			return {
				starttext:'//请在此编辑代码',
				text:'',
				
				msgs:[],             //聊天信息
				msg:[],
				oldTime:new Date(),  //获取当前时间，用于下面函数判断
				scrollToView:'',     //滑动聊天界面定位
				inputmsg:'',         //输入框消息
				
				uid:'',				 //当前用户id
				name:'',			 //当前用户名
				title:'',			 //练习题标题
				content:'',          //练习题内容
				usertype:'',          //用户类型
				rename:'',           //要发送的面试者名字
				reid:'',             //要发送的面试者id
				
				code: 'console.log("Hello World")', //编辑器文字
				lineNumbers: true,                  //
			}
		},
		components:{
			PrismEditor,
		},
		onLoad() {
			this.getMsg();
			this.getStorages();
			this.receiveSocketMsg()
			this.getoldMsg();
			this.receiveSocketCode();
			this.getCode();
		},
		methods: {
			highlighter(code) {
				return highlight(code,languages.js); //returns html
			},
			//代码接收
			receiveSocketCode:function(){
				this.socket.on('sendcode',(code)=>{
					this.code=code;
				});
			},
			//获取编辑器数据
			getCode:function(){
				this.socket.emit('sendcode',this.code,this.uid,this.reid);
			},
			//向面试者发送自己的信息
			sendSocketId:function(){
				console.log(this.uid,this.reid);
				this.socket.emit('init',this.uid,this.reid,this.name,this.title,this.content);
			},
			//获取编辑器内容
			getText:function(){
				console.log(e);
				this.text=e.data.text;
				console.log(this.text);
			},
			//编辑器初始化
			onEditorReady() {
			    var that = this;
			    uni.createSelectorQuery().select('#editor').context((res) => {
			    this.editorCtx = res.context;
			    this.editorCtx.setContents({//赋值
			          html:that.starttext
			         });
			      }).exec()
			},
			//处理聊天时间
			changeTime1:function(date){
				return myfun.dateTime1(date);
			},
			//获取聊天数据
			getMsg:function(){
				let msg=datas.message();
				
				//开始时定位到聊天记录最下方
				this.$nextTick(function(){
					this.scrollToView='msg';
				})
			},
			
			//文字发送
			inputs:function(e){
				var chatm=e.detail.value;
				var pos=chatm.indexOf('\n');
				if((pos!=-1||this.issend)&&chatm.length>1){
					this.inputmsg=chatm;
					setTimeout(()=>{	
						let len=this.msg.length;
						let data={
							fromId:this.uid,
							message:this.inputmsg,
							time:new Date(),
						};
						this.sendSocket(this.inputmsg,data.time);
						this.inputmsg='';
						this.msg.push(data);
						this.goBottom();
					},0);
					this.issend=false;
				}
			},
			//获取数据库过往聊天数据
			getoldMsg:function(){
				//console.log(this.uid,this.reid);
				uni.request({
					url:this.serverUrl+'/chat/msg',
					data:{
						uid:this.uid,
						reid:this.reid,
					},
					method:'POST',
					success:(data)=>{
						let status=data.data.status;	
						//访问后端成功
						if(status==200){
							//有聊天数据
							this.msg=data.data.result;
							console.log(this.msg[0]);
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
			//聊天数据发送给后端
			sendSocket:function(msg,time){
				this.socket.emit('msg',msg,time,this.uid,this.reid);
			},
			//聊天数据接收
			receiveSocketMsg:function(){
				this.socket.on('msg',(msg,time,fromid,tip)=>{
					if(tip==1){
						console.log('自己:'+msg+time+fromid);
					}else if(tip==0){
						//console.log('对方:'+msg+time+fromid);
						let data={
							fromId:this.reid,
							message:msg,
							time:time,
						};
						this.msg.push(data);
					}
				});
			},
			//滑动到底部
			goBottom:function(){
				this.scrollToView='';
				this.$nextTick(function(){
					let len=this.msg.length-1;
					this.scrollToView='msg';
				})
			},
			//获取缓存数据
			getStorages:function(){
				try {
				    const value = uni.getStorageSync('exe');
				    if (value) {
				        this.uid=value.uid;
						this.title=value.title;
						this.name=value.name;
						this.usertype=value.usertype;
						this.rename=value.rename;
						this.content=value.content;
						this.reid=value.reid;
				    }
				} catch (e) {
				    // error
				}
			},
		}
	}
</script>

<style lang="scss">
@import"../../common/css/mycss.scss";
@import '../../node_modules/highlight.js/styles/xcode.css';
@import"../../common/css/coding.scss";
	
</style>
