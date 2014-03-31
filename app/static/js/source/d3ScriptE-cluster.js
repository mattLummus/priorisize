/* global d3:true */
/*jshint -W008 */
(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    clusterTest();
    init();
  }

  function init(){
    $.getJSON('/tasks/find', init2);
  }

  function init2(data){
    var num = data.tasks.length;
    console.log(num);
  }

  var nodeTemp = [];

  var width = 1200,
      height = 600,
      padding = 2.5, // separation between same-color circles
      clusterPadding = 80, // separation between different-color circles
      maxRadius = 50;

  var n = 10, // total number of circles
      m = 3; // number of distinct clusters

  //red = #ed4747, yellow = #f0db58, green = #7ad86b, blue = #90d1e4
  var color = d3.scale.ordinal()
    .range(['#ed4747', '#f0db58', '#7ad86b']);

  // The largest node for each cluster.
  var clusters = new Array(m);

  // i = which cluster, r = radius, d = data
  var nodes = d3.range(n).map(function() {
    var i = Math.floor(Math.random() * m),
        r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius;
        //r = Math.floor(Math.random()*maxRadius),
    if(r<20){r = 20;}
    var d = {cluster: i, radius: r, dataTest:'data here'};
    if (!clusters[i] || (r > clusters[i].radius)){clusters[i] = d;}
    return d;
  });
  console.log('nodesAfter', nodes);

  //var nodesTest = d3.json('tasks/clusterTest', function(error, json) {
  function clusterTest(){
    $.getJSON('tasks/clusterTest', function(data){
      console.log('clusterTest', data);
      createNodes(data);
    });
  }

  function createNodes(data){
    var tasks = data.tasks;
    console.log('cn tasks', tasks);
    for(var a=0; a<tasks.length; a++){
      var i;
      switch(tasks[a].color){
        case 'green':
          i = 0;
          break;
        case 'yellow':
          i = 1;
          break;
        case 'red':
          i = 2;
          break;
        default:
      }
      var r = tasks[a].size;
      var d = {cluster:i, radius:r, _id:tasks[a]._id, color:tasks[a].color, name:tasks[a].name};
      console.log('d', d);
      if (!clusters[i] || (r > clusters[i].radius)){clusters[i] = d;}
      nodeTemp.push(d);
    }
    console.log('nodeTemp', nodeTemp);
  }

  console.log('nodes', nodes);
  var force = d3.layout.force()
      .nodes(nodes)
      .size([width, height])
      .gravity(0)
      .charge(0)
      .on('tick', tick)
      .start();

  var svg = d3.select('#sandbox-e-workarea-cluster').append('svg')
      .attr('width', width)
      .attr('height', height);

  var circle = svg.selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('dataTest', function(d){return d.dataTest;})
      .attr('r', function(d) { return d.radius; })
      .style('fill', function(d) { return color(d.cluster); })
      .on('click', click)
      .call(force.drag);

  function tick(e) {
    circle
        .each(cluster(10 * e.alpha * e.alpha))
        .each(collide(.5))
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });
  }

  // Move d to be adjacent to the cluster node.
  function cluster(alpha) {
    return function(d) {
      var cluster = clusters[d.cluster],
          k = 1;

      // For cluster nodes, apply custom gravity.
      if (cluster === d) {
        cluster = {x: width / 2, y: height / 2, radius: -d.radius};
        k = .1 * Math.sqrt(d.radius);
      }

      var x = d.x - cluster.x,
          y = d.y - cluster.y,
          l = Math.sqrt(x * x + y * y),
          r = d.radius + cluster.radius;
      if (l !== r) {
        l = (l - r) / l * alpha * k;
        d.x -= x *= l;
        d.y -= y *= l;
        cluster.x += x;
        cluster.y += y;
      }
    };
  }

  // Resolves collisions between d and all other circles.
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function(d) {
      var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
      quadtree.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }

  function click(d){
    console.log('clicked!', d);
    $('.formHeader').text(d.dataTest);
  }

  //end of document
})();
