'use strict';

var User = require('../models/user');
//var Task = require('../models/task');
//var sendEmail = require('../lib/send-email');

exports.auth = function(req, res){
  res.render('user/auth', {title:'User Authentication'});
};

exports.show = function(req, res){
  console.log('USER'+req.params.user);
  User.findByName(req.params.user, function(user){
    console.log(req.params.user);
    res.send({user:user});
  });
};

exports.create = function(req, res){
  console.log('USERS EXPORTS CREATE: ', req.body);
  var newUser = new User(req.body);
  newUser.register(function(err, body){
    if (!err){
      res.render('user/auth', {title: 'Welcome New User! Please Login.'});//reminder: we cannot do res.redirect AND pass in a title or other objs like this
    } else {
      res.render('user/auth', {title: 'Registeration Error. Try Again.'});
    }
  });
};

exports.login = function(req, res){
  User.findByEmailAndPassword(req.body.email, req.body.password, function(user){
    if(user._id){
      req.session.regenerate(function(){
        req.session.userId = user._id.toString();
        req.session.save(function(){
          res.redirect('/');
        });
      });
    }else{
      req.session.destroy(function(){
        res.send({success:false, error:'Email or password incorrect.'});
      });
    }
  });
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};

exports.showProfile = function(req, res){
  res.render('user/editProfile', {title:'Edit Profile'});
};

exports.updateUserInfo = function(req, res){
  var id = req.session.userId;
  User.findById(id, function(foundUser){
    foundUser = new User(foundUser);
    User.dupeCheckEmail(req.body.email, function(dupeOkayEmail){
      if (!dupeOkayEmail.response && (dupeOkayEmail.failedOn.toString() === foundUser._id.toString())){
        console.log('Successfully ignored a dupe on the email address.');
        dupeOkayEmail.response = true;
      } else {
        console.log('Failed on a dupe email address and/or the user IDs did not match.');
      }
      User.dupeCheckName(req.body.name, function(dupeOkayName){
        if (!dupeOkayName.response && (dupeOkayName.failedOn.toString() === foundUser._id.toString())){
          console.log('Successfully ignored a dupe on the name.');
          dupeOkayName.response = true;
        } else {
          console.log('Failed on a dupe user name and/or the user IDs did not match.');
        }
        var finalOkay = dupeOkayEmail.response && dupeOkayName.response;
        if (finalOkay){
          if (req.body.name){ //if the user didn't put in a name then this won't be executed
            foundUser.name = req.body.name;
          }
          if (req.body.email){
            foundUser.email = req.body.email;
          }
          foundUser.update(function(){
            res.redirect('/');
          });
        } else {
          res.redirect('/profile'); //need a better way of telling the user that the change didn't work
        }
      });
    });
  });
};

/*
exports.updateFavoriteTeams = function(req, res){
  var id = req.session.userId;
  var newTeams = [];
  User.findById(id, function(foundUser){
    foundUser = new User(foundUser);
    for (var x in req.body){
      if (req.body[x] !== 'noTeam'){
        newTeams.push(req.body[x]);
      }
    }
    foundUser.teams = newTeams;
    foundUser.update(function(){
      res.redirect('/profile');
    });
  });
};
*/
