var mosca = require('mosca');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf-8');

var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var settings = {
  port: 1883,
  backend: ascoltatore
};

var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected,client id:', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log(client.id , ' Published topic:', packet.topic,' payload:',decoder.write(Buffer.from(packet.payload))); // packet.payload.toString()
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}
//https://www.npmjs.com/package/mqtt
//https://github.com/mcollina/mosca
//https://segmentfault.com/a/1190000009536199