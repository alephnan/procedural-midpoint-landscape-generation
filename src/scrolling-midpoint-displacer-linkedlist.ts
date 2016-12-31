///<reference path="p5.d.ts" />
/**
 * Data Structure for set of line segments generated via midpoint displacement
 */
import {Pair} from './pair';
import { SplittableLine } from './splittable-line';
import { LinkedList } from './linked-list';

export class ScrollingMidpointDisplacerLinkedList {
  static ROUGHNESS : number = .8;

  // TODO(automatwon): this is probably more efficiently represented as sequence
  // of points. But easier to implement with SplittableLines for now
  private lineSegments: LinkedList;

  private w: number;
  private h: number;
  private baseDisplacement: number;
  private verticalBound: Pair<number>;
  private iterations: number;

  constructor(initialResolution: number, w: number, h: number) {
    this.w = w;
    this.h = h;
    this.verticalBound = new Pair<number>(0, this.h);

    const lines : LinkedList = new LinkedList();
    this.lineSegments = lines;

    const p1 : Pair<number>= new Pair(0, 150);
    const p2 : Pair<number>= new Pair(128*3, 250);
    const baseDisplacement = p1.y - p2.y;
    const l : SplittableLine = new SplittableLine(p1, p2, 0,  baseDisplacement);
    lines.push(l);

    for(let i = 0 ; i < 20; i++) {
      this.propagate();
    }

    this.iterations = 0;
  }

  public render(p: p5) {
    this.lineSegments.forEach((l: SplittableLine) => {
       p.line(l.a.x, l.a.y, l.b.x, l.b.y);
    });
  }

  public enqueue() {
      const last : SplittableLine = this.lineSegments.peekLast();
      const beginCoordinate = new Pair(last.b.x + 0, last.b.y + 0); 
      const endCoordinate = new Pair(beginCoordinate.x + 128, Math.floor(this.h * Math.random()));
      const newLine = new SplittableLine(beginCoordinate, endCoordinate, 0, beginCoordinate.y - endCoordinate.y);
      this.lineSegments.push(newLine);
  }

  public propagate() {
    const lines = this.lineSegments;
    let i = this.lineSegments.length() - 1;    
    while(i >= 0) {
      const l : SplittableLine = lines.get(i);
      // TODO(automatwon): consider dropping this if we are using set of points,
      // instead of line segments, where we can compare adjacent pairs
      if(!ScrollingMidpointDisplacerLinkedList.skipSplittableLine(l)) {
        const split : Pair<SplittableLine> = l.getSplit(this.verticalBound);
        lines.splitAt(i, split);
      }
   
      i--;
    }
  }
  
  public update() {
    this.iterations++;
      
    // Dequeue earliest line segments
    this.lineSegments.pop();
    this.propagate();

    // Enqueue lines
    if(this.iterations % 70 == 0) {
        this.enqueue();
    }
  }

  // Condition to stop looping
  static skipSplittableLine(l : SplittableLine) : boolean {
    return l.getGeneration() > 7;
  }
}

