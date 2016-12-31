///<reference path="p5.d.ts" />
/**
 * Class to manage state of scrolling terrain with doubly-linked list queue that progressively buffers more 
 * lines 

 */

import {Pair} from './pair';
import {SplittableLine} from './splittable-line';
import {LinkedList} from './linked-list';

export class ScrollingMidpointDisplacerLinkedList {
  static ROUGHNESS : number = 1.2;

  // TODO(automatwon): this is probably more efficiently represented as sequence
  // of points. But easier to implement with SplittableLines for now
  private lineSegments: LinkedList;
  private baseDisplacement: number;
  private verticalBound: Pair<number>;

  private iterations: number;
  private enqueueInterval: number;

  // Number of parts we partition each line into
  static POWER: number = 2;
  static MINIMUM_LINE_WIDTH: number = 3;
  static MAX_GENERATIONS: number = 7;
  static INITIAL_LINE_WIDTH: number = (
    ScrollingMidpointDisplacerLinkedList.MINIMUM_LINE_WIDTH *
      ScrollingMidpointDisplacerLinkedList.POWER **
    (ScrollingMidpointDisplacerLinkedList.MAX_GENERATIONS-1)
  );

  constructor(minimumWidth: number, maximumHeight: number) {
    this.verticalBound = new Pair(0, maximumHeight);

    const lines : LinkedList = new LinkedList();
    this.lineSegments = lines;

    const p1 : Pair<number>= new Pair(0, 150);
    const p2 : Pair<number>= new Pair(ScrollingMidpointDisplacerLinkedList.INITIAL_LINE_WIDTH, 250);
    const baseDisplacement = p1.y - p2.y;
    const l : SplittableLine = new SplittableLine(p1, p2, 0,  baseDisplacement);
    lines.push(l);

    // Add enough initial line segments so there is always enough completely split line segments in viewable area
    const numBaseLineSegments = minimumWidth / ScrollingMidpointDisplacerLinkedList.INITIAL_LINE_WIDTH;
    for(let i = 0; i < numBaseLineSegments; i++) {
      this.enqueue();
    }
    
    // Number of itertions before enqueue
    this.enqueueInterval = ScrollingMidpointDisplacerLinkedList.POWER ** (ScrollingMidpointDisplacerLinkedList.MAX_GENERATIONS - 1);

    // Ensure all line segments originally displaced / split as much as possible
    for(let i = 0 ; i < ScrollingMidpointDisplacerLinkedList.MAX_GENERATIONS; i++) {
      this.displace();
    }

    this.iterations = 0;
  }

  public render(p: p5) {
    this.lineSegments.forEach((l: SplittableLine) => {
       p.line(l.a.x, l.a.y, l.b.x, l.b.y);
    });
  }

  // Add a undisplaced line segment that starts from previous line segment
  public enqueue() {
    const last : SplittableLine = this.lineSegments.peekLast();
    const beginCoordinate = new Pair(last.b.x + 0, last.b.y + 0); 
    const endCoordinate = new Pair(beginCoordinate.x +
      ScrollingMidpointDisplacerLinkedList.INITIAL_LINE_WIDTH, Math.floor(this.verticalBound.y * Math.random()));
    const newLine = new SplittableLine(beginCoordinate, endCoordinate, 0, beginCoordinate.y - endCoordinate.y);
    this.lineSegments.push(newLine);
  }

  // Perform a single pass of midpoint displacement over every line segment
  public displace() {
    const lines = this.lineSegments;
    let i = this.lineSegments.length() - 1;
    while(i >= 0) {
      // TODO(automatwon): instead of using get. loop over the list in a single pass. add a iterator to doubly LinkedList
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

  // Shifts all the line segments horizontally
  public scroll() {
    const deltaX = ScrollingMidpointDisplacerLinkedList.MINIMUM_LINE_WIDTH;
    this.lineSegments.forEach((l: SplittableLine) => {
      l.translate(-1*deltaX, 0);
    });
  }

  public update() {
    this.iterations++;
      
    // Dequeue earliest line segments
    this.lineSegments.pop();

    this.displace();

    // Enqueue new undisplaced line
    if(this.iterations % this.enqueueInterval == 0) {
        this.enqueue();
    }

    this.scroll();
  }

  // Condition to stop looping
  static skipSplittableLine(l : SplittableLine) : boolean {
    return l.getGeneration() >= ScrollingMidpointDisplacerLinkedList.MAX_GENERATIONS - 1;
  }
}