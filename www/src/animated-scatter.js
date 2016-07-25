'use strict';

var plot = {
  name: 'Animated Scatter',
  gd: 'graph',

  n: 31,
  x1: [],
  x2: [],
  y1: [],
  y2: [],

  randomizeData (output) {
    var phase = Math.random() * Math.PI * 2;

    for (var i = 0; i < this.n; i++) {
      var t = i / (this.n - 1);
      output[i] = Math.sin(Math.PI * t + phase) + 0.2 * Math.sin(Math.PI * 4 * t) + (Math.random() - 1) * 0.2;
    }
  },

  initializeX () {
    for (var i = 0; i < this.n; i++) {
      var t = i / (this.n - 1);
      this.x1[i] = this.x2[i] = t;
    }
  },

  create: function () {
    this.initializeX();
    this.randomizeData(this.y1)
    this.randomizeData(this.y2)

    Plotly.plot('graph', [
      {
        x: this.x1,
        y: this.y1,
        mode: 'markers+lines',
        line: {
            simplify: false
        }
      }, {
        x: this.x2,
        y: this.y2,
        mode: 'markers+lines',
        line: {
            simplify: false
        }
      }
    ], {}, {scrollZoom: true});
 },

  actionLabel: 'Animate',

  action: function () {
    this.randomizeData(this.y1)
    this.randomizeData(this.y2)

    Plotly.transition('graph', [{y: this.y1}, {y: this.y2}], null, null, {duration: 500, easing: 'cubic-in-out'});
  }
};

plot.create();
