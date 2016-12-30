import {Pair} from './pair';

/**
 * class to represent Line segment
 */

export class Line {
    public a: Pair<number>;
    public b: Pair<number>;
    constructor(a: Pair<number>, b: Pair<number>) {
        this.a = a;
        this.b = b;
    }

    public toString() {
        return `Line(${this.a.toString()}->${this.b.toString()})`;
    }

    public getMidpoint() : Pair<number> {
        const x = (this.b.x + this.a.x) / 2;
        const y = (this.b.y + this.a.y) / 2;
        return new Pair<number>(x, y);
    }
}