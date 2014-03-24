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
    sortColors(data);
  }

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
    //append(newData);
  }

  function prepBubbles(data){
    for(var x=0; x<data.taskArray.length; x++){
      append(data.taskArray[x]);
    }
  }

  function append(data){
    var tasks = data.tasks;
    var color = data.color;
    var largest = data.tasks[0];

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

    for(var i=0; i<tasks.length; i++){
      var tempData = tasks[i];
      var $bubble = $('<div>');
      $bubble.addClass('bubble '+color+' level-0');
      var size = 5-i-1;
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

/*
  //this is just for testing; would come after analyzing and sorting into colors
  //will need to be altered for accurate use; for now just simulating how things would be appended
  function append(data){
    var tasks = data.tasks;
    //tasks are ordered from largest to smallest
    //largest is pulled out from array and appended first as the base for others
    var largest = data.tasks[0];

    //outer cluster; i.e. clusterRed, clusterGreen, etc.
    var $cluster = $('<div>');
    $('#sandbox0').append($cluster);
    $cluster.attr('id', 'clusterRed');
    //inner cluster; contains center bubble
    var $inner = $('<div>');
    $inner.addClass('level-a');
    $($cluster).append($inner);
    //center bubble; other bubbles wrap around this
    var $base = $('<div>');
    $base.addClass('bubble size-5 red level-0');
    $($inner).append($base);
    $base.hide();
    $base.fadeIn();

    //appends outer tasks
    for(var i=0; i<tasks.length; i++){
      var tempData = tasks[i];
      var $bubble = $('<div>');
      $bubble.addClass('bubble red level-0');
      var size = 5-i-1;
      //var size = i+1;
      $bubble.addClass('size-'+size);
      $bubble.css('float', 'left');
      $cluster.append($bubble);
      //fadeIn speed decelerates by quantity
      var speed = i*200;
      $bubble.hide();
      var resize = size*100;
      //$bubble.effect('size', {to:{width:resize, height:resize}});
      //$bubble.fadeIn(1000+speed);
      $bubble.fadeIn(100+speed);
      $bubble.effect('size', {to:{width:resize, height:resize}});
    }

  //end of append(data)
  }
*/

//end of document
})();
