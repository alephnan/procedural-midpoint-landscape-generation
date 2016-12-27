/**
 * class to represent pair of numbers
 *
 */

export class Pair {
    public x : number;
    public y : number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public toString() {
        return `Pair(${this.x},${this.y})`;
    }
}