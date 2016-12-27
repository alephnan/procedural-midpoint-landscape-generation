/// <reference path="p5.d.ts" />

export interface TerrainGenerator {
    render(p: p5): void;
    update(): void;
}