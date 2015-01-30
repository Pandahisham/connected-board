var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Lobby = mongoose.model('Lobby');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', home);
router.get('/lobby/:title', getLobby);

function home(req, res, next) {
  res.render('index');
}

function getLobby(req, res, next) {
  var title = req.param('title');

  Lobby.findOne({title:title}, function(err, lobby){
    if(err) res.send(400,err);
    else if(lobby) res.render('lobby',lobby);
    else {
      Lobby.create({title:title}, function(err, lobby){
        if(err) res.send(400,err);
        else res.render('lobby',lobby);
      });
    }
  })
}
