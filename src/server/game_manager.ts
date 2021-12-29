import { Grid } from "./grid";
import { Tile } from "./tile";

export type Direction = "up" | "right" | "down" | "left";

// based on https://github.com/gabrielecirulli/2048/blob/master/js/game_manager.js
export class GameManager {
    private size = 4;
    private startTiles = 2;

    public won = false;
    public gameOver = false;
    public score = 0;
    public grid!: Grid;

    constructor() {
        this.setup();
    }

    setup() {
        this.grid = new Grid(this.size);
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        this.addStartTiles();
    }

    addStartTiles() {
        for (let i = 0; i < this.startTiles; i++) {
            this.addRandomTile();
        }
    }

    addRandomTile() {
        const pos = this.grid.randomAvailableCell();
        if (pos) {
            const value = math.random() < 0.9 ? 2 : 4;
            const tile = new Tile(pos, value);
            this.grid.insertTile(tile);
        }
    }

    prepareTiles() {
        this.grid.eachCell((x, y, tile) => {
            if (tile.value > 0) {
                tile.mergedFrom = undefined;
                tile.savePosition();
            }
        });
    }

    move(dir: Direction) {
        if (this.isGameTerminated()) return;

        const vector = this.getVector(dir);
        const traversals = this.buildTraversals(vector);
        let moved = false;

        this.prepareTiles();

        traversals.x.forEach((x) => {
            traversals.y.forEach((y) => {
                const pos = new Vector2(x, y);
                const tile = this.grid.cellContent(pos);

                if (tile.value > 0) {
                    const positions = this.findFarthestPosition(pos, vector);
                    const nextTile = this.grid.cellContent(positions.next);

                    // only one merger per row traversal?
                    if (nextTile.value === tile.value && !nextTile.mergedFrom) {
                        const merged = new Tile(positions.next, tile.value * 2);
                        merged.mergedFrom = { tile, next: nextTile };

                        this.grid.insertTile(merged);
                        this.grid.removeTile(tile);

                        // converge the two tiles' positions
                        tile.updatePosition(positions.next);

                        // update score
                        this.score += merged.value;

                        // the mighty 2048 tile
                        if (merged.value === 2048) {
                            this.won = true;
                        }
                    } else {
                        this.grid.moveTile(tile, positions.farthest);
                    }

                    if (!this.positionsEqual(pos, tile.position)) {
                        moved = true;
                    }
                }
            });
        });

        if (moved) {
            this.addRandomTile();

            if (!this.movesAvailable()) {
                this.gameOver = true;
            }
        }
    }

    isGameTerminated() {
        return this.gameOver || this.won;
    }

    getVector(dir: Direction) {
        switch (dir) {
            case "up":
                return new Vector2(0, -1);
            case "right":
                return new Vector2(1, 0);
            case "down":
                return new Vector2(0, 1);
            case "left":
                return new Vector2(-1, 0);
        }
    }

    buildTraversals(vector: Vector2) {
        const traversals: { x: number[]; y: number[] } = { x: [], y: [] };

        for (let pos = 0; pos < this.size; pos++) {
            traversals.x.push(pos);
            traversals.y.push(pos);
        }

        if (vector.X === 1) this.reverseArray(traversals.x);
        if (vector.Y === 1) this.reverseArray(traversals.y);

        return traversals;
    }

    findFarthestPosition(pos: Vector2, vector: Vector2) {
        print(`Farthest pos for ${pos.X},${pos.Y}`);
        let previous;
        do {
            previous = pos;
            pos = new Vector2(previous.X + vector.X, previous.Y + vector.Y);
        } while (this.grid.withinBounds(pos) && this.grid.cellAvailable(pos));
        print(`-- farthest ${previous.X}, ${previous.Y}, next ${pos.X},${pos.Y}`);

        return {
            farthest: previous,
            next: pos, // used to check if a merge is required
        };
    }

    movesAvailable() {
        return this.grid.cellsAvailable() || this.tileMatchesAvailable();
    }

    tileMatchesAvailable() {
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                const tile = this.grid.cellContent(new Vector2(x, y));
                if (tile.value > 0) {
                    (["up", "down", "left", "right"] as Direction[]).forEach((dir) => {
                        const vector = this.getVector(dir);
                        const pos = new Vector2(x + vector.X, y + vector.Y);
                        const other = this.grid.cellContent(pos);
                        if (other.value === tile.value) {
                            return true;
                        }
                    });
                }
            }
        }
        return false;
    }

    positionsEqual(pos1: Vector2, pos2: Vector2) {
        return pos1.X === pos2.X && pos1.Y === pos2.Y;
    }

    /**
     * Reverses an array in place, https://www.geeksforgeeks.org/reverse-an-array-in-java/
     * @param array array to reverse
     */
    private reverseArray<T>(array: Array<T>) {
        const len = array.size();
        for (let i = 0; i < len / 2; i++) {
            const temp = array[i];
            array[i] = array[len - i - 1];
            array[len - i - 1] = temp;
        }
    }
}
