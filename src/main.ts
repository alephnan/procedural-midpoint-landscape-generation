///<reference path="p5.d.ts" />

import {TerrainGenerator} from './terrain-generator';
import { ScrollingMidpointDisplacerLinkedList } from './scrolling-midpoint-displacer-linkedlist';

const sketch = function (p : p5) {
  const W : number = 2000;
  const H : number = 400;

  const minimumW: number = 640;
  const maximumH: number = Math.round(H *.8);

  const mdp : TerrainGenerator = new ScrollingMidpointDisplacerLinkedList(minimumW, maximumH);

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
    p.line(minimumW, 0, minimumW, H);
  };
};

// TODO(freefood): fix data.json to have more explicit type 
new p5(sketch, false, false);