/*jshint loopfunc: true */
'use strict';

module.exports = Task;
var tasks = global.nss.db.collection('tasks');
var Mongo = require('mongodb');
//var _ = require('lodash');
//var fs = require('fs');
//var path = require('path');

function Task(task){
  this._id = task._id;
  this.description = task.description;
  this.userId = task.userId;
  this.workload = task.workload;
  this.importance = task.importance;
  this.date = task.date;
  this.childGroup = task.childGroup;
  this.parentGroup = task.parentGroup;
  this.level = task.level;
  this.complete = task.complete;
}

Task.prototype.insert = function(fn){
  var self = this;
  tasks.insert(self, function(err, records){
    fn(err, records);
  });
};

Task.destroy = function(id, fn){
  var _id = Mongo.ObjectID(id);
  tasks.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

Task.prototype.update = function(fn){
  var self = this;
  tasks.update({_id: self._id}, self, function(err, result){
    fn(result);
  });
};

Task.findById = function(id, fn){
  var _id = new Mongo.ObjectID(id);
  tasks.findOne({_id:_id}, function(err, record){
    console.log(_id);
    console.log(record);
    fn(record);
  });
};

Task.findAll = function(fn){
  tasks.find().toArray(function(err, records){
    fn(records);
  });
};

Task.findByUserId = function(userId, fn){
  tasks.findOne({userId:userId}, function(err, records){
    console.log(records);
    fn(records);
  });
};
