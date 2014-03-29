(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    fixPanel();
    $('#forms').hide();
    $('#dependencies').hide();
    $('.navForm').hide();
    $('#regButton').click(toggleReg);
    $('#logButton').click(toggleLog);
    $('#toggle').click(toggleForms);
    $('#toggle2').click(toggleTree);
  }

  function toggleTree(){
    $('#dependencies').fadeToggle('slow', 'linear');
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
    $('#forms').fadeToggle('slow', 'linear');
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
