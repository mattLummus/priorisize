/* global d3:true */
/*jshint -W008 */
(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
  }

  //Setup Variables
  var totalTime = 30;
  var maxWk = 5;
  var maxPri = 25;
  //time
  var elapsed = 20;
  var left = totalTime-elapsed;
  //workload
  var wkFill = 3.5;
  var wkNone = maxWk-wkFill;
  //dependencies
  var dependents = 3;
  var dependencies = 1;
  //priority
  var priFill = 15;
  var priNone = maxPri - priFill;
  //adjusted
  var timeE = 25*(elapsed/totalTime);
  var timeL = 25*(left/totalTime);
  var wkF = 25*(wkFill/maxWk);
  var wkN = 25*(wkNone/maxWk);
  var dT = 25*(dependents/(dependents+dependencies));
  var dC = 25*(dependencies/(dependents+dependencies));
  var priF = 25*(priFill/maxPri);
  var priN = 25*(priNone/maxPri);


  var data = [timeL, timeE, wkF, wkN, dT, dC, priF, priN];
  var r = 75;

  //red = #ed4747, yellow = #f0db58, green = #7ad86b, blue = #90d1e4
  var color = d3.scale.ordinal()
    .range(['#ed4747', '#90d1e4', '#f0db58', 'white', '#ed4747', '#7ad86b',  '#7ad86b', 'white']);

  var textSelect = d3.scale.ordinal()
    .range(['Time Left ('+left+')', 'Time Elapsed ('+elapsed+')', 'Workload ('+wkFill+')', '', 'Dependents ('+dependents+')', 'Dependencies ('+dependencies+')', 'Priority ('+priFill+')', '']);

  var canvas = d3.select('#sandbox-e-pie').append('svg')
    .attr('width', 1200)
    .attr('height', 300);

  var group = canvas.append('g')
    .attr('transform', 'translate(550, 150)');

  var arc = d3.svg.arc()
    .innerRadius(50)
    .outerRadius(r);

  var pie = d3.layout.pie()
    //.value(function(d){console.log('d', d); return d;})
    .value(function(d){return d;})
    .sort(null);

  var arcs = group.selectAll('.arc')
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class', 'arc');

  arcs.append('path')
    .attr('d', arc)
    .style('stroke', 'white')
    .attr('fill', function(d){return color(d.data);});

/*
  arcs.append('text')
    .attr('transform', function(d){return 'translate(' +arc.centroid(d) + ')';})
    .attr('text-anchor', 'middle')
    .attr('font-size', '1.5em')
    .text(function(d){return d.data;});
*/

  arcs.append('text')
    .attr('transform', function(d){return 'translate(' +arc.centroid(d) + ')';})
    .attr('text-anchor', 'middle')
    .attr('font-size', '0.6em')
    .text(function(d){return textSelect(d.data);});

})();
