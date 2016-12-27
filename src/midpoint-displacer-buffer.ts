/**
 * Data Structure for set of line segments generated via midpoint displacement
 */
import {Line} from './line';

export class MidpointDisplacerBuffer {
  private lineSegments: Array<Line>;
  constructor(initialResolution: number) {
    this.lineSegments = new Array();
  }
}
