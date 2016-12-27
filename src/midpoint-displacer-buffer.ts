///<reference path="p5.d.ts" />
/**
 * Data Structure for set of line segments generated via midpoint displacement
 */
import {Pair} from './pair';
import {Line} from './line';

export class MidpointDisplacerBuffer {
  static ROUGHNESS : number = 1.1;

  // TODO(automatwon): this is probably more efficiently represented as sequence
  // of points. But easier to implement with Lines for now
  private lineSegments: Array<Line>;

  private h :number;

  constructor(initialResolution: number, w: number, h: number) {
    this.lineSegments = new Array();

    const p1 : Pair = new Pair(0, 100);
    const p2 : Pair = new Pair(w, 300);
    const l : Line = new Line(p1, p2);
    this.lineSegments.push(l);

    this.h = h;
  }

  public render(p: p5) {
    this.lineSegments.forEach((l: Line) => {
        p.line(l.a.x, l.a.y, l.b.x, l.b.y);
    });
  }

  public displace() {
    const lines = this.lineSegments;
    let i = this.lineSegments.length - 1;

    const leftMostY = lines[0].a.y;
    const rightMostY = - lines[0].b.y;
    let d = leftMostY - rightMostY;
    // Get Log2(length), since 2^(iterations-1) == length 
    const numIterations  = Math.log(i+1) / Math.LN2;
    // Simplify this equation. Or, just use a iteration counter
    d *= (2 ** (-1*MidpointDisplacerBuffer.ROUGHNESS)) ** numIterations;
    while(i >= 0) {
      const l : Line = this.lineSegments[i];
      // TODO(automatwon): consider dropping this if we are using set of points,
      // instead of line segments, where we can compare adjacent pairs
      if(MidpointDisplacerBuffer.skipLine(l)) {
        i--;
        continue;
      }

      const leftPoint : Pair = l.a;
      const rightPoint : Pair = l.b;

      // Compute displaced midpoint
      const midpoint : Pair = l.getMidpoint();
      const verticallyDisplacedMidpoint : Pair = this.displacePointVertically(
        midpoint, d);

      const leftLine = new Line(leftPoint, verticallyDisplacedMidpoint);
      const rightLine = new Line(verticallyDisplacedMidpoint, rightPoint);

      // TODO(automatwon): A doubly inked list traversal might work better
      //       
      // Replace original line segment with the two new line segments
      this.lineSegments.splice(i, 1, leftLine, rightLine);
      
      i--;
    }
  }

  // Condition to stop looping
  static skipLine(l : Line) : boolean {
    return l.b.x - l.a.x < 2;
  }

  // Displace point's vertical
  private displacePointVertically(p: Pair, displaceMagnitude: number) : Pair {
    let y = p.y + this.choose([displaceMagnitude, -displaceMagnitude]);
    
    // Bound the value to within window
    y = Math.min(this.h, Math.max(y, 0));

    return new Pair(p.x, y);
  }

  // Private static final: move into utility or global.d.ts
  private choose(choices: Array<any>) {
    return choices[Math.floor(Math.random() * choices.length)];
  }
}
