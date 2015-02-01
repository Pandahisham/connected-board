var express = require('express'),
  config = require('./config/config'),
  glob = require('glob');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var artistCount = 0;

io.on('connection', function (socket) {
  artistCount++;
  io.sockets.emit('artistCount', {count: artistCount});

  socket.on('startDrawing', function (data) {
    io.sockets.emit('startDrawing', {uid: data.uid, point: data.point, color: data.color, size: data.size});
  });

  socket.on('drawing', function(data){
    io.sockets.emit('drawing', {uid: data.uid, point: data.point});
  });

  socket.on('stopDrawing', function (data) {
    io.sockets.emit('stopDrawing', {uid: data.uid});
  });

  socket.on('undo', function (data) {
    io.sockets.emit('undo', {uid: data.uid});
  });

  socket.on('disconnect', function (){
    artistCount--;
    io.sockets.emit('artistCount', {count: artistCount});
  });
});

require('./config/express')(app, config);

server.listen(process.env.PORT || 5001);
//app.listen(process.env.PORT || 5000);
