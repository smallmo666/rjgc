export default {
	//首页时间转换
	dateTime(e){
		let old=new Date(e);
		let now=new Date();
		
		let d=old.getTime();
		let h=old.getHours();
		let m=old.getMinutes();
		let Y=old.getFullYear();
		let M=old.getMonth()+1;
		let D=old.getDate();
		
		let nd=old.getTime();
		let nh=old.getHours();
		let nm=old.getMinutes();
		let nY=old.getFullYear();
		let nM=old.getMonth()+1;
		let nD=old.getDate();
		//当天的时间
		if(D===nD&&M===nM&&Y===nY){
			if(h<10){
				h='0'+h;
			}
			if(m<10){
				m='0'+m;
			}
			return h+':'+m;
		}
		//前天的时间
		if(D+1===nD&&M===nM&&Y===nY){
			if(h<10){
				h='0'+h;
			}
			if(m<10){
				m='0'+m;
			}
			return '前天'+h+':'+m;
		}else{
			//大于两天
			return Y+'/'+M+'/'+D;
		}
	},
	//间隔时间差
	spaceTime(old,now){
		old=new Date(old);
		now=new Date(now);
		var told=old.getTime();
		var tnow=now.getTime();
		if(told>(tnow+1000*60*5)){
			return now;
		}else{
			return '';
		}
	},
	
	//聊天时间转换
	dateTime1(e){
		let old=new Date(e);
		let now=new Date();
		
		let d=old.getTime();
		let h=old.getHours();
		let m=old.getMinutes();
		let Y=old.getFullYear();
		let M=old.getMonth()+1;
		let D=old.getDate();
		
		let nd=old.getTime();
		let nh=old.getHours();
		let nm=old.getMinutes();
		let nY=old.getFullYear();
		let nM=old.getMonth()+1;
		let nD=old.getDate();
		//当天的时间
		if(D===nD&&M===nM&&Y===nY){
			if(h<10){
				h='0'+h;
			}
			if(m<10){
				m='0'+m;
			}
			return h+':'+m;
		}
		//昨天的时间
		if(D+1===nD&&M===nM&&Y===nY){
			if(h<10){
				h='0'+h;
			}
			if(m<10){
				m='0'+m;
			}
			return '昨天'+h+':'+m;
		}else if(Y===nY){
			//今年
			if(h<10){
				h='0'+h;
			}
			if(m<10){
				m='0'+m;
			}
			return M+'月'+D+'日 '+h+':'+m;
		}else{
			//今年之前
			if(h<10){
				h='0'+h;
			}
			if(m<10){
				m='0'+m;
			}
			return Y+'年'+M+'月'+D+'日 '+h+':'+m;
		}
	}
}