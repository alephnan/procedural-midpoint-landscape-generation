import {Pair} from './pair';

/**
 * class to represent Line segment
 */

export class Line {
    public a: Pair;
    public b: Pair;
    constructor(a: Pair, b: Pair) {
        this.a = a;
        this.b = b;
    }
}