///<reference path="p5.d.ts" />
/**
 * Data Structure for set of line segments generated via midpoint displacement
 */
import {Pair} from './pair';
import {SplittableLine} from './splittable-line';
import { LinkedList } from './linked-list';

export class MidpointDisplacerLinkedList {
  static ROUGHNESS : number = .8;

  // TODO(automatwon): this is probably more efficiently represented as sequence
  // of points. But easier to implement with SplittableLines for now
  private lineSegments: LinkedList;

  private h: number;
  private baseDisplacement: number;
  constructor(initialResolution: number, w: number, h: number) {
    const lines : LinkedList = new LinkedList();
    this.lineSegments = lines;

    const p1 : Pair<number>= new Pair(0, 150);
    const p2 : Pair<number>= new Pair(w, 250);
    const baseDisplacement = p1.y - p2.y;
    const l : SplittableLine = new SplittableLine(p1, p2, 0,  baseDisplacement);
    lines.push(l);

    this.h = h;
  }

  public render(p: p5) {
    this.lineSegments.forEach((l: SplittableLine) => {
       p.line(l.a.x, l.a.y, l.b.x, l.b.y);
    });
  }

  public update() {
    const lines = this.lineSegments;
    let i = this.lineSegments.length() - 1;

    while(i >= 0) {
      const l : SplittableLine = lines.get(i);
      // TODO(automatwon): consider dropping this if we are using set of points,
      // instead of line segments, where we can compare adjacent pairs
      if(!MidpointDisplacerLinkedList.skipSplittableLine(l)) {
        const split : Pair<SplittableLine> = this.midpointSplit(l);
        lines.splitAt(i, split);
      }
   
      i--;
    }
  }

  private midpointSplit(l: SplittableLine) : Pair<SplittableLine> {
    const displacementMagnitude = l.nextDisplacementMagnitude();
    const leftPoint : Pair<number> = l.a;
    const rightPoint : Pair<number>= l.b;

    // Compute displaced midpoint
    const midpoint : Pair<number> = l.getMidpoint();
    const verticallyDisplacedMidpoint : Pair<number> = this.displacePointVertically(
      midpoint, displacementMagnitude);

    const generation = l.getGeneration() + 1;
    const baseDisplacement = l.getBaseDisplacement();
    const leftSplittableLine : SplittableLine = new SplittableLine(leftPoint, verticallyDisplacedMidpoint, generation, baseDisplacement);
    const rightSplittableLine : SplittableLine = new SplittableLine(verticallyDisplacedMidpoint, rightPoint, generation, baseDisplacement);

    return new Pair(leftSplittableLine, rightSplittableLine);
  }

  // Condition to stop looping
  static skipSplittableLine(l : SplittableLine) : boolean {
    return l.b.x - l.a.x < 2;
  }

  // Displace point's vertical
  private displacePointVertically(p: Pair<number>, displaceMagnitude: number) : Pair<number>{
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
