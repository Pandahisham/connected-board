var express = require('express'),
  config = require('./config/config'),
  glob = require('glob');


var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.on('startDrawing', function (data) {
    io.sockets.emit('startDrawing', {uid: data.uid, point: data.point});
  });

  socket.on('drawing', function(data){
    io.sockets.emit('drawing', {uid: data.uid, point: data.point});
  });

  socket.on('stopDrawing', function (data) {
    io.sockets.emit('stopDrawing', {uid: data.uid});
  });
});

require('./config/express')(app, config);

server.listen(process.env.PORT || 5001);
//app.listen(process.env.PORT || 5000);
