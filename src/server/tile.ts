export class Tile {
    private previousPosition: Vector2 = Vector2.zero;

    public mergedFrom: { tile: Tile; next: Tile } | undefined;

    constructor(public position: Vector2, public value: number) {}

    savePosition() {
        this.previousPosition = this.position;
    }

    updatePosition(position: Vector2) {
        this.position = position;
    }
}
