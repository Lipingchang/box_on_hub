var express = require('express');
var app = express();

app.use('/',function(req,res,next){
	res.send('https://docs.mongodb.com/master/tutorial/install-mongodb-on-debian/?_ga=2.240331395.1481345858.1532950961-1063278553.1525637825')
	
});
app.listen(12138, function() {
 console.log('App listening at port 12138;');
});
