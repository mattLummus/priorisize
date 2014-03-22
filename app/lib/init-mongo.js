'use strict';

var MongoClient = require('mongodb').MongoClient;
<<<<<<< HEAD
var mongoUrl = 'mongodb://localhost/' + process.env.DBNAME;
=======
var mongoUrl = 'mongodb://10.0.1.4/' + process.env.DBNAME;
>>>>>>> 0852aa7ac11b2664b0d24c84a77115b81438376a
var initialized = false;

exports.connect = function(req, res, next){
  if(!initialized){
    initialized = true;
    exports.db(next);
  }else{
    next();
  }
};

exports.db = function(fn){
  MongoClient.connect(mongoUrl, function(err, db) {
    if(err){throw err;}
    global.nss = {};
    global.nss.db = db;
    console.log('Connected to MongoDB');
    fn();
  });
};
