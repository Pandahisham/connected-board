var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'connected-board'
    },
    port: 3000,
    db: 'mongodb://localhost/connected-board-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'connected-board'
    },
    port: 3000,
    db: 'mongodb://localhost/connected-board-development'
  },

  production: {
    root: rootPath,
    app: {
      name: 'connected-board'
    },
    port: 3000,
    db: 'mongodb://localhost/connected-board-development'
  }
};

module.exports = config[env];
