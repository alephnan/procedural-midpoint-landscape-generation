///<reference path="p5.d.ts" />

/**
 * Data Structure for set of line segments generated via midpoint displacement
 */
import {Pair} from './pair';
import {Line} from './line';

export class MidpointDisplacerBuffer {
  // TODO(automatwon): this is probably more efficiently represented as sequence
  // of points. But easier to implement with Lines for now
  private lineSegments: Array<Line>;
  constructor(initialResolution: number, w: number, h: number) {
    this.lineSegments = new Array();

    const p1 : Pair = new Pair(0, 0);
    const p2 : Pair = new Pair(w, h);
    const l : Line = new Line(p1, p2);
    this.lineSegments.push(l);
  }

  public render(p: p5) {
    this.lineSegments.forEach((l: Line) => {
        p.line(l.a.x, l.a.y, l.b.x, l.b.y);
    });
  }
}
