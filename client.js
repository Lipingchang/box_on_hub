var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://10.66.4.189');//连接到服务端

 
setInterval(function() {
	//发布主题为Test的消息
	client.publish('test',JSON.stringify(qtt),{qos:1,retain:true});//hello mqtt + num++
