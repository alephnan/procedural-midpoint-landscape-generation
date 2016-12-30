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
}