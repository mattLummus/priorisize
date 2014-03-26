/* global d3:true */
/*jshint -W008 */
(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
  }

  var width = 1000,
      height = 900,
      root;

  // PHYSICS
  var force = d3.layout.force()
      .linkDistance(80)
      .charge(-120)
      .gravity(.05)
      .size([width, height])
      .on('tick', tick);

  var svg = d3.select('#sandbox0').append('svg')
       //fixed size
      .attr('width', width)
      .attr('height', height);

  var link = svg.selectAll('.link'),
      node = svg.selectAll('.node');

  d3.json('tasks/graph', function(error, json) {
    root = json;
    update();
  });

  function update() {
    var nodes = flatten(root),
        links = d3.layout.tree().links(nodes);

    // Restart the force layout.
    force
        .nodes(nodes)
        .links(links)
        .start();

    //For collision detection
    //This has been added to the original file. If buggy, this may be the problem.
  /*
    force.on('tick', function(e) {
      var q = d3.geom.quadtree(nodes),
          i = 0,
          n = nodes.length;

      while (++i < n){ q.visit(collide(nodes[i]));}

      svg.selectAll('circle')
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; });
    });
*/
    // Update links.
    link = link.data(links, function(d) { return d.target.id; });

    link.exit().remove();

    link.enter().insert('line', '.node')
        .attr('class', 'link');

    // Update nodes.
    node = node.data(nodes, function(d) { return d.id; });
    console.log('node', node[0]);

    node.exit().remove();

    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .on('click', click)
        .call(force.drag);

    nodeEnter.append('circle')
        .attr('r', function(d) { return Math.sqrt(d.size) / 10 || 4.5; });

    nodeEnter.append('text')
        .attr('dy', '.35em')
        .text(function(d) { return d.name; });

    node.select('circle')
        .style('fill', color);
  }

  function tick() {
    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

    node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
  }

  function color(d) {
    return d._children ? '#3182bd' // collapsed package
        : d.children ? '#c6dbef' // expanded package
        : '#fd8d3c'; // leaf node
  }

  // Toggle children on click.
  function click(d){
    if (d3.event.defaultPrevented){return;} // ignore drag
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update();
  }

  // Returns a list of all nodes under the root.
  function flatten(root) {
    var nodes = [], i = 0;

    function recurse(node) {
      if (node.children){node.children.forEach(recurse);}
      if (!node.id){node.id = ++i;}
      nodes.push(node);
    }

    recurse(root);
    //console.log('nodes', nodes);
    return nodes;
  }

/*
  function collide(node) {
    var r = node.radius + 16,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = node.radius + quad.point.radius;
        if (l < r) {
          l = (l - r) / l * .5;
          node.x -= x *= l;
          node.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
  }
*/
//end of document
})();
