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
  var lobbyId = socket.handshake.query.lobbyId;
  socket.join(lobbyId);

  socket.emit('message', "Salut");

  socket.on('post', function(data, fn){
    var message = data.message;

    mongoose.model('Lobby').findOneAndUpdate({_id:lobbyId}, {$push: {posts:{message:message}}}, function(err,model){
      if(!err){
        socket.broadcast.to(lobbyId).emit('message', {message:message});
      }
    });
  });
});

require('./config/express')(app, config);

server.listen(3001);
app.listen(config.port);
