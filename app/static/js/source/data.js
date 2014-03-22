/*
-This file is for generating data to be used in testing and analyzing the impact of task variables
-5 Variables are tested recurrsively against changes in other variables, (1 control, 4 exp per test || 4 control, 1 exp per test)
-This data is then to be analyzed for patterns
-These patterns are the foundation for accuracy and effectiveness at estimating priority
*/

(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#generateData').click(initTest);
  }

  //one object containing arrays of 100 test criteria; 20 groups with 2-5 variations each which modify one of 5 values
  function initTest(){
    var object={};
    object._id = [];
    object.description = [];
    object.userId = '123456789123456789123456';
    object.workload = [];//5 groups
    object.importance = [];//3 groups
    object.date = [];//5 groups
    object.childGroup = [];//5 groups
    object.parentGroup = [];
    object.level = [];
    object.complete = [];//2 groups

    //testData population
    //will test all combinations against each other recurrsively
    for(var a=1; a<=100; a++){object._id.push(a);}//id Assignment, replace with range later
    for(var b=0; b<20; b++){//description Assignment
      var descriptionArray = [];//<<<20 test groups
      var descriptionValue = descriptionArray[b];
      for(var c=0; c<5; c++){
        object.description.push(descriptionValue);
      }
    }
    //group variable assignments
    for(var d=0; d<5; d++){//workload, 5
      var workArray = [];
      var workValue = workArray[d];
      for(var e=0; e<5; e++){
        object.workload.push(workValue);
      }
    }
    for(var f=0; f<15; f++){//importance, 3
        //object.importance.push(random boolean);
    }
    for(var h=0; h<5; h++){//date, 5
      var lengthArray = [7, 15, 30, 45, 60];
      var current = lengthArray[h];
      var leftArray = [1, (current/4), (current/2), (current*(3/4)), current];
      for(var j=0; j<5; j++){
        var tempDate = {length:current, left:leftArray[j]};
        object.date.push(tempDate);
      }
    }
    for(var k=0; k<25; k++){//tempChild, 5
      //random, applicable values
      var tempChild = {};
      tempChild.childWk = '';
      tempChild.childQ = '';
      tempChild.depWk = '';
      tempChild.depQ = '';
      object.date.push(tempChild);
    }
    for(var l=0; l<10; l++){//complete, 2
      //object.complete.push(random boolean);
    }
    //end of initTest
  }

//end of document
})();
