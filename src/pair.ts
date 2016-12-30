/**
 * class to represent pair of Ts
 *
 */

export class Pair<T> {
    public x : T;
    public y : T;
    constructor(x: T, y: T) {
        this.x = x;
        this.y = y;
    }

    public toString() {
        return `Pair(${this.x},${this.y})`;
    }
    
    public shallowClone() : Pair<T> {
        return new Pair(this.x, this.y);
    }
}