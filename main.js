import Vue from 'vue'
import App from './App'
//引入socket模块
import io from './component/socket/weapp.socket.io.js'

Vue.config.productionTip = false

//服务器地址
 Vue.prototype.serverUrl='http://10.2.7.244:3000';
 Vue.prototype.socket=io('http://10.2.7.244:8082');
//Vue.prototype.serverUrl='http://192.168.43.146:3000';
//Vue.prototype.socket=io('http://192.168.43.146:8082');

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
