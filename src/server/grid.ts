import { Tile } from "./tile";

export class Grid {
    private cells: Tile[][];

    constructor(private size: number, previousState?: Tile[][]) {
        this.cells = previousState ? this.fromState(previousState) : this.empty();
    }

    empty() {
        const cells: Tile[][] = [];
        for (let x = 0; x < this.size; x++) {
            cells[x] = [];

            for (let y = 0; y < this.size; y++) {
                cells[x].push(new Tile(new Vector2(x, y), 0));
            }
        }
        return cells;
    }

    fromState(state: Tile[][]) {
        const cells: Tile[][] = [];
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                const tile = state[x][y];
                cells[x].push(new Tile(new Vector2(x, y), tile?.value || 0));
            }
        }
        return cells;
    }

    randomAvailableCell() {
        const cells = this.availableCells();
        if (cells.size()) {
            return cells[math.floor(math.random() * cells.size())];
        }
        return undefined;
    }

    availableCells() {
        const cells: Vector2[] = [];
        this.eachCell((x, y, tile) => {
            if (tile.value === 0) {
                cells.push(new Vector2(x, y));
            }
        });
        return cells;
    }

    eachCell(callback: (x: number, y: number, tile: Tile) => void) {
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                callback(x, y, this.cells[x][y]);
            }
        }
    }

    cellsAvailable() {
        return !!this.availableCells().size();
    }

    cellAvailable(pos: Vector2) {
        return !this.cellOccupied(pos);
    }

    cellOccupied(pos: Vector2) {
        return (this.cellContent(pos)?.value || 0) > 0;
    }

    cellContent(pos: Vector2) {
        if (this.withinBounds(pos)) {
            return this.cells[pos.X][pos.Y];
        }
        return new Tile(pos, 0);
    }

    insertTile(tile: Tile) {
        print(`inserting tile at X ${tile.position.X}, Y ${tile.position.Y} with value ${tile.value}`);
        this.cells[tile.position.X][tile.position.Y] = tile;
    }

    removeTile(tile: Tile) {
        this.cells[tile.position.X][tile.position.Y].value = 0;
    }

    moveTile(tile: Tile, pos: Vector2) {
        this.cells[tile.position.X][tile.position.Y] = new Tile(new Vector2(tile.position.X, tile.position.Y), 0);
        this.cells[pos.X][pos.Y] = tile;
        tile.updatePosition(pos);
    }

    withinBounds(pos: Vector2) {
        return pos.X >= 0 && pos.X < this.size && pos.Y >= 0 && pos.Y < this.size;
    }
}
