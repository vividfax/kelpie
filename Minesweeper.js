class Minesweeper {

    constructor(w, h, cellSize) {

        this.x = width/2;
        this.y = height/2;
        this.w = w;
        this.h = h;
        this.size = w * h;
        this.cellSize = cellSize;
        this.density = 0.2;

        this.grid = this.createMines();
        this.grid = this.getClues(this.grid);
        this.visibility = this.createFog();
    }

    createMines() {

        let numberOfMines = this.size * this.density;

        let places = [];

        for (let i = 0; i < this.size - 1; i++) {

            if (i < numberOfMines) {
                places.push("⁕");

            } else {
                places.push("");
            }
        }

        places = shuffle(places);

        let newGrid = [...Array(this.w)].map(e => Array(this.h));
        let place = 0;

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {

                newGrid[i][j] = places[place];
                place++;
            }
        }

        return newGrid;
    }

    getClues(grid) {

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {

                if (grid[i][j] == "⁕") {
                    continue;
                }
                const neighbours = this.getNeighbours(grid, i, j);

                if (neighbours != 0) {
                    grid[i][j] = neighbours;
                }
            }
        }
        return grid;
    }

    getNeighbours(grid, x, y) {

        let neighbours = 0;

        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {

                if (i == x && j == y) {
                    continue;
                }
                if (i < 0 || i >= this.w || j < 0 || j >= this.h) {
                    continue;
                }
                if (grid[i][j] == "⁕") {
                    neighbours += 1;
                }
            }
        }
        return neighbours;
    }

    createFog() {

        let fog = [...Array(this.w)].map(e => Array(this.h));

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {

                fog.push(true);
            }
        }

        return fog;
    }

    clearFog(x, y) {

        this.visibility[x][y] = true;

        this.clearNeighbours(x, y);
    }

    clearNeighbours(x, y) {

        for (let i = x-1; i <= x+1; i++) {
            for (let j = y-1; j <= y+1; j++) {

                if (i == x && j == y) {
                    continue;
                } else if (i < 0 || j < 0 || i >= this.w || j >= this.h) {
                    continue;
                }
                if (!this.visibility[i][j]) {
                    this.visibility[i][j] = true;

                    if (this.grid[i][j] == "") {
                        this.clearNeighbours(i, j);
                    }
                }
            }
        }
    }

    eatCell(x, y) {

        if (this.grid[x][y] == "⁕") {

            this.grid[x][y] = "-";
            score++;
            player.stamina += 2;
        } else if (this.grid[x][y] == "" || this.grid[x][y] == "-") {
            //
        } else {
            player.stamina -= this.grid[x][y];
            this.grid[x][y] = "";
        }
    }

    display() {

        push();
        translate(this.x - this.w/2*this.cellSize, this.y - this.h/2*this.cellSize);

        fill(dark);
        stroke(white);
        rect(0, 0, this.w * this.cellSize, this.h * this.cellSize);

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {

                const x = i * this.cellSize;
                const y = j * this.cellSize;
                const number = this.grid[i][j];

                if (this.visibility[i][j] == true) {

                    fill(white);
                    stroke(dark);
                    strokeWeight(1);
                    rect(x, y, this.cellSize, this.cellSize);

                    noStroke();
                    textAlign(CENTER, CENTER);
                    textFont("Fira Code");

                    if (number == "⁕") {

                        fill(dark);
                        textSize(this.cellSize);

                    } else {

                        fill(dark);
                        textSize(this.cellSize * .75);
                    }

                    text(number, x + this.cellSize / 2, y + this.cellSize / 2 + 2);
                }

            }
        }

        pop();
    }

    clicked(x, y) {

        x -= this.x;
        y -= this.y;

        let cellSize = 60/this.subw;

        for (let i = 0; i < this.size * this.subw; i++) {
            for (let j = 0; j < this.size * this.subh; j++) {

                if (x > i * cellSize && x < i * cellSize + cellSize) {
                    if (y > j * 60 / this.subh && y < j * 60 / this.subh + 60 / this.subh) {

                        if (startTime == "") {
                            startTime = new Date();
                            startTime = startTime.getTime();
                        }
                        if (mouseButton == LEFT && !this.flagged[i][j]) {

                            if (this.grid[i][j] == "⁕") {
                                this.explode();
                                lose = true;
                            } else if (this.grid[i][j] == "") {
                                this.visibility[i][j] = true;
                                this.freeNeighbours(i, j);
                            } else {
                                this.visibility[i][j] = true;
                            }
                        } else if (mouseButton != LEFT && !this.visibility[i][j]) {
                            this.flagged[i][j] = !this.flagged[i][j];
                        }
                        if (mouseButton == LEFT) {
                            this.chord(i, j);
                        }
                    }
                }
            }
        }
    }
}
