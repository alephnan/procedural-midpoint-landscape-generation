/**
 * Data Structure for set of line segments generated via midpoint displacement
 */
import {Pair} from './pair';

export class MidpointDisplacer {
  private lineSegments: Array<Pair>;
  constructor(initialResolution: number) {
    this.lineSegments = new Array();
  }
}
