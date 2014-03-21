(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#forms').hide();
    $('#toggle').click(toggleForms);
  }

  function toggleForms(){
    $('#forms').fadeToggle('slow', 'linear');
  }

  $('.bubble').draggable({containment: 'parent', obstacle: 'sibling', cursor: 'pointer', preventCollision:true});

})();
