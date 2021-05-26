export default{
	friends:function(){
		let friendata=[
			{
				id:1,
				imgurl:'tx5.jpg',
				tip:2,
				name:'汤家凤',
				time:new Date(),
				message:'我真的是匪夷所思啊，我们读书的时候不这样的'
			},
			{
				id:2,
				imgurl:'tx2.jpg',
				tip:5,
				name:'张宇',
				time:new Date(),
				message:'立即推'
			},
			{
				id:3,
				imgurl:'tx3.jpg',
				tip:0,
				name:'刘晓艳',
				time:new Date(),
				message:'啦啦啦'
			},
			{
				id:4,
				imgurl:'tx4.jpg',
				tip:4,
				name:'李永乐',
				time:new Date(),
				message:'哈哈哈'
			},
			{
				id:5,
				imgurl:'tx2.jpg',
				tip:5342,
				name:'张宇',
				time:new Date(),
				message:'立即推'
			},
			{
				id:6,
				imgurl:'tx3.jpg',
				tip:0,
				name:'刘晓艳',
				time:new Date(),
				message:'啦啦啦'
			},
			{
				id:7,
				imgurl:'tx4.jpg',
				tip:4,
				name:'李永乐',
				time:new Date(),
				message:'哈哈哈哈哈哈哈哈哈哈哈哈'
			},
			{
				id:8,
				imgurl:'tx2.jpg',
				tip:5,
				name:'张宇',
				time:new Date(),
				message:'立即推'
			},
			{
				id:9,
				imgurl:'tx3.jpg',
				tip:0,
				name:'刘晓艳',
				time:new Date(),
				message:'啦啦啦'
			},
			{
				id:10,
				imgurl:'tx4.jpg',
				tip:4,
				name:'李永乐',
				time:new Date(),
				message:'哈哈哈'
			}
		];
		return friendata;
	},
	
	//聊天消息
	message:function(){
		let msgs=[
			{
				id:'a',
				msg:'我真的是匪夷所思',
				types:0,
				time:new Date()-1000,
			},
			{
				id:'a',
				msg:'你怎么睡得着觉的',
				types:0,
				time:new Date()-1000*16,
			},
			{
				id:'b',
				msg:'立即推，放弃考研',
				types:0,
				time:new Date()-1000*60,
			},
			{
				id:'b',
				msg:'10,9,8,7,6,5,4,3,2,1...发射',
				types:0,
				time:new Date()-1000*60*36,
			},
			{
				id:'b',
				msg:'tx5.jpg',
				types:1,
				time:new Date()-1000*60*40,
			},
			{
				id:'a',
				msg:'tx1.jpg',
				types:1,
				time:new Date()-1000*60*60,
			},
			{
				id:'a',
				msg:'你怎么睡得着觉的',
				types:0,
				time:new Date()-1000*16,
			},
			{
				id:'b',
				msg:'立即推，放弃考研',
				types:0,
				time:new Date()-1000*60,
			},
			{
				id:'b',
				msg:'10,9,8,7,6,5,4,3,2,1...发射',
				types:0,
				time:new Date()-1000*60*36,
			},
			{
				id:'b',
				msg:'tx5.jpg',
				types:1,
				time:new Date()-1000*60*40,
			},
			{
				id:'a',
				msg:'tx1.jpg',
				types:1,
				time:new Date()-1000*60*60,
			}
		];
		return msgs;
	}
}