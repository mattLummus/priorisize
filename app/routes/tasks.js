'use strict';

var Task = require('../models/task');
//var User = require('../models/user');

exports.index = function(req, res){
  Task.findByUserId(req.params.userId, function(tasks){
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
