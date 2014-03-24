(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    receiveData();
  }

  var dataArray;

  function receiveData(){
    var uid = $('#uid').val();
    var url = '/tasks/user/'+uid;
    $.getJSON(url, logger);
  }

  function logger(data){
    console.log('data received', data);
    dataArray = data;
    append(data);
  }


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
      $bubble.addClass('size-'+size);
      $bubble.css('float', 'left');
      $cluster.append($bubble);
      //fadeIn speed decelerates by quantity
      var speed = i*400;
      $bubble.hide();
      var resize = size*5;
      $bubble.effect('size', {to:{width:resize, height:resize}}, 1000);
      $bubble.fadeIn(1000+speed);
    }

  //end of append(data)
  }

//end of document
})();
