var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
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

server.listen(3001);
app.listen(config.port);
