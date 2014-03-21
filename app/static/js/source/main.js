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

  $('.bubble').draggable({containtment: '#sandbox', cursor: 'pointer'});

})();
