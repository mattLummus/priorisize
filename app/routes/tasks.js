'use strict';

var Task = require('../models/task');
//var User = require('../models/user');

//will revert back to user tasks later; returning all for dev purposes
exports.index = function(req, res){
  //Task.findByUserId(req.params.userId, function(tasks){
  Task.findAll(function(tasks){
    res.send({tasks:tasks});
  });
};

exports.getTaskById = function(req, res){
  Task.findById(req.params.id, function(team){
    res.send(team);
  });
};

exports.getTaskByName = function(req, res){
  Task.findByName(req.params.name, function(team){
    res.send(team);
  });
};

exports.insert = function(req, res){
  var task = new Task(req.body);
  task.insert(function(err, record){
    res.send(record);
  });
};
