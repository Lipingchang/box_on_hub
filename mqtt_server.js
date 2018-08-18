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


// 要另外保存的数据的topic:
saving_one = "daily1";
// fired when a message is received
server.on('published', function(packet, client) {
  //console.log('Published topic:', packet.topic,' payload:',decoder.write(Buffer.from(packet.payload))); // packet.payload.toString()
  // 另外保存:
  if(saving_one == packet.topic){
    saveMessageToDB(packet.payload.toString());
  }
});


// 另外保存 数据的mongodb的客户端: ===============================================================================================
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://10.66.4.189:27017/mqtt";
var collection_handle = null;

// 链接数据库,然后取出链接好的 collection:
MongoClient.connect(url, function(err, db) {
  if(err){
    console.log('connect to mqtt db fail!!');
    throw err;
  }else{
    console.log('db connected!!');
    collection_handle = db.collection(saving_one); 
  }
});
// 把传入的字符串 解析成json,然后加上时间标签,保存到数据库中.
function saveMessageToDB(save_str){
  json = JSON.parse(save_str);
  json.timestamp = parseInt(Date.parse(new Date())/1000);
  collection_handle.insert(json,function(err,result){
    if( err ){
      console.log("err:",err);
    }
  });
}

server.on('ready', function(){
  console.log('Mosca server is up and running');

});


//https://www.npmjs.com/package/mqtt
//https://github.com/mcollina/mosca
//https://segmentfault.com/a/1190000009536199
