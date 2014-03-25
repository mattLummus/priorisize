'use strict';

/*
var _ = require('lodash');

var fs = require('fs');
var path = require('path');
*/

var User;
var users = global.nss.db.collection('users');
//var email = require('../lib/send-email');
var bcrypt = require('bcrypt');
var Mongo = require('mongodb');
module.exports = User;

function User(user){
  this._id = user._id ? Mongo.ObjectID(user._id.toString()) : undefined;
  this.email = user.email;
  this.password = user.password;
  this.name = user.name;
}

/*
User.prototype.register = function(fn){
  var self = this;
  hashPassword(self.password, function(hashed){
    self.password = hashed;
    User.dupeCheckEmail(self.email, function(dupeResult){
      if (dupeResult.response){ //dupeCheck will return true on .response if there is NOT a duplicate email in the DB
        User.dupeCheckName(self.name, function(dupeResult){
          if (dupeResult.response){
            insert(self, function(err, inserted){
              email.sendWelcome({to:self.email, name:self.name}, function(err, body){
                fn(err, body);
              });
            });
          } else {
            fn('You tried to register a duplicate user (failed because of duplicate name).');
          }
        });
      } else {
        fn('You tried to register a duplicate user (failed because of duplicate email).');
      }
    });
  });
};
*/

User.prototype.register = function(fn){
  var self = this;
  hashPassword(self.password, function(hashed){
    self.password = hashed;
    User.dupeCheckEmail(self.email, function(dupeResult){
      if (dupeResult.response){ //dupeCheck will return true on .response if there is NOT a duplicate email in the DB
        User.dupeCheckName(self.name, function(dupeResult){
          if (dupeResult.response){
            insert(self, function(err, inserted){
              fn(err);
              //email.sendWelcome({to:self.email, name:self.name}, function(err, body){
              //  fn(err, body);
              //});
            });
          } else {
            fn('You tried to register a duplicate user (failed because of duplicate name).');
          }
        });
      } else {
        fn('You tried to register a duplicate user (failed because of duplicate email).');
      }
    });
  });
};

function hashPassword(password, fn){
  bcrypt.hash(password, 8,function(err, hash){
    fn(hash);
  });
}

User.dupeCheckEmail = function(email, fn){
  users.findOne({email:email}, function(err, foundUser){
    if (foundUser === null){
      fn({response:true});
    } else {
      fn({response:false, failedOn:foundUser._id});
    }
  });
};

User.dupeCheckName = function(name, fn){
  users.findOne({name:name}, function(err, foundUser){
    if (foundUser === null){
      fn({response:true});
    } else {
      fn({response:false, failedOn:foundUser._id});
    }
  });
};

function insert(user, fn){
  users.insert(user, function(err, record){
    fn(err);
  });
}

User.findById = function(id, fn){
  if(id !== undefined){id = id.toString();}
  var _id = new Mongo.ObjectID(id);
  users.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

User.findByName = function(name, fn){
  users.findOne({name:name}, function(err, record){
    fn(record);
  });
};

User.findByEmailAndPassword = function(email, password, fn){
  users.findOne({email:email}, function(err, record){
    if(record){
      bcrypt.compare(password, record.password, function(err, result){
        if(result){
          fn(record);
        }else{
          fn(false);
        }
      });
    }else{
      fn(false);
    }
  });
};

User.findByEmail = function(email, fn){
  users.findOne({email:email}, function(err, record){
    fn(record);
  });
};

User.prototype.update = function(fn){
  var self = this;
  users.update({_id:this._id}, this, function(err, count){
    User.findById(self._id.toString(), function(record){
      fn(record);
    });
  });
};
