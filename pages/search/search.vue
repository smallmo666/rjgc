//搜索页面，还没写
<template>
	<view class="content">
		<view class="top-bar">
			<view class="search-div">
				<image src="../../static/image/element/search.jpeg" class="search-img"></image>
				<input type="search" placeholder="搜索用户/群" class="search" placeholder-style="color:#aaa;font-weight:400;"@blur="getUser"/>
			</view>
			<view class="top-bar-right">
				<view class="text">取消</view>
			</view>
		</view>
		<view class="main">
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	@import"../../common/css/mycss.scss";
	.search-div{
		position: absolute;
		top:0;
		left: 0;
		width: 100%;
		z-index: -1;
		box-sizing: border-box;
		padding: 14rpx 110rpx 14rpx $uni-spacing-col-base;
	}
	.search{
		padding: 0 60rpx 0 40rpx;
		height: 60rpx;
		background: $uni-bg-color-grey;
		border-radius: 10rpx;
	}
	.search-img{
		position: absolute;
		right: 128rpx;
		top:22rpx;
		width: 40rpx;
		height: 40rpx;
	}
	.top-bar-right{
		padding-top: 20rpx;
		padding-left: 40rpx;
	}
</style>
