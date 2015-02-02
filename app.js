var express = require('express'),
  config = require('./config/config'),
  mongoose = require('mongoose'),
  glob = require('glob'),
  db = mongoose.connection,
  models = glob.sync(config.root + '/model/*.js'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io')(server),
  artistCount = 0;

mongoose.connect(config.db);

db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

models.forEach(function (model) {
  require(model);
});

var Board = mongoose.model('Board');

io.on('connection', function (socket) {

  Board.find({}, function(err, board){
    io.emit('history', {board: board})
  });

  artistCount++;
  io.sockets.emit('artistCount', {count: artistCount});

  socket.on('startDrawing', function (data) {
    io.sockets.emit('startDrawing', {uid: data.uid, point: data.point, color: data.color, size: data.size});
  });

  socket.on('drawing', function(data){
    io.sockets.emit('drawing', {uid: data.uid, point: data.point});
  });

  socket.on('stopDrawing', function (data) {
    Board.create({uid: data.uid, element: data.path}, function(err, board){
      if(err){
        console.error(err);
      }else{
        console.log("["+data.uid+"] added path");
      }
    });

    io.sockets.emit('stopDrawing', {uid: data.uid});
  });

  socket.on('undo', function (data) {
    Board.findOne({uid: data.uid},{}, { sort: { 'created_at' : -1 } },function(err, element){
      if(err){
        console.error(err);
      }else{
        if(element != null){
          Board.findOneAndRemove({_id:element._id}, function(err){
            if(err) console.error(err);
          });
        }
      }
    });

    io.sockets.emit('undo', {uid: data.uid});
  });

  socket.on('disconnect', function (){
    artistCount--;
    io.sockets.emit('artistCount', {count: artistCount});
  });
});

require('./config/express')(app, config);

server.listen(process.env.PORT || 3000);
