/* jshint unused:false, loopfunc:true */
/* global d3:true */
(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    receiveData();
    checkData();
  }

  function checkData(){
    $.getJSON('/tasks/find', checkLog);
  }

  function checkLog(data){
    console.log('checkData', data);
  }

  function receiveData(){
    var uid = $('#uid').val();
    //var url = '/tasks/user/'+uid;
    var url = '/tasks/find';
    $.getJSON(url, logger);
  }

  function logger(data){
    console.log('data received', data);
    if(data.tasks.length>0){
      calculatePriority(data);
    }
    else{console.log('No Tasks Found');}
  }


  //CALCULATIONS
  //sends to sortColors(data)
  function calculatePriority(data){
    var tasks = data.tasks;
    var newTasks = [];
    var adjustedWorkload, dependencyFactor, dependencyMultiplier, totalWorkload;
    var cwkArray, childWorkload, childQuantity, impFactor;
    var urgency, urgencyValue;
    var priorityValue;

    for(var y=0; y<tasks.length; y++){
      var tempTask = tasks[y];
      cwkArray = [];
      if(tempTask.childGroup){childQuantity = tempTask.childGroup.length || 0;}
      else if(!tempTask.childGroup){childQuantity = 0;}
      for(var z=0; z<childQuantity; z++){
        var tempCheck = tempTask.childGroup[z].toString();
        var tempChild = _.filter(tasks, function(t){return t._id.toString()===tempCheck._id.toString();});
        cwkArray.push(tempChild.workload);
      }
      var sum = _.reduce(cwkArray, function(sum, num) {
        return sum + num;
      });
      console.log('sum', sum);
      childWorkload = (sum / childQuantity);

      //should ideally slope upward (each additional depdendent is less impactful)
      dependencyFactor = (1+ ((tempTask.dependents*0.03)-(tempTask.dependencies*0.01)));
      if(tempTask.importance===true){impFactor=1.1;}
      else if(tempTask.importance===false){impFactor=0.9;}
      else{impFactor=1;}

      if(childWorkload>0){adjustedWorkload = ((tempTask.workload*(3/4)) + (childWorkload*(1/4)));}
      else{adjustedWorkload = tempTask.workload;}

      dependencyMultiplier = ((1+(childQuantity*0.01)) * dependencyFactor);
      totalWorkload = adjustedWorkload*dependencyMultiplier*impFactor;

      var currentDate = new Date();
      currentDate = Date.parse(currentDate);
      var left = Date.parse(tempTask.endDate) - currentDate;
      console.log('left', left);
      console.log('checkLength', tempTask.endDate);
      var length = Date.parse(tempTask.endDate) - Date.parse(tempTask.startDate);
      var tempLength = (((length/60)/60)/24);
      console.log('tempLength', tempLength);
      urgency = ((left/length) * (1+(length/600)));
      console.log('urgency', urgency);
      console.log('adjustedWorkload', adjustedWorkload);
      urgencyValue = (adjustedWorkload / urgency);
      console.log('urgencyValue', urgencyValue);

      //FIX THIS! write code when decided upon
      var finalAdjustments = 1;
      priorityValue = urgencyValue * finalAdjustments;
      //priorityValue = (urgencyValue * finalAdjustments).toFixed(3);
      console.log('priorityValue', priorityValue);

      tempTask.priorityValue = priorityValue;
      newTasks.push(tempTask);
      //end Loop
    }

    //sorts by priority
    var sortedTasks = newTasks.sort(function(a,b){
      if(a.name > b.name){return 1;}
      if(a.name < b.name){return -1;}
      return 0;
    });
    sortColors({tasks:sortedTasks});
  }





  //APPENDATION
  //receives from calculatePriority()
  //sorting mechanism could be surely improved
  function sortColors(data){
    console.log('sorting colors', data);
    var tasks = data.tasks;
    var num = tasks.length;
    console.log('num ', num);
    var red = Math.floor(num/10);
    console.log('red length', red);
    var yellow = Math.floor(num/5);
    console.log('yellow length', yellow);

    var redArray = [];
    var yellowArray = [];
    var greenArray = [];
    var a, b, c;
    for(a=0; a<red; a++){
      tasks[a].color = 'red';
      redArray.push(tasks[a]);
    }
    for(b=red; b<yellow; a++){
      tasks[a].color = 'yellow';
      yellowArray.push(tasks[b]);
    }
    for(c=yellow; c<num; c++){
      tasks[a].color = 'green';
      greenArray.push(tasks[c]);
    }

    var newData = {taskArray: [ {color:'red', tasks:redArray}, {color:'yellow', tasks:yellowArray}, {color:'green', tasks:greenArray} ]};
    prepBubbles(newData);
    console.log('to prepBubbles', newData);
    //end of sortColors(data)
  }

  function prepBubbles(data){
    for(var x=0; x<data.taskArray.length; x++){
      if(data.taskArray[x].tasks.length>0){
        append(data.taskArray[x]);
      }
    }
  }

  function append(data){
    var tasks = data.tasks;
    var color = data.color;
    var largest = data.tasks[0];

    //these are not completely correct
    //fix when the real calculations are implemented
    var $cluster = $('<div>');
    $('#sandbox0').append($cluster);
    $cluster.attr('id', 'cluster-'+color);
    var $inner = $('<div>');
    $inner.addClass('level-a');
    $($cluster).append($inner);
    var $base = $('<div>');
    $base.addClass('bubble size-5 '+color+' level-0');
    $($inner).append($base);
    $base.hide();
    $base.fadeIn();

    for(var i=1; i<tasks.length; i++){
      var tempData = tasks[i];
      var $bubble = $('<div>');
      $bubble.addClass('bubble '+color+' level-0');

      //FIX THIS!
      var size = 5-i-1;

      //this is just CSS stuff
      //fix when the real calculations are implemented
      $bubble.addClass('size-'+size);
      $bubble.css('float', 'left');
      $cluster.append($bubble);
      var speed = i*200;
      $bubble.hide();
      var resize = size*100;
      $bubble.fadeIn(100+speed);
      $bubble.effect('size', {to:{width:resize, height:resize}});
    }
  //end of append(data)
  }

//end of document
})();
