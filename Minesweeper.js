class Minesweeper {

    constructor(w, h, _gridWidth, _gridHeight, cellSize) {

        this.x = width/2;
        this.y = height/2;
        this.w = w;
        this.h = h;
        this.gridWidth = _gridWidth;
        this.gridHeight = _gridHeight;
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
                places.push("❤");

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

        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                newGrid[int(this.w/2)+i][int(this.h/2)+j] = "";
            }
        }
        newGrid[int(this.w/2)][int(this.h/2)] = "";

        return newGrid;
    }

    getClues(grid) {

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {

                if (grid[i][j] == "❤") {
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

                let targetX = i;
                let targetY = j;

                if (i < 0) targetX = this.w-1;
                if (i >= this.w) targetX = 0;
                if (j < 0) targetY = this.h-1;
                if (j >= this.h) targetY = 0;

                if (grid[targetX][targetY] == "❤") {
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

        if (player.stamina > 0) {
            this.visibility[x][y] = true;
            this.clearNeighbours(x, y);
        }
    }

    clearNeighbours(x, y) {

        for (let i = x-1; i <= x+1; i++) {
            for (let j = y-1; j <= y+1; j++) {

                if (i == x && j == y) {
                    continue;
                }

                let targetX = i;
                let targetY = j;

                if (i < 0) targetX = this.w-1;
                if (i >= this.w) targetX = 0;
                if (j < 0) targetY = this.h-1;
                if (j >= this.h) targetY = 0;

                if (!this.visibility[targetX][targetY]) {
                    this.visibility[targetX][targetY] = true;

                    if (this.grid[targetX][targetY] == "" || this.grid[targetX][targetY] == "~") {
                        this.clearNeighbours(targetX, targetY);
                    }
                }
            }
        }
    }

    eatCell(x, y) {

        if (player.stamina > 0) {
            if (this.grid[x][y] == "❤") {

                this.grid[x][y] = "♡";
                score++;
                player.stamina += 2;
            } else if (this.grid[x][y] == "" || this.grid[x][y] == "♡" || this.grid[x][y] == "~") {
                //
            } else {
                player.stamina -= this.grid[x][y];
                this.grid[x][y] = "~";
            }
        }
        else {
            if (this.grid[x][y] == "❤") {
                this.grid[x][y] = "♡";
                score++;
                player.stamina = 3;
            }
        }
    }

    display() {

        push();
        translate(this.x - this.w/2*this.cellSize, this.y - this.h/2*this.cellSize);

        fill(palette.fog);
        noStroke();
        rect(0, 0, this.w * this.cellSize, this.h * this.cellSize);

        console.log(player.x);

        for (let i = player.x-this.gridWidth; i < player.x+this.gridWidth; i++) {
            for (let j = player.y-this.gridHeight; j < player.y+this.gridHeight; j++) {

                let targetX = i;
                let targetY = j;

                if (i < 0) targetX = this.w-1;
                if (i >= this.w) targetX = 0;
                if (j < 0) targetY = this.h-1;
                if (j >= this.h) targetY = 0;

                const x = targetX * this.cellSize;
                const y = targetY * this.cellSize;
                const number = this.grid[targetX][targetY];

                if (this.visibility[targetX][targetY] == true) {

                    if (number == "❤" || number == "♡") {
                        fill(palette.water);
                    } else if (number == "") {
                        fill(palette.water);
                    } else if (number == 1) {
                        fill(palette.sand);
                    } else if (number == 2) {
                        fill(palette.grass);
                    } else if (number == 3) {
                        fill(palette.trees);
                    } else if (number == 4) {
                        fill(palette.mountain);
                    } else if (number >= 5) {
                        fill(palette.snow);
                    } else if (number == "~") {
                        fill(palette.river)
                    }

                    noStroke();
                    rect(x, y, this.cellSize, this.cellSize);

                    noStroke();
                    textAlign(CENTER, CENTER);
                    textFont("Fira Code");

                    if (number == "❤" || number == "♡") {
                        fill(palette.white);
                    } else if (number == "") {
                        fill(palette.white);
                    } else if (number == 1) {
                        fill(palette.black);
                    } else if (number == 2) {
                        fill(palette.black);
                    } else if (number == 3) {
                        fill(palette.white);
                    } else if (number == 4) {
                        fill(palette.white);
                    } else if (number >= 5) {
                        fill(palette.black);
                    } else if (number == "~") {
                        noFill();
                    }

                    if (number == "❤") {
                        textSize(this.cellSize * .6);
                    } else {
                        textSize(this.cellSize * .7);
                    }

                    text(number, x + this.cellSize / 2, y + this.cellSize / 2 + 2);
                }

            }
        }

        pop();
    }

    displayHeartsOnly() {

        push();
        translate(this.x - this.w/2*this.cellSize, this.y - this.h/2*this.cellSize);

        for (let i = player.x-this.gridWidth; i < player.x+this.gridWidth; i++) {
            for (let j = player.y-this.gridHeight; j < player.y+this.gridHeight; j++) {

                let targetX = i;
                let targetY = j;

                if (i < 0) targetX = this.w-1;
                if (i >= this.w) targetX = 0;
                if (j < 0) targetY = this.h-1;
                if (j >= this.h) targetY = 0;

                const x = targetX * this.cellSize;
                const y = targetY * this.cellSize;
                const number = this.grid[targetX][targetY];

                if (this.visibility[targetX][targetY] == true) {

                    if (number == "❤") {
                        textAlign(CENTER, CENTER);
                        fill(palette.white);
                        noStroke();
                        textSize(this.cellSize * .6);
                        text(number, x + this.cellSize / 2, y + this.cellSize / 2 + 2);
                    }
                }
            }
        }

        pop();
    }

    displaySurrounding(x, y) {

        push();
        translate(this.x - this.w/2*this.cellSize, this.y - this.h/2*this.cellSize);

        for (let i = x-1; i < x+2; i++) {
            for (let j = y-1; j < y+2; j++) {

                let targetX = i;
                let targetY = j;

                if (i < 0) targetX = this.w-1;
                if (i >= this.w) targetX = 0;
                if (j < 0) targetY = this.h-1;
                if (j >= this.h) targetY = 0;

                const number = this.grid[targetX][targetY];

                const _x = targetX * this.cellSize;
                const _y = targetY * this.cellSize;

                if (number == "❤" || number == "♡") {
                    fill(palette.water);
                } else if (number == "") {
                    fill(palette.water);
                } else if (number == 1) {
                    fill(palette.sand);
                } else if (number == 2) {
                    fill(palette.grass);
                } else if (number == 3) {
                    fill(palette.trees);
                } else if (number == 4) {
                    fill(palette.mountain);
                } else if (number >= 5) {
                    fill(palette.snow);
                } else if (number == "~") {
                    fill(palette.river)
                }

                noStroke();
                rect(_x, _y, this.cellSize, this.cellSize);

                noStroke();
                textAlign(CENTER, CENTER);
                textFont("Fira Code");

                if (number == "❤" || number == "♡") {
                    fill(palette.white);
                } else if (number == "") {
                    fill(palette.white);
                } else if (number == 1) {
                    fill(palette.black);
                } else if (number == 2) {
                    fill(palette.black);
                } else if (number == 3) {
                    fill(palette.white);
                } else if (number == 4) {
                    fill(palette.white);
                } else if (number >= 5) {
                    fill(palette.black);
                } else if (number == "~") {
                    noFill();
                }

                if (number == "❤") {
                    push();
                    fill(palette.ghosting);
                    rect(_x, _y, this.cellSize, this.cellSize);
                    pop();
                    textSize(this.cellSize * .6);
                    text(number, _x + this.cellSize / 2, _y + this.cellSize / 2 + 2);
                } else {
                    textSize(this.cellSize * .7);
                    text(number, _x + this.cellSize / 2, _y + this.cellSize / 2 + 2);
                    fill(palette.ghosting);
                    rect(_x, _y, this.cellSize, this.cellSize);
                }

            }
        }
        pop();
    }
}
