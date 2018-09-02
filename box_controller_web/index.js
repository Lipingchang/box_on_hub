axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/json';


var app = new Vue({
	el:"#app",
	data: {
		dht22_1_info:1,
		dht11_1_info:2,
		dht11_2_info:3,
	},
	methods:{
		getdailybuffer:function(){
			axios({
			  method:'get',
			  url:'http://10.66.4.189:12138/daily_buff',
			  responseType:'json'
			})
			.then(function(response) {
			    console.log(response.data)

			})
			.catch(function(response){
				console.log(response);
			});
		}
	}
});

