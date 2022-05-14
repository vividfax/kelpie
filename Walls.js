class Walls {

    constructor(w, h) {

        this.cells = [...Array(w)].map((e) => Array(h));
        this.cellsCache = [...Array(w)].map((e) => Array(h));

        this.create();
        this.updateCells();
        this.updateCells();
        this.updateCells();
    }

    create() {

        // randomise the values

        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {

                if (int(random(8)) == 1) {
                    this.cells[i][j] = true;
                } else {
                    this.cells[i][j] = false;
                }
            }
        }
    }


    updateCells() {

        // cache the cell values

        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {
                this.cellsCache[i][j] = this.cells[i][j];
            }
        }

        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {

                let neighbours = 0;

                // loop through the neighbouring cells

                for (let k = -1; k <= 1; k++) {
                    for (let l = -1; l <= 1; l++) {

                        // if the cell being queried is actually the current cell in question then skip it

                        if (k == 0 && l == 0) {
                            continue;
                        }

                        let x = i + k;
                        let y = j + l;

                        // i and j for the cell
                        // x and y for the cell's current neighbour
                        // check if x or y are outside the grid, if so wrap around

                        if (x < 0) {
                            x = this.cells.length - 1;
                        } else if (x >= this.cells.length) {
                            x = 0;
                        }

                        if (y < 0) {
                            y = this.cells[i].length - 1;
                        } else if (y >= this.cells[i].length) {
                            y = 0;
                        }

                        // add the current neighbours status to the neighbour count
                        neighbours += this.cellsCache[x][y];
                    }
                }

                // here's the conway's game of life rules
                // set the cell's new value here

                if (this.cellsCache[i][j] && neighbours <= 1) {
                    this.cells[i][j] = false;
                } else if (!this.cellsCache[i][j] && neighbours > 2) {
                    this.cells[i][j] = true;
                } else {
                    this.cells[i][j] = this.cellsCache[i][j];
                }
            }
        }
    }
}