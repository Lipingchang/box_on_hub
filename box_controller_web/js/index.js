var app = new Vue({
	el:"#app",
	data: {
		a: 1,
		message:4,
		k:3
	}
});

axios({
  method:'get',
  url:'http://10.66.4.189:12138/daily_buff',
  responseType:'json'
})
.then(function(response) {
    console.log(response.data)
  });