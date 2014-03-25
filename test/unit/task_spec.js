/* jshint expr:true */
'use strict';

process.env.DBNAME = 'prioTest';
var expect = require('chai').expect;
//var Mongo = require('mongodb');
var Task;
var tasks;

describe('Team', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Task = require('../../app/models/task');
      tasks = global.nss.db.collection('tasks');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      done();
    });
  });

  describe('New', function(){
    it('should create a new Task object', function(){
      var date = new Date();
      //this is how a new task SHOULD look but may not now by default; work on this
      var obj = {description:'Do Laundry', userId:'userId', workload:3, importance:true, date:date, childGroup:[], parentGroup:[], level:0, complete:false};
      var task = new Task(obj);
      expect(task).to.be.instanceof(Task);
    });
  });

  describe('#insert', function(){
    it('should add task to the database', function(done){
      var date = new Date();
      var obj = {description:'Do Laundry', userId:'userId', workload:3, importance:true, date:date, childGroup:[], parentGroup:[], level:0, complete:false};
      var task = new Task(obj);
      task.insert(function(){
        expect(task._id).to.be.ok; //not a good test
        done();
      });
    });
  });

  describe('#destroy', function(){
    it('should remove a task from the database', function(done){
      var date = new Date();
      var obj = {description:'Do Laundry', userId:'userId', workload:3, importance:true, date:date, childGroup:[], parentGroup:[], level:0, complete:false};
      var task = new Task(obj);
      task.insert(function(){
        console.log('task._id', task._id);
        Task.destroy(task._id, function(count){
          expect(count).to.equal(1);
          done();
        });
      });
    });
  });

  describe('#update', function(){
    it('should update the task in the database', function(done){
      var date = new Date();
      var obj = {description:'Do Laundry', userId:'userId', workload:3, importance:true, date:date, childGroup:[], parentGroup:[], level:0, complete:false};
      var task = new Task(obj);
      task.insert(function(){
        task.workload = 2;
        task.update(function(result){
          tasks.findOne({_id: obj._id}, function(err, record){
            done();
          });
        });
      });
    });
  });

  describe('#findById', function(){
    it('should find a task by its id', function(done){
      var date = new Date();
      var obj = {description:'Do Laundry', userId:'userId', workload:3, importance:true, date:date, childGroup:[], parentGroup:[], level:0, complete:false};
      var task = new Task(obj);
      task.insert(function(){
        Task.findById(task._id, function(record){
          expect(record._id).to.be.ok;
          done();
        });
      });
    });
  });

  describe('findAll', function(){
    it('should find all tasks', function(done){
      var date = new Date();
      var obj = {description:'Do Laundry', userId:'userId', workload:3, importance:true, date:date, childGroup:[], parentGroup:[], level:0, complete:false};
      var task = new Task(obj);
      task.insert(function(){
        Task.findAll(function(records){
          expect(records.length).to.equal(1);
          done();
        });
      });
    });
  });

//End of Document
});
