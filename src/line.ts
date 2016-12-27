import {Pair} from './pair';

/**
 * class to represent pair of numbers
 *
 */

export class Line {
    public a: Pair;
    public b: Pair;
    constructor(a: Pair, b: Pair) {
        this.a = a;
        this.b = b;
    }
}