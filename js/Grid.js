class Grid {

    constructor(w, h) {

        this.width = w;
        this.height = h;
        this.grid = this.new2dArray();
        this.mineDensity = 0.2;

        this.createGrid();
    }

    new2dArray() {

        let arr = [...Array(this.width)].map(e => Array(this.height));

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                arr[i][j] = false;
            }
        }

        return arr;
    }

    createGrid() {

        let rocksGrid = this.generateRocks();

        rocksGrid = this.growRocks(rocksGrid);
        rocksGrid = this.growRocks(rocksGrid);
        rocksGrid = this.growRocks(rocksGrid);
        this.placeRocks(rocksGrid);

        this.generateMines();
        this.generateDeserts();
        this.generateLakes();

        this.placeEmptyCells();
        this.clearAreaAroundPlayer(2);
        this.calculateHeight();

        this.placeShops();
        this.placeNotes();
        this.placeNPCs();
        this.clearAreaAroundPlayer(1);
        this.placeHouse();
    }

    generateRocks() {

        let rocksGrid = this.new2dArray();

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                if (int(random(8)) == 1) {
                    rocksGrid[i][j] = true
                } else {
                    rocksGrid[i][j] = false;
                }

                if (i > worldWidth/2 - 20 && i < worldWidth/2 + 20 && j > worldHeight/2 - 20 && j < worldHeight/2 + 20) rocksGrid[i][j] = false;
            }
        }

        return rocksGrid;
    }

    growRocks(rocksGrid) {

        let cache = this.new2dArray();

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                cache[i][j] = rocksGrid[i][j];
            }
        }

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                let numberOfNeighbours = 0;

                for (let k = -1; k <= 1; k++) {
                    for (let l = -1; l <= 1; l++) {

                        if (k == 0 && l == 0) continue;

                        let x = i + k;
                        let y = j + l;

                        if (x < 0) {
                            x = this.width - 1;
                        } else if (x >= this.width) {
                            x = 0;
                        }

                        if (y < 0) {
                            y = this.height - 1;
                        } else if (y >= this.height) {
                            y = 0;
                        }

                        numberOfNeighbours += cache[x][y];
                    }
                }

                let isAlive = cache[i][j];

                if (isAlive && numberOfNeighbours <= 1) {
                    rocksGrid[i][j] = false;
                } else if (!isAlive && numberOfNeighbours > 2) {
                    rocksGrid[i][j] = true;
                }
            }
        }

        return rocksGrid;
    }

    placeRocks(rocksGrid) {

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                if (rocksGrid[i][j]) {
                    this.grid[i][j] = new Rock(i, j);
                }
            }
        }
    }

    generateMines() {

        let mineArray = [];
        let numberOfMines = this.width*this.height * this.mineDensity;

        for (let i = 0; i < this.width * this.height; i++) {

            if (i < numberOfMines) {
                mineArray.push(true);
            } else {
                mineArray.push(false);
            }
        }

        mineArray = shuffle(mineArray);

        let place = 0;

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                if (mineArray[place] == true && this.grid[i][j] instanceof Rock == false) {
                    this.grid[i][j] = new Mine(i, j);
                }

                place++;
            }
        }
    }

    generateDeserts() {

        for (let i = 0; i < 200; i++) {

            let randomX = int(random(worldWidth));
            let randomY = int(random(worldHeight));
            let randomWidth = int(random(10, 60));
            let randomHeight = int(random(10, 60));

            for (let j = randomX; j < randomX + randomWidth; j++) {
                for (let k = randomY; k < randomY + randomHeight; k++) {

                    let targetX = j;
                    let targetY = k;

                    if (targetX >= worldWidth) targetX -= worldWidth;
                    if (targetY >= worldHeight) targetY -= worldHeight;

                    if (targetX > worldWidth/2 - 30 && targetX < worldWidth/2 + 30 && targetY > worldHeight/2 - 30 && targetY < worldHeight/2 + 30) continue;

                    let cell = this.grid[targetX][targetY];

                    if (cell instanceof Mine && random(2) > 1) this.grid[targetX][targetY] = false;
                }
            }
        }
    }

    generateLakes() {

        for (let i = 0; i < 200; i++) {

            let randomX = int(random(worldWidth));
            let randomY = int(random(worldHeight));
            let randomWidth = int(random(10, 30));
            let randomHeight = int(random(10, 30));

            for (let j = randomX; j < randomX + randomWidth; j++) {
                for (let k = randomY; k < randomY + randomHeight; k++) {

                    let targetX = j;
                    let targetY = k;

                    if (targetX >= worldWidth) targetX -= worldWidth;
                    if (targetY >= worldHeight) targetY -= worldHeight;

                    if (targetX > worldWidth/2 - 100 && targetX < worldWidth/2 + 100 && targetY > worldHeight/2 - 100 && targetY < worldHeight/2 + 100) continue;

                    let cell = this.grid[targetX][targetY];

                    if (cell instanceof Mine) this.grid[targetX][targetY] = false;
                }
            }
        }
    }

    placeEmptyCells() {

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {


                if (this.grid[i][j] == false) this.grid[i][j] = new EmptyCell(i, j);
            }
        }
    }

    clearAreaAroundPlayer(radius) {

        for (let i = -radius; i < radius+1; i++) {
            for (let j = -radius; j < radius+1; j++) {

                this.grid[int(this.width/2)+i][int(this.height/2)+j] = new EmptyCell(int(this.width/2)+i, int(this.height/2)+j);
            }
        }
    }

    calculateHeight() {

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                let numberOfNeighbours = this.getNumberOfNeighbours(i , j);

                if (numberOfNeighbours != 0) {

                    if (this.grid[i][j] instanceof Rock) {
                        this.grid[i][j] = new EmptyCell(i, j);
                    }

                    this.grid[i][j].height = numberOfNeighbours;
                }
            }
        }
    }

    getNumberOfNeighbours(x, y) {

        let numberOfNeighbours = 0;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {

                if (i == 0 && j == 0) continue;

                let targetX = x + i;
                let targetY = y + j;

                if (targetX < 0) targetX = this.width-1;
                else if (targetX >= this.width) targetX = 0;
                if (targetY < 0) targetY = this.height-1;
                else if (targetY >= this.height) targetY = 0;

                if (this.grid[targetX][targetY] instanceof Mine) numberOfNeighbours++;
            }
        }

        if (this.grid[x][y] instanceof Mine) numberOfNeighbours++;

        return numberOfNeighbours;
    }

    clearFog(x, y) {

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {

                if (i == 0 && j == 0) continue;

                let targetX = x + i;
                let targetY = y + j;

                if (targetX < 0) targetX = this.width-1;
                else if (targetX >= this.width) targetX = 0;
                if (targetY < 0) targetY = this.height-1;
                else if (targetY >= this.height) targetY = 0;

                let cell = this.grid[targetX][targetY];

                if (this.grid[targetX][targetY].fog) {
                    this.grid[targetX][targetY].fog = false;

                    if (cell.height <= 0) this.clearFog(targetX, targetY);
                }
            }
        }
    }

    placeShops() {

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                let cell = this.grid[i][j];

                if (int(random(300)) == 1 && (cell instanceof EmptyCell && cell.height == 0)) {

                    let h = cell.height;
                    if (cell instanceof Rock) h = -1;

                    this.grid[i][j] = new Shop(i, j, h);
                }
            }
        }
    }

    placeNotes() {

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                let cell = this.grid[i][j];

                if ((int(random(30)) == 1 && cell instanceof Rock) || ((int(random(10)) == 1 && cell instanceof EmptyCell && cell.height == 0))) {

                    let h = cell.height;
                    if (cell instanceof Rock) h = -1;

                    this.grid[i][j] = new Note(i, j, h);
                }
            }
        }
    }

    placeNPCs() {

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                let cell = this.grid[i][j];

                if (int(random(20)) == 1 && (cell instanceof EmptyCell && cell.height == 0)) {

                    this.grid[i][j] = new NPC(i, j);
                }
            }
        }
    }

    placeHouse() {

        let house = new House(int(this.width/2), int(this.height/2));
        this.grid[int(this.width/2)][int(this.height/2)] = house;
        houses.push(house);
    }

    reset() {

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                this.grid[i][j].fog = true;

                if (this.grid[i][j].eaten) this.grid[i][j].eaten = false;
            }
        }

        for (let i = 0; i < houses.length; i++) {

            this.clearFog(houses[i].x/cellSize, houses[i].y/cellSize);
        }
    }

    display() {

        push();
	    translate(-cellSize/2, -cellSize/2);
        translate(-player.x * cellSize + width/2, -player.y * cellSize + height/2);

        let visibleGridWidth = int(width/cellSize/2) * 1/renderScale;
        let visibleGridHeight = int(height/cellSize/2) * 1/renderScale;

        for (let i = player.x+player.cameraX - visibleGridWidth; i < player.x+player.cameraX + visibleGridWidth+1; i++) {
            for (let j = player.y+player.cameraY - visibleGridHeight; j < player.y+player.cameraY + visibleGridHeight+1; j++) {

                let targetX = i;
                let targetY = j;

                if (targetX >= worldWidth || targetX < 0) targetX = mod(targetX, worldWidth);
                if (targetY >= worldHeight || targetY < 0)  targetY = mod(targetY, worldHeight);

                push();
                if (targetX > i) translate(-worldWidth*cellSize, 0);
                else if (targetX < i) translate(worldWidth*cellSize, 0);
                if (targetY > j) translate(0, -worldHeight*cellSize);
                else if (targetY < j) translate(0, worldHeight*cellSize);

                if (!this.grid[targetX][targetY].fog) this.grid[targetX][targetY].display();
                pop();
            }
        }

        pop();
    }
}
