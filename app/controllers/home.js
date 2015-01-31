var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', home);

function home(req, res, next) {
  res.render('index');
}
