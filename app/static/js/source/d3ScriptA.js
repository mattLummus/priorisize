/* global d3:true */
/*jshint -W008 */
(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
  }

  var width = 1200,
      height = 900,
      padding = 2.5, // separation between same-color circles
      clusterPadding = 80, // separation between different-color circles
      maxRadius = 30;

  var n = 30, // total number of circles
      m = 3; // number of distinct clusters

  //red = #ed4747, yellow = #f0db58, green = #7ad86b, blue = #90d1e4
  var color = d3.scale.ordinal()
    .range(['#ed4747', '#f0db58', '#7ad86b']);

  // The largest node for each cluster.
  var clusters = new Array(m);

  // i = which cluster, r = radius, d = data
  var nodes = d3.range(n).map(function() {
    var i = Math.floor(Math.random() * m),
        r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
        //r = Math.floor(Math.random()*maxRadius),
        d = {cluster: i, radius: r};
    if (!clusters[i] || (r > clusters[i].radius)){clusters[i] = d;}
    return d;
  });

  var force = d3.layout.force()
      .nodes(nodes)
      .size([width, height])
      .gravity(0)
      .charge(0)
      .on('tick', tick)
      .start();

  var svg = d3.select('#sandboxa').append('svg')
      .attr('width', width)
      .attr('height', height);

  var circle = svg.selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', function(d) { return d.radius; })
      .style('fill', function(d) { return color(d.cluster); })
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

  //end of document
})();
