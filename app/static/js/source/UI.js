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
    $('#navTitle').css('color', 'white');
    $('#navTitle').css('font-size', '20px');
    $('#navTitle').css('background-color', '#007095');
  }


  //DRAGGABLE
  $('.bubble').draggable({containment: 'parent', obstacle: 'sibling', cursor: 'pointer', preventCollision:true});

})();
