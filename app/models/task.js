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
  this.endDate = task.endDate;
  //need to fix this by adding a hidden input on create task form
  this.startDate = task.startDate || new Date();
  this.childGroup = task.childGroup;
  this.parentId = task.parentId;
  this.level = task.level;
  this.complete = task.complete || false;
  //dependent upon other tasks
  this.dependencies = task.dependencies || [];
  //other tasks that depend on this task
  this.dependents = task.dependents || [];
  this.priorityValue = task.priorityValue || 0;
}

Task.prototype.insert = function(fn){
  var self = this;
  tasks.insert(self, function(err, records){
    fn(err, records);
  });
};

Task.destroy = function(id, fn){
  var _id = Mongo.ObjectID(id.toString());
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
  var _id = new Mongo.ObjectID(id.toString());
  tasks.findOne({_id:_id}, function(err, record){
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
