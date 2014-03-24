(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    receiveData();
    receiveDataTest();
  }

  var dataArray;
  var dataArrayTest;

  function receiveData(){
    var uid = $('#uid').val();
    var url = '/tasks/user/'+uid;
    $.getJSON(url, logger);
  }

  function receiveDataTest(){
    var uid = $('#uid').val();
    var url = '/tasks/find';
    console.log('uid', uid);
    $.getJSON(url, loggerTest);
  }

  function logger(data){
    console.log('data received', data);
    dataArray = data;
  }

  function loggerTest(data){
    console.log('data received', data);
    dataArrayTest = data;
  }


})();
