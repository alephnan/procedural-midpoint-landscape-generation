///<reference path="p5.d.ts" />

import {TerrainGenerator} from './terrain-generator';
import { MidpointDisplacerBuffer } from './midpoint-displacer-buffer';

const sketch = function (p : p5) {
  const W : number = 600;
  const H : number = 400;
  const mdp : TerrainGenerator = new MidpointDisplacerBuffer(10, W, H);

  p.setup = function () {
    p.createCanvas(W, H);

    p.background(p.color('yellow'));

    p.stroke(p.color('red'));

    p.strokeWeight(2);

    p.frameRate(5);
  };

  p.draw = function() {
    p.background(p.color('yellow'));
    mdp.update();    
    mdp.render(p);
  };

};

// TODO(freefood): fix data.json to have more explicit type 
new p5(sketch, false, false);