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

//sends two versions of data - one for tree layout and one for cluster layout
exports.clusterTest = function(req, res){
  Task.findAll(function(tasks){
    if(tasks.length>0){
      var taskArray = [];
      for(var i=0; i<tasks.length; i++){
        var data = tasks[i];
        var task = {};
        var colors = ['green', 'yellow', 'red'];
        task.name = data.description;
        task.color = colors[data.workload-1];
        task.size = data.workload;
        task._id = data._id;
        taskArray.push(task);
      }
      res.send({tasks:taskArray});
    }
    else{res.send({msg:'no tasks'});}
  });
};

exports.graph = function(req, res){
  var data = {'name':'Root', 'children':[
    //testing
    {'name':'Testing', 'color':'red', 'size':193800, 'children':[
      {'name':'Unit', 'color':'red', 'children':[
        {'name':'user_spec', 'color':'red', 'size':193800},
        {'name':'task_spec', 'color':'red', 'size':181200}
      ]},
      {'name':'Acceptance', 'children':[
        {'name':'users_spec', 'size':153400},
        {'name':'tasks_spec', 'size':273100}
      ]},
      {'name':'qUnit', 'children':[
        {'name':'main.js', 'size':153400},
        {'name':'AI.js', 'size':153400}
      ]}
    ]},
    //front end
    {'name':'Front End', 'children':[
      {'name':'CSS', 'children':[
        {'name':'Animations', 'size':193800},
        {'name':'Style', 'size':181200}
      ]},
      {'name':'JS', 'children':[
        {'name':'main.js', 'size':153400},
        {'name':'d3', 'size':273100},
        {'name':'AI', 'size':273100},
        {'name':'UI', 'size':273100}
      ]},
      {'name':'HTML', 'children':[
        {'name':'index', 'size':153400},
        {'name':'auth', 'size':153400},
        {'name':'edit-profile', 'size':153400}
      ]}
    ]},
    {'name':'Server Side', 'children':[
      {'name':'Models', 'children':[
        {'name':'user.js', 'size':193800},
        {'name':'task.js', 'size':181200}
      ]},
      {'name':'Routes', 'children':[
        {'name':'users.js', 'size':153400},
        {'name':'tasks.js', 'size':273100},
        {'name':'home.js', 'size':273100}
      ]},
      {'name':'Utility', 'children':[
        {'name':'init-routes', 'size':153400},
        {'name':'bounce-user', 'size':153400},
        {'name':'socket.io', 'size':153400}
      ]}
    ]}

  ]};
  res.send(data);
};

exports.graph2 = function(req, res){
  var data = {'nodes': [
    {'name': 'root', 'color':'#f0db58'},                 // 0  root
    {'name': 'Testing', 'color':'#ed4747'},             // 1  branch 1
    {'name': 'Unit Tests', 'color':'#ed4747'},        // 2  branch 1.a
    {'name': 'Acceptance', 'color':'#f0db58'},        // 3  branch 1.b
    {'name': 'Front End', 'color':'#7ad86b'},           // 4  branch 2
    {'name': 'CSS', 'color':'#7ad86b'},            // 5  branch 2.a
    {'name': 'jQuery', 'color':'#f0db58'},           // 6  branch 2.b
    {'name': 'D3', 'color':'#7ad86b'},            // 7  branch 2.c
    {'name': 'Back End', 'color':'#f0db58'}, //8 3.a
    {'name': 'Routes', 'color':'#7ad86b'}, //9 3.b
    {'name': 'Models', 'color':'#ed4747'} //10, 3.c
  ],
    'links': [
      {'source': 0, 'target': 1},
      {'source': 1, 'target': 2},
      {'source': 1, 'target': 3},
      {'source': 0, 'target': 4},
      {'source': 4, 'target': 5},
      {'source': 4, 'target': 6},
      {'source': 4, 'target': 7},
      {'source': 0, 'target': 8},
      {'source': 8, 'target': 9},
      {'source': 8, 'target': 10}
    ]};
  res.send(data);
};

/*
exports.graph3 = function(req, res){
  var data = {'nodes':[
    {'name': 'Record Album', 'color': 'green', 'size': '4.5', '_id': }
    {'name': 'Drums', 'color': 'red', 'size': '3.5', '_id': }
    {'name': , 'color': , 'size': , '_id': }
    {'name': , 'color': , 'size': , '_id': }
    {'name': , 'color': , 'size': , '_id': }
}
*/


exports.getTaskById = function(req, res){
  Task.findById(req.params.id, function(task){
    res.send(task);
  });
};

exports.getTaskByName = function(req, res){
  Task.findByName(req.params.name, function(task){
    res.send(task);
  });
};

exports.insert = function(req, res){
  var task = new Task(req.body);
  task.insert(function(err, record){
    res.redirect('/');
  });
};
