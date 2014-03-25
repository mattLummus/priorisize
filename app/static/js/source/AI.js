/* jshint unused:false */
(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    receiveData();
  }

  function receiveData(){
    var uid = $('#uid').val();
    var url = '/tasks/user/'+uid;
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
    var adjustedWorkload, dependencyMultiplier, totalWorkload;
    var cwkArray, childWorkload, childQuantity, impFactor;
    var urgency, urgencyValue;
    var priorityValue;

    for(var y=0; y<tasks.length; y++){
      var tempTask = tasks[y];
      cwkArray = [];
      //FIX THIS! need to calculate childWorkload and quantity
      //find tasks by id from tasks[], put wk value into cwkArray and then average the array
      childWorkload = 2;
      childQuantity = tempTask.childGroup.length;
      dependencyMultiplier = 2;
      if(tempTask.importance===true){impFactor=1.1;}
      else if(tempTask.importance===false){impFactor=0.9;}
      else{impFactor=1;}

      adjustedWorkload = ((tempTask.workload*(3/4)) + (childWorkload*(1/4)));
      dependencyMultiplier = ((1+(childQuantity/500)) + (dependencyMultiplier/300));
      totalWorkload = adjustedWorkload*dependencyMultiplier*impFactor;

      //FIX THIS! need to calculate time here
      var currentDate = new Date();
      //var left = endDate-currentDate;
      var left = 14;
      //var length = endDate-startDate;
      var length = 30;
      urgency = ((left/length) * (1+(length/600)));
      urgencyValue = (adjustedWorkload / urgency);

      //FIX THIS! write code when decided upon
      var finalAdjustments = 1;
      priorityValue = (urgencyValue * finalAdjustments);

      tempTask.priorityValue = priorityValue;
      newTasks.push(tempTask);
      //end Loop
    }

    //need to sort newTasks by priority (largest to smallest)
    sortColors({tasks:newTasks});
  }





  //APPENDATION
  //receives from calculatePriority()
  function sortColors(data){
    console.log('sorting colors', data);
    var tasks = data.tasks;
    var num = tasks.length;
    var red = Math.floor(num/10);
    var yellow = Math.floor(num/5);

    //simulates priority sorting for testing purposes
    tasks = _.shuffle(tasks);
    var redArray = [];
    var yellowArray = [];
    var greenArray = [];
    var a, b, c;
    for(a=0; a<red; a++){
      redArray.push(tasks[a]);
    }
    for(b=red; b<yellow; a++){
      yellowArray.push(tasks[b]);
    }
    for(c=yellow; c<num; c++){
      greenArray.push(tasks[c]);
      console.log('green', greenArray);
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
