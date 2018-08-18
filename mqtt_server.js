var mosca = require('mosca');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf-8');

// 原来的数据库的名字是: ascoltatori',
var mongodbSetting = {
  type:'mongo',
  url:'mongodb://10.66.4.189:27017/mqtt',
  pubsubCollection:"mqtt_sub_pub_log",
  mongo:{}
}

var settings = {
  port: 1883,
  backend: mongodbSetting
};

var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected,client id:', client.id);
});


// 要保存的数据的topic:
saving_one = "daily_1";
// fired when a message is received
server.on('published', function(packet, client) {
  console.log(' Published topic:', packet.topic,' payload:',decoder.write(Buffer.from(packet.payload))); // packet.payload.toString()
  if(saving_one == packet.topic){
    saveMessageToDB(packet.payload.toString);
  }
});

//  ===============================================================================================
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://10.66.4.189:27017/mqtt";
var collection_handle = null;
MongoClient.connect(url, function(err, db) {
  if(err){
    console.log('connect to mqtt db fail!!');
    throw err;
  }else{
    console.log('db connected!!');
    collection_handle = db.collection(saving_one); 
  }
});
function saveMessageToDB(save_str){
  json = JSON.parse(save_str);
  console.log(json);
  json.timestamp = parseInt(Date.parse(new Date())/1000);
  collection_handle.insert(json,function(err,result){
    console.log('err:',err," result:",result);
  });
}

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}
//https://www.npmjs.com/package/mqtt
//https://github.com/mcollina/mosca
//https://segmentfault.com/a/1190000009536199
