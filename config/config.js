var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'spotted-io'
    },
    port: 3000,
    db: 'mongodb://localhost/spotted-io-development'
    
  },

  test: {
    root: rootPath,
    app: {
      name: 'spotted-io'
    },
    port: 3000,
    db: 'mongodb://localhost/spotted-io-test'
    
  },

  production: {
    root: rootPath,
    app: {
      name: 'spotted-io'
    },
    port: 3000,
    db: 'mongodb://localhost/spotted-io-production'
    
  }
};

module.exports = config[env];
