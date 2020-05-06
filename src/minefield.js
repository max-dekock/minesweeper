export default class Minefield {
    constructor(rows, cols, numMines) {
        if (numMines >= rows * cols) {
            throw "too many mines";
        }
        this.rows = rows;
        this.cols = cols;
        this.numMines = numMines;

        this.mines = [];
        for (let x = 0; x < rows; x++) {
            this.mines[x] = Array(cols).fill(false);
        }

        for (let minesPlaced = 0; minesPlaced < numMines; ) {
            let x = Math.floor(Math.random() * rows);
            let y = Math.floor(Math.random() * cols);
            if (!this.mines[x][y]) {
                this.mines[x][y] = true;
                minesPlaced++;
            }
        }
    }

    isMine(x, y) {
        return Boolean(this.mines[x][y]);
    }

    adjCoords(x, y) {
        return [
            [-1,-1], [-1, 0], [-1,+1],
            [ 0,-1],          [ 0,+1],
            [+1,-1], [+1, 0], [+1,+1]
        ]
            .map(([dx, dy]) => [x + dx, y + dy])
            .filter(([ax, ay]) => ax in this.mines && ay in this.mines[ax]);
    }

    adjMines(x, y) {
        return this.adjCoords(x, y)
            .map(([ax, ay]) => this.mines[ax][ay])
            .filter(v => v)
            .length;
    }

    get mineCoords() {
        return this.mines.map(
            (col, x) => col.map(
                (v, y) => [x,y]
            ).filter(
                ([x,y]) => this.mines[x][y]
            )
        );
    }
}