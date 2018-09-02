// var path = require('path');
// var express = require('express');
// var app = express();

// // app.all('*', function(req, res, next) {
// //     res.header("Access-Control-Allow-Origin", "*");
// //     res.header("Access-Control-Allow-Headers", "X-Requested-With");
// //     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
// //     res.header("X-Powered-By",' 3.2.1')
// //     res.header("Content-Type", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8");
// //     next();
// // });

// // 设置静态资源文件的访问目录
// app.use("/wx/",express.static( path.join(__dirname,'box_controller_web')));

// app.listen(12140, function() {
//  console.log('App listening at port 12140;');
// });
var PORT = 12140;//

var http = require('http');
var url=require('url');
var fs=require('fs');
var mine=require('./mine').types;//
var path=require('path');

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var realPath = path.join("./box_controller_web", pathname);    //这里设置自己的文件名称;
    console.log(realPath);

    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {

                var contentType = mine[ext] || "text/plain";
                response.writeHead(200, {
                    'Content-Type': contentType,
					"Access-Control-Allow-Origin":"*",
					"Access-Control-Allow-Headers":"X-Requested-With",
					"Access-Control-Allow-Methods":"PUT,POST,GET,DELETE,OPTIONS",
					"X-Powered-By":' 3.2.1'
                });

                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {

                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");
