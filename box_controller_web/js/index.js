var app = new Vue({
	el:"#app",
	data: {
		dht22_1_info:,
		dht11_1_info,
		dht11_2_info,
	}
});

axios({
  method:'get',
  url:'http://10.66.4.189:12138/daily_buff',
  responseType:'json'
})
.then(function(response) {
    console.log(response.data)});