///<reference path="p5.d.ts" />

import {TerrainGenerator} from './terrain-generator';
import { ScrollingMidpointDisplacerLinkedList } from './scrolling-midpoint-displacer-linkedlist';

const sketch = function (p : p5) {
  const W : number = 1000;
  const H : number = 400;
  const mdp : TerrainGenerator = new ScrollingMidpointDisplacerLinkedList(10, W, H);

  p.setup = function () {
    p.createCanvas(W, H);
    p.strokeWeight(2);
    p.frameRate(20);
  };

  p.draw = function() {
    p.background(p.color('black'));

    p.stroke(p.color(98, 203, 157));
    mdp.update(); 
    mdp.render(p);

    p.stroke(p.color('white'));
    p.line(640, 0, 640, H);
  };
};

// TODO(freefood): fix data.json to have more explicit type 
new p5(sketch, false, false);