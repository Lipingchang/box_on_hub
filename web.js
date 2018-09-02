var express = require('express');
var app = express();




// 控制器状态的buf.
var state_buff = {
	fan1:0,
	sprayer1:0,
	fan1_timestamp:parseInt(Date.parse(new Date())/1000),
	sprayer1_timestamp:parseInt(Date.parse(new Date())/1000),
}
var daily_temp_buff = {
	info:"not init.."
}

state_return_topic = "esp8266_1_lowbee";
send_cmd_topic = "cmd_1";
daily_temp_topic = "daily1";

var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://10.66.4.189');
client.on('connect',function(){
	console.log('mqtt broker connected!')
	client.subscribe(state_return_topic,0,function(err,granted){
		console.log('granted: topic ',granted[0].topic);
	});
	client.subscribe(daily_temp_topic,0,function(err,granted){
		console.log('granted:topic ',granted[0].topic);
	})
});

// 收到消息的处理:
client.on('message', function (topic, message) {
  // message is Buffer
  //console.log( 'get message:topic:',topic,' message:',message.toString());
  // 当topic时当前监听的state:
  if(topic == state_return_topic){
  	// 分离出设备名字和状态(0/1)
  	message = message.toString();
  	device_name = message.split(":")[0];
  	device_state = message.split(":")[1];
  	if( state_buff[device_name] == undefined ){
  		console.log('get a unregister device_name:',device_name);
  	}else{
  		// 修改缓存.
  		console.log(device_name," update state.:",device_state);
  		state_buff[device_name] = device_state;
  		state_buff[device_name+"_timestamp"]=parseInt(Date.parse(new Date())/1000);
  	}
  }
  if(topic == daily_temp_topic ){
  	console.log('update daily_temp...');
  	daily_temp_buff.info = JSON.parse(message.toString());
  	daily_temp_buff.timestamp = parseInt(Date.parse(new Date())/1000);
  }
});

// app.use('/',function(req,res,next){
// 	res.send('https://docs.mongodb.com/master/tutorial/install-mongodb-on-debian/?_ga=2.240331395.1481345858.1532950961-1063278553.1525637825')
	
// });
// app.use('/state',function(req,res,next){
// 	// 获取fan1 sprayer1 的状态.
// 	// 1.发cmd_1 sprayer1_state/fan1_state
// 	// 2.监听返回的 第一个 esp8266_1_lowbee  --> 这个是clinet的callback做的.
// 	client.publish(send_cmd_topic,'fan1_state',function(err){
// 		if(err){
// 			res.send('fail1... refresh please.');
// 		}else{
// 			client.publish(send_cmd_topic,'sprayer1_state',function(err){
// 				if(err){
// 					res.send('fail2.. refresh please.');
// 				}else{
// 					res.send('ok');
// 				}
// 			});	
// 		}
// 	});
// 	// todo 把上面的改成promise的.
// });
// app.get('/fan1_state',function (req,res,ne) {
// 	client.publish(send_cmd_topic,'fan1_state',function (err) {
// 		if(err){
// 			res.send('fail..');
// 		}else{
// 			res.send({"mqttsendtime:":parseInt(Date.parse(new Date())/1000)});
// 		}
// 	})
// });
// app.get('/sprayer1_state',function(req,res,next){
// 	client.publish(send_cmd_topic,"sprayer1_state",function (err) {
// 		if(err){
// 			res.send('faill..');
// 		}else{
// 			res.send({"mqttsendtime":parseInt(Date.parse(new Date())/1000)});
// 		}
// 	})
// });
var path = require('path');
//设置跨域访问
app.all('/*', function(req, res, next) {
    console.log('set header!!');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


//app.use(express.static( path.join(__dirname,'box_controller_web')));



app.get("/state_buff",function(req,res,next){
	res.send(state_buff);
});
app.get("/daily_buff2",function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    console.log('set daily_head');
	res.send(daily_temp_buff);
});
app.get("/sendcmd",function(req,res,next){   // http://localhost:12138/sendcmd?cmd=hhh
	client.publish(send_cmd_topic,req.query.cmd,function(err){
		if(err){
			res.send('faill');
		}else{
			res.send({'yourcmd:':req.query.cmd,ok:true,"timestamp":Date.parse(new Date())/1000});
		}
	})
});

app.listen(12138, function() {
 console.log('App listening at port 12138;');
});
