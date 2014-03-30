/* global d3:true */
/*jshint -W008 */
(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
  }

  var w = 1200,
      h = 600,
      r = 6;
      //fill = d3.scale.category20();

  var force = d3.layout.force()
      .charge(-120)
      .linkDistance(30)
      .size([w, h]);

  var svg = d3.select('#sandbox-e-workarea-tree').append('svg:svg')
      .attr('width', w)
      .attr('height', h);

  d3.json('tasks/graph2', function(json) {
    var link = svg.selectAll('line')
        .data(json.links)
        .enter().append('svg:line')
        .style('stroke', 'black');

    var node = svg.selectAll('circle')
        .data(json.nodes)
        .enter().append('svg:circle')
        .attr('r', r - .75)
        //.style('fill', function(d) { return fill(d.group); })
        //.style('stroke', function(d) { return d3.rgb(fill(d.group)).darker(); })
        .style('fill', 'red')
        .call(force.drag);

    force
        .nodes(json.nodes)
        .links(json.links)
        .on('tick', tick)
        .start();

    function tick(e) {

      // Push sources up and targets down to form a weak tree.
      var k = 6 * e.alpha;
      json.links.forEach(function(d, i) {
        d.source.y -= k;
        d.target.y += k;
      });

      node.attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; });

      link.attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; });
    }
  });
})();
