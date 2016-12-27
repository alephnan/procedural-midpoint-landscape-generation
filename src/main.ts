///<reference path="p5.d.ts" />

import { MidpointDisplacer } from './midpoint-displacer';

const sketch = function (p : p5) {
  const W = 600;
  const H = 400;
  
  p.setup = function () {
    p.createCanvas(W, H);
  };
};

// TODO(freefood): fix data.json to have more explicit type 
new p5(sketch, false, false);