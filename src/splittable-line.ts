import {Pair} from './pair';

/**
 * class to represent Line segment with additional data for midpoint displacement splitting
 */

export class SplittableLine {
  static ROUGHNESS: number = .6;
  public a: Pair<number>;
  public b: Pair<number>;
  private generation: number;
  private baseDisplacement: number;

  constructor(a: Pair<number>, b: Pair<number>, generation: number, baseDisplacement: number) {
    this.a = a;
    this.b = b;
    this.generation = generation;
    this.baseDisplacement = baseDisplacement;
  }

  public toString() {
    return `Line(${this.a.toString()}->${this.b.toString()})`;
  }

  public getMidpoint() : Pair<number> {
    const x = (this.b.x + this.a.x) / 2;
    const y = (this.b.y + this.a.y) / 2;
    return new Pair<number>(x, y);
  }

  public nextDisplacementMagnitude() : number {
    const baseDisplacementScale = 2 ** (-1*SplittableLine.ROUGHNESS);
    const displacementScale =  baseDisplacementScale**this.generation;
    return this.baseDisplacement * displacementScale;
  }

  public getGeneration(): number {
    return this.generation;
  }

  public getBaseDisplacement(): number {
    return this.baseDisplacement;
  }

  public getSplit(verticalBound: Pair<number>): Pair<SplittableLine> {
    const displacementMagnitude = this.nextDisplacementMagnitude();
    const leftPoint : Pair<number> = this.a;
    const rightPoint : Pair<number>= this.b;

    // Compute displaced midpoint
    const midpoint : Pair<number> = this.getMidpoint();
    const verticallyDisplacedMidpointA : Pair<number> = this.displacePointVertically(
      midpoint, displacementMagnitude, verticalBound);
    const verticallyDisplacedMidpointB : Pair<number> = verticallyDisplacedMidpointA.shallowClone();

    const generation = this.getGeneration() + 1;
    const baseDisplacement = this.getBaseDisplacement();
    const leftSplittableLine : SplittableLine = new SplittableLine(leftPoint, verticallyDisplacedMidpointA, generation, baseDisplacement);
    const rightSplittableLine : SplittableLine = new SplittableLine(verticallyDisplacedMidpointB, rightPoint, generation, baseDisplacement);

    return new Pair(leftSplittableLine, rightSplittableLine);
  }

   private displacePointVertically(p: Pair<number>, displaceMagnitude: number, verticalBound: Pair<number>) : Pair<number>{
    let y = p.y + this.choose([displaceMagnitude, -displaceMagnitude]);
    
    // Bound the value to within window
    y = this.clamp(y, verticalBound.x, verticalBound.y);

    return new Pair(p.x, y);
  }

    // Private static final: move into utility or global.d.ts
  private choose(choices: Array<any>) {
    return choices[Math.floor(Math.random() * choices.length)];
  }

  private clamp(x: number, lowerBound: number, upperBound: number) {
    return Math.min(upperBound, Math.max(x, lowerBound));
  }

  public translate(x: number, y: number) {
    this.a.x += x;
    this.a.y += y;
    this.b.x += x;
    this.b.y += y;
  }
}