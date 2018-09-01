var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://10.66.4.189')
 
client.on('connect', function () {
	console.log('server connected!')
})
client.on('error',function(){
	console.log('server dis connected! error !')
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log("get a topic:",topic,"content:",message.toString())
  //client.end()
})
client.publish('topic1','heeeee',{qos:0,retain:false,dup:false},function(){
	console.log('send over..');
	client.end();
});

