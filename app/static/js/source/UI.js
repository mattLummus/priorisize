(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#forms').hide();
    fixPanel();
    $('#toggle').click(toggleForms);
  }

  function toggleForms(){
    $('#forms').fadeToggle('slow', 'linear');
  }

  //OVERRIDES FOUNDATION CSS
  function fixPanel(){
    $('.navPanel').css('background-color', '#f1fdfe');
    $('.navPanel').css('color', 'black');
  }


  //DRAGGABLE
  $('.bubble').draggable({containment: 'parent', obstacle: 'sibling', cursor: 'pointer', preventCollision:true});

})();
