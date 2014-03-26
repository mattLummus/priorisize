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

exports.graph = function(req, res){
  var graph = {'name':'Project', 'children':[
    //testing
    {'name':'Testing', 'children':[
      {'name':'Unit', 'children':[
        {'name':'user_spec', 'size':193800},
        {'name':'task_spec', 'size':181200}
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
  res.send(graph);
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
