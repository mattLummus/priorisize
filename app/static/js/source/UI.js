(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    fixPanel();
    $('#forms').hide();
    $('#dependencies').hide();
    $('.navForm').hide();
    $('#sandbox-e-workarea-cluster').hide();
    $('#regButton').click(toggleReg);
    $('#logButton').click(toggleLog);
    $('#toggle').click(toggleForms);
    $('#toggle2').click(toggleTree);
    $('#toggle3').click(toggleMode);
    getTasks();
    $('#selectTaskEdit').on('change', changeEdit);
    $('#selectTaskTree').on('change', changeTree);
  }

  function changeEdit(){
    var $temp = $('#selectTaskEdit').val();
    console.log('changetask', $temp);
    $.getJSON('/task/'+$temp, descEdit);
  }

  function changeTree(){
    var $temp = $('#selectTaskTree').val();
    console.log('changetask', $temp);
    $.getJSON('/task/'+$temp, treeData);
  }

  function treeData(data){
    console.log('treeData', data);
    for(var c=0; c<data.dependencies.length; c++){
      $.getJSON('/task/'+data.dependencies[c], function(d){
        var $temp = $('<option>');
        $temp.val(d._id);
        $temp.text(d.description);
        $('#rCie').append($temp);
      });
    }
    for(var e=0; e<data.dependents.length; e++){
      $.getJSON('/task/'+data.dependents[e], function(da){
        var $temp = $('<option>');
        $temp.val(da._id);
        $temp.text(da.description);
        $('#rEnt').append($temp);
      });
    }
  }

  function descEdit(data){
    $('#descriptionEdit').val(data.description);
    $('#workloadEdit').val(data.workload);
    $('#importanceEdit').val(data.importance);
    $('#endDateEdit').val(data.endDate);
    $('#branchEdit').val(data.parentId);
  }

  function getTasks(){
    $.getJSON('/tasks/find', taskRouter);
  }

  function taskRouter(data){
    appendTasks(data);
  }

  function appendTasks(data){
    for(var b=0; b<data.tasks.length; b++){
      var $task = $('<option>');
      $task.text(data.tasks[b].description);
      $task.val(data.tasks[b]._id);
      $('.taskSelector').append($task);
    }
  }

  function toggleMode(){
    $('#sandbox-e-workarea-tree').fadeToggle('slow', 'linear');
    $('#sandbox-e-workarea-cluster').fadeToggle('slow', 'linear');
    //$('#sandbox-e-workarea-tree').toggle();
    //$('#sandbox-e-workarea-cluster').toggle();
    event.preventDefault();
  }

  function toggleTree(){
    $('#dependencies').fadeToggle('fast', 'linear');
    event.preventDefault();
  }

  function toggleReg(){
    $('#registerForm').toggle();
    event.preventDefault();
  }

  function toggleLog(){
    $('#loginForm').toggle();
    event.preventDefault();
  }

  function toggleForms(){
    $('#forms').fadeToggle('fast', 'linear');
    event.preventDefault();
  }

  //OVERRIDES FOUNDATION CSS
  function fixPanel(){
    $('.navPanel').css('background-color', '#007095');
    $('.navPanel').css('font-size', '20px');
    $('.navPanel').css('color', 'white');
    $('.navPanel').css('box-shadow', 'inset 0 0 10px #000000');
    $('.navPanel').css('text-shadow', '3px 3px 0px rgba(28, 171, 255, 1)');
    $('.navPanel').css('width', '200px');
    $('.navForm').css('background-color', '#007095');
    $('.navForm').css('font-size', '20px');
    $('.navForm').css('color', 'white');
    $('.navForm').css('box-shadow', 'inset 0 0 10px #000000');
    $('.navForm').css('width', '1038px');
    $('.navForm').css('float', 'right');
    $('.name').css('height', '50px');
  }


  //DRAGGABLE
  //$('.bubble').draggable({containment: 'parent', cursor: 'pointer', preventCollision:true});

  $('.bubble').draggable({multipleCollisionInteractions:
    [ { collider:  '.level-0', obstacle:  '.level-0', containment: 'parent', preventCollision: true },
      { collider: '.level-1', obstacle: '.level-1', containment: 'parent', preventCollision: true }
    ]
  });

})();
