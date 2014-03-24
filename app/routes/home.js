'use strict';

exports.index = function(req, res){
  res.render('home/index', {title: 'Express Template', userId:req.session._id});
};

exports.admin = function(req, res){
  res.render('home/admin', {title: 'Admin Portal'});
};
