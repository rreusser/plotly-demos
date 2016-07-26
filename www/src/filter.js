'use strict';

var data = [{
  x: [20, 11, 12, 0, 1, 2, 3],
  y: [1, 2, 3, 2, 5, 2, 0],
  identifier: [0, 1, 2, 3, 4, 5, 6],
  type: 'scatter',
  mode: 'markers+lines'
}];

var layout = {
  margin: {t: 10, r: 10, b: 50, l: 30},
  dragmode: 'lasso',
}

var data1 = JSON.parse(JSON.stringify(data));
var data2 = JSON.parse(JSON.stringify(data));
var gd = document.getElementById('plotly1');
var xpadding = 5;
var ypadding = 1;

Plotly.plot('plotly1', data1, layout)
  .then(function() {
     return Plotly.plot('plotly2', data2, layout)
  }).then(function() {
    gd.on('plotly_selected', function(sel){
      data[0].transforms = [];

      if(sel){
        var xrange = [Infinity, -Infinity];
        var yrange = [Infinity, -Infinity];
        for (var i = 0; i < sel.points.length; i++) {
          xrange[0] = Math.min(xrange[0], sel.points[i].x - xpadding);
          xrange[1] = Math.max(xrange[1], sel.points[i].x + xpadding);
          yrange[0] = Math.min(yrange[0], sel.points[i].y - ypadding);
          yrange[1] = Math.max(yrange[1], sel.points[i].y + ypadding);
        }

        if (isFinite(xrange[0]) && isFinite(xrange[1]) && isFinite(yrange[0]) && isFinite(yrange[1])) {
          var layout = {
            xaxis: {range: xrange},
            yaxis: {range: yrange}
          };
        }

        data[0].transforms.push({
          type: 'filter',
          operation: 'in',
          value: sel.points.map(function(d){return d.identifier}),
          filtersrc: 'identifier'
        });

        var newData = data;
      }

      Plotly.transition('plotly2', newData, layout, [0]);
    });
  });

