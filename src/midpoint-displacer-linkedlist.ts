///<reference path="p5.d.ts" />
/**
 * Data Structure for set of line segments generated via midpoint displacement
 */
import {Pair} from './pair';
import {Line} from './line';
import { LinkedList } from './linked-list';

export class MidpointDisplacerLinkedList {
  static ROUGHNESS : number = .8;

  // TODO(automatwon): this is probably more efficiently represented as sequence
  // of points. But easier to implement with Lines for now
  private lineSegments: LinkedList;

  private h: number;
  private iterations: number;
  private baseDisplacement: number;
  constructor(initialResolution: number, w: number, h: number) {
    const lines : LinkedList = new LinkedList();
    this.lineSegments = lines;

    const p1 : Pair = new Pair(0, 150);
    const p2 : Pair = new Pair(w, 250);
    const l : Line = new Line(p1, p2);
    lines.push(l);

    this.h = h;

    this.iterations = 0;

    const leftMostY = lines.get(0).a.y;
    const rightMostY = lines.get(0).b.y;
    this.baseDisplacement = leftMostY - rightMostY;
  }

  public render(p: p5) {
    this.lineSegments.forEach((l: Line) => {
       p.line(l.a.x, l.a.y, l.b.x, l.b.y);
    });
  }

  public update() {
    const lines = this.lineSegments;
    let i = this.lineSegments.length() - 1;

    // Scale the displacement based on number of iterations to "converge"
    const displacementScale =  2 ** (-1*MidpointDisplacerLinkedList.ROUGHNESS*this.iterations);
    // Simplify this equation. Or, just use a iteration counter
    const displacementMagnitude = this.baseDisplacement * displacementScale;

    while(i >= 0) {
      const l : Line = lines.get(i);
      // TODO(automatwon): consider dropping this if we are using set of points,
      // instead of line segments, where we can compare adjacent pairs
      if(MidpointDisplacerLinkedList.skipLine(l)) {
        i--;
        continue;
      }

      const leftPoint : Pair = l.a;
      const rightPoint : Pair = l.b;

      // Compute displaced midpoint
      const midpoint : Pair = l.getMidpoint();
      const verticallyDisplacedMidpoint : Pair = this.displacePointVertically(
        midpoint, displacementMagnitude);

      const leftLine : Line = new Line(leftPoint, verticallyDisplacedMidpoint);
      const rightLine : Line = new Line(verticallyDisplacedMidpoint, rightPoint);

      const a : Array<Line> = [leftLine, rightLine];

      // Replace original line segment with the two new line segments
      lines.spliceOne(i, a);
      i--;
    }

    this.iterations++;
  }

  // Condition to stop looping
  static skipLine(l : Line) : boolean {
    return l.b.x - l.a.x < 2;
  }

  // Displace point's vertical
  private displacePointVertically(p: Pair, displaceMagnitude: number) : Pair {
    let y = p.y + this.choose([displaceMagnitude, -displaceMagnitude]);
    
    // Bound the value to within window
    y = this.clamp(y, 0, this.h);

    return new Pair(p.x, y);
  }

  // Private static final: move into utility or global.d.ts
  private choose(choices: Array<any>) {
    return choices[Math.floor(Math.random() * choices.length)];
  }

  private clamp(x: number, lowerBound: number, upperBound: number) {
    return Math.min(upperBound, Math.max(x, lowerBound));
  }
}
