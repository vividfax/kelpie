class Minesweeper {

    constructor(w, h, _gridWidth, _gridHeight, walls) {

        this.x = width/2;
        this.y = height/2;
        this.w = w;
        this.h = h;
        this.gridWidth = _gridWidth;
        this.gridHeight = _gridHeight;
        this.size = w * h;
        this.density = 0.2;

        this.walls = walls.cells;
        this.mineGrid = this.createMines();
        this.placeChests();
        this.placeRooms();
        this.grid = JSON.parse(JSON.stringify(this.mineGrid));
        this.grid = this.getClues(this.grid);
        this.visibility = this.createFog();
    }

    createMines() {

        let numberOfMines = this.size * this.density;

        let places = [];

        for (let i = 0; i < this.size - 1; i++) {

            if (i < numberOfMines) {
                places.push(symbols.heart);

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

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                if (this.walls[i][j]) {
                    newGrid[i][j] = symbols.wall;
                }
            }
        }

        for (let i = -2; i < 3; i++) {
            for (let j = -2; j < 3; j++) {
                newGrid[int(this.w/2)+i][int(this.h/2)+j] = "";
            }
        }

        return newGrid;
    }

    placeChests() {

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {

                if (int(random(30)) == 1) {

                    this.mineGrid[i][j] = symbols.envelope;
                    chests.push(new Chest(i, j));
                }
            }
        }
    }

    placeRooms() {

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {

                if (int(random(30)) == 1) {

                    this.mineGrid[i][j] = symbols.door;
                    rooms.push(new Room(i, j));
                }
            }
        }
    }

    getClues(grid) {

        let gridCache = grid

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {

                // if (grid[i][j][0] == symbols.heart) {
                //     continue;
                // }
                const neighbours = this.getNeighbours(gridCache, i, j);

                if (neighbours != 0) {

                    if (grid[i][j] == symbols.heart) {
                        grid[i][j] += neighbours;
                    } else {
                        grid[i][j] = neighbours;
                    }
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

                if (grid[targetX][targetY] != null && grid[targetX][targetY].toString().includes(symbols.heart)) {

                //if (grid[targetX][targetY] == symbols.heart) {
                    neighbours += 1;
                }
            }
        }

        if (grid[x][y] == symbols.heart) neighbours += 1;

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

                    if (this.grid[targetX][targetY] == "" || this.grid[targetX][targetY] == symbols.river || this.grid[targetX][targetY] == symbols.wall || this.grid[targetX][targetY] == symbols.envelope || this.grid[targetX][targetY] == symbols.openedLetter || this.grid[targetX][targetY] == symbols.door) {
                        this.clearNeighbours(targetX, targetY);
                    }
                }
            }
        }
    }

    eatCell(x, y) {

        if (this.grid[x][y] == symbols.envelope || this.grid[x][y] == symbols.openedLetter || this.grid[x][y] == symbols.door) {

        } else if (player.stamina > 0) {
            if (this.grid[x][y][0] == symbols.heart) {

                this.grid[x][y] = symbols.emptyHeart;
                player.stamina += 2;
            } else if (this.grid[x][y] == "" || this.grid[x][y] == symbols.emptyHeart || this.grid[x][y] == symbols.river || this.grid[x][y] == symbols.house) {
                //
            } else {
                player.stamina -= this.grid[x][y];
                this.grid[x][y] = symbols.river;
            }
        }
    }

    placeHouse(x, y) {

        this.grid[x][y] = symbols.house;
    }

    reset() {

        this.grid = JSON.parse(JSON.stringify(this.mineGrid));
        this.grid = this.getClues(this.grid);
        this.visibility = this.createFog();
        this.placeHouse(player.x, player.y);
    }

    display() {

        push();
        translate(this.x - this.w/2*cellSize, this.y - this.h/2*cellSize);

        fill(palette.fog);
        noStroke();
        rect(0, 0, this.w * cellSize, this.h * cellSize);

        for (let i = int(player.x-this.gridWidth*1/mapScale); i < int(player.x+this.gridWidth*1/mapScale); i++) {
            for (let j = int(player.y-this.gridHeight*1/mapScale); j < int(player.y+this.gridHeight*1/mapScale); j++) {

                let targetX = i;
                let targetY = j;

                if (i < 0) targetX = this.w-1;
                if (i >= this.w) targetX = 0;
                if (j < 0) targetY = this.h-1;
                if (j >= this.h) targetY = 0;

                const x = targetX * cellSize;
                const y = targetY * cellSize;
                const number = this.grid[targetX][targetY];

                if (this.visibility[targetX][targetY] == true) {

                    if (number == symbols.house) {
                        fill(palette.water);
                    } else if (number == "") {
                        fill(palette.water);
                    } else if (number.toString().includes("1")) {
                        fill(palette.sand);
                    } else if (number.toString().includes("2")) {
                        fill(palette.grass);
                    } else if (number.toString().includes("3")) {
                        fill(palette.trees);
                    } else if (number.toString().includes("4")) {
                        fill(palette.mountain);
                    } else if (number.toString().includes("5") || number.toString().includes("6") || number.toString().includes("7") || number.toString().includes("8")) {
                        fill(palette.snow);
                    } else if (number == symbols.river || number == symbols.emptyHeart) {
                        fill(palette.river)
                    } else if (number == symbols.wall) {
                        fill(palette.wall)
                    } else if (number == symbols.envelope || number == symbols.openedLetter) {
                        fill(palette.water)
                    } else if (number == symbols.door) {
                        fill(palette.water)
                    }

                    noStroke();
                    rect(x, y, cellSize, cellSize);

                    noStroke();
                    textAlign(CENTER, CENTER);
                    textFont("Fira Code");

                    if (number == symbols.house) {
                        fill(palette.white);
                    } else if (number == "") {
                        fill(palette.white);
                    } else if (number.toString().includes("1")) {
                        fill(palette.black);
                    } else if (number.toString().includes("2")) {
                        fill(palette.black);
                    } else if (number.toString().includes("3")) {
                        fill(palette.white);
                    } else if (number.toString().includes("4")) {
                        fill(palette.white);
                    } else if (number.toString().includes("5") || number.toString().includes("6") || number.toString().includes("7") || number.toString().includes("8")) {
                        fill(palette.black);
                    } else if (number == symbols.river) {
                        noFill();
                    } else if (number == symbols.wall) {
                        fill(palette.black);
                    } else if (number == symbols.envelope || number == symbols.openedLetter || number == symbols.emptyHeart) {
                        fill(palette.white)
                    } else if (number == symbols.door) {
                        fill(palette.white)
                    }

                    if (number[0] == symbols.heart) {
                        textSize(cellSize * .6);
                    } else {
                        textSize(cellSize * .7);
                    }

                    text(number.toString()[0], x + cellSize / 2, y + cellSize / 2 + 2);

                    if (player.stamina <= 0) {
                        noStroke();
                        fill(palette.ghosting);
                        rect(x, y, cellSize, cellSize);
                    }
                }
            }
        }

        pop();
    }

    displayHeartsOnly() {

        push();
        translate(this.x - this.w/2*cellSize, this.y - this.h/2*cellSize);

        for (let i = player.x-this.gridWidth; i < player.x+this.gridWidth; i++) {
            for (let j = player.y-this.gridHeight; j < player.y+this.gridHeight; j++) {

                let targetX = i;
                let targetY = j;

                if (i < 0) targetX = this.w-1;
                if (i >= this.w) targetX = 0;
                if (j < 0) targetY = this.h-1;
                if (j >= this.h) targetY = 0;

                const x = targetX * cellSize;
                const y = targetY * cellSize;
                const number = this.grid[targetX][targetY];

                if (this.visibility[targetX][targetY] == true) {

                    if (number[0] == symbols.heart) {
                        textAlign(CENTER, CENTER);
                        fill(palette.white);
                        noStroke();
                        textSize(cellSize * .6);
                        text(number, x + cellSize / 2, y + cellSize / 2 + 2);
                    }
                }
            }
        }

        pop();
    }

    displaySurrounding(x, y) {

        push();
        translate(this.x - this.w/2*cellSize, this.y - this.h/2*cellSize);

        for (let i = x-1; i < x+2; i++) {
            for (let j = y-1; j < y+2; j++) {

                let targetX = i;
                let targetY = j;

                if (i < 0) targetX = this.w-1;
                if (i >= this.w) targetX = 0;
                if (j < 0) targetY = this.h-1;
                if (j >= this.h) targetY = 0;

                if (this.visibility[targetX][targetY] == true) {
                    continue;
                }

                const number = this.grid[targetX][targetY];

                const _x = targetX * cellSize;
                const _y = targetY * cellSize;

                if (number[0] == symbols.heart || number == symbols.emptyHeart) {
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
                } else if (number == symbols.river) {
                    fill(palette.river)
                }

                noStroke();
                rect(_x, _y, cellSize, cellSize);

                noStroke();
                textAlign(CENTER, CENTER);
                textFont("Fira Code");

                if (number[0] == symbols.heart || number == symbols.emptyHeart) {
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
                } else if (number == symbols.river) {
                    noFill();
                }

                if (number[0] == symbols.heart) {
                    textSize(cellSize * .6);
                } else {
                    textSize(cellSize * .7);
                }

                text(number[0], _x + cellSize / 2, _y + cellSize / 2 + 2);
                fill(palette.ghosting);
                rect(_x, _y, cellSize, cellSize);
            }
        }
        pop();
    }
}
