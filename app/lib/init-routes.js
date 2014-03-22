'use strict';

var d = require('../lib/request-debug');
var initialized = false;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = require('../routes/home');
  var users = require('../routes/users');

  app.get('/', d, home.index);
  app.get('/admin', d, home.admin);
  app.post('/register', d, users.create);
  app.post('/login', d, users.login);
  app.post('/logout', d, users.logout);
  console.log('Routes Loaded');
  fn();
}
