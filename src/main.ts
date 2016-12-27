///<reference path="p5.d.ts" />

import { MidpointDisplacer } from './midpoint-displacer';

const sketch = function (p : p5) {
  const W : number = 600;
  const H : number = 400;

  p.setup = function () {
    p.createCanvas(W, H);

    p.background(p.color('yellow'));

    p.stroke(p.color('red'));
    p.strokeWeight(2);
    p.line(0, H/2, W, H/2);
  };
};

// TODO(freefood): fix data.json to have more explicit type 
new p5(sketch, false, false);