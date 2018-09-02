"use strict" 

Vue.component('sensor-show',{
	props:['sensorname','tmp','hum'],
	template:'<div><span><b>{{sensorname}}:</b>tmp:{{tmp}};hum:{{hum}}</span></div>'
})

var app = new Vue({
	el:"#app",
	data: {
		dht22_1_info:1,
		dht11_1_info:2,
		dht11_2_info:3,
		daily_buff_fresh_time:"not update..",
		sensor_data:[],
		time: '',
        date: ''
	},
	mounted: function () { 
		setInterval(this.getdailybuffer, 2000);
	},
	methods:{
		getdailybuffer:function(){
			let that = this;
			axios({
			  method:'get',
			  url:'http://10.66.4.189:12138/state_buff',
			  responseType:'json'
			})
			.then(function(response) {
			    //console.log(response.data);

			    let timestamp = response.data.timestamp;
			    let date = new Date(parseInt(timestamp)*1000);
				let Y = date.getFullYear() + '-';
				let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
				let D = date.getDate() + " || ";
				let h = date.getHours() + ':';
				let m = date.getMinutes() + ':';
				let s = date.getSeconds();
				that.daily_buff_fresh_time = h+m+s;

			    let info = response.data.info;
			    that.dht22_1_info = {tmp:info['22temp_1'],hum:info['22hum_1']};
			    that.dht11_1_info = {tmp:info['11temp_2'],hum:info['11hum_2']};
			    that.dht11_2_info = {tmp:info['11temp_3'],hum:info['11hum_3']};

			    that.sensor_data.pop();
			    that.sensor_data.pop();
			    that.sensor_data.pop();
			    that.sensor_data.push({name:"dht22_1",tmp:info['22temp_1'],hum:info['22hum_1'],id:1});
			    that.sensor_data.push( {name:"dht11_2",tmp:info['11temp_2'],hum:info['11hum_2'],id:2} );
			    that.sensor_data.push(  {name:"dht11_3",tmp:info['11temp_3'],hum:info['11hum_3'],id:3} );



			})
			.catch(function(response){
				//console.log('fuck!',response);

			});
		}
	}
});


var controlapp = new Vue({
	el:"#controlapp",
	data: {
		isFanOn:false,
		isConnect:true,
		isChanging:false,
		reconnect_time:5,
		isVisiable:false,
		reconnectInterval:false,
		reconnectIntervalNumber:0
	},
	computed: {	     
	    button_text:function(){
	    	if( this.isConnect ){
		    	return this.isFanOn ? "is on " : "is off";
	    	}else{
	    		return "not connect!"
	    	}
	    },
	    isBtnDisabled:function(){
	    	return this.isConnect ? false : true;
	    },
	    buttoncolor:function(){
	    	let isFanOn = this.isFanOn;
	    	return {"button-rounded":true,"button":true,"button-action":isFanOn,"button-caution":isFanOn==false,"button-glow":isFanOn}
	    }
	},
	watch:{
		isConnect:function(pre,after){
			console.log('isConnect changed!!j');
			let that = this;
			if( this.isConnect ){
				clearInterval(this.reconnectIntervalNumber);
				clearInterval(this.reconnectIntervalTimeNumber);
				this.isVisiable = false;
			}else{
that.reconnect_time = 5;
				this.isVisiable = true;
				this.reconnectIntervalNumber = setInterval(this.reconnectLoop,5000);
				this.reconnectIntervalTimeNumber = setInterval(function(){that.reconnect_time=that.reconnect_time-1;},1000);
			}
		}
	},
	mounted: function () { 
		this.getFan1State();
	},
	methods:{
		getFan1State:function(){
			let that = this;
			let cmdstamp;
			axios({
			  method:'get',
			  url:'http://10.66.4.189:12138/sendcmd?cmd=fan1_state',
			  responseType:'json'
			})
			.then(function(response) {
				// 成功发送命令.
			    console.log(response.data);
			    cmdstamp = parseInt(response.data.timestamp);
			    return axios({
			    	method:'get',
			    	url:'http://10.66.4.189:12138/daily2_buff',
			    	responseType:'json'
			    })
			})
			.then(function(stateresponse){
				console.log(stateresponse.data);
				let timestamp = parseInt(stateresponse.data.fan1_timestamp);
				if( timestamp == cmdstamp ){
					// 发送命令后返回的 时间戳 和现在 获得的时间戳 相同:
					that.isConnect = true;
					that.isFanOn = parseInt(stateresponse.data.fan1)==0 ? false : true;
				}else{
					return new Promise(function(solve,reject){reject({cmd:cmdstamp,state:timestamp})});
				}
			})
			.catch(function(a){
				console.log("err,",a);
				that.isConnect = false;
			});
		},
		changefanstate:function(){
			this.isConnect = false;
			let that = this;
			let tostate = this.isFanOn ? "offfan1":"onfan1";
			axios({
				method:'get',
				url:'http://10.66.4.189:12138/sendcmd?cmd='+tostate,
				responseType:'json'
			})
			.then(function(response){
				that.getFan1State()
			})
			.catch(function(err){
				console.log('err',err);
				that.reconnectInterval = true;
			})
		},
		reconnectLoop:function(){
			this.getFan1State();
		}
	}
});



var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
var timerID = setInterval(updateTime, 1000);
updateTime();
function updateTime() {
    var cd = new Date();
    app.time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2);
    app.date = zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth()+1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()];
};

function zeroPadding(num, digit) {
    var zero = '';
    for(var i = 0; i < digit; i++) {
        zero += '0';
    }
    return (zero + num).slice(-digit);
}