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

    const p1 : Pair = new Pair(0, h/2);
    const p2 : Pair = new Pair(w, h/2);
    const l : Line = new Line(p1, p2);
    this.lineSegments.push(l);
  }

  public render(p: p5) {
    this.lineSegments.forEach((l: Line) => {
        p.line(l.a.x, l.a.y, l.b.x, l.b.y);
    });
  }

  public displace() {
    // HMM. A linked list traversal might work better.

    let i = this.lineSegments.length - 1;
    while(i >= 0) {
      const l : Line = this.lineSegments[i];
      if(MidpointDisplacerBuffer.skipLine(l)) {
        i--;
        continue;
      }

      const leftPoint : Pair = l.a;
      const rightPoint : Pair = l.b;

      // Compute displaced midpoint
      const d = 10;
      const midpoint : Pair = l.getMidpoint();
      const verticallyDisplacedMidpoint : Pair = MidpointDisplacerBuffer.displacePointVertically(
        midpoint, d);

      const leftLine = new Line(leftPoint, verticallyDisplacedMidpoint);
      const rightLine = new Line(verticallyDisplacedMidpoint, rightPoint);

      // Replace original line segment with the two new line segments
      this.lineSegments.splice(i, 1, leftLine, rightLine);
      
      i--;
    }
  }

  // Condition to stop looping
  static skipLine(l : Line) : boolean {
    return l.b.x - l.a.x < 10;
  }

  // Displace point's vertical
  static displacePointVertically(p: Pair, displaceMagnitude: number) : Pair {
    return new Pair(p.x, p.y + displaceMagnitude);
  } 
}
