class Shop {

    constructor(x, y, h, onlyPickaxes) {

        this.x = x * cellSize;
        this.y = y * cellSize;
        this.height = h;
        this.symbol = symbols.door;
        this.fog = true;
        this.onlyPickaxes = onlyPickaxes;

        this.w = 9;
        this.h = 6;
        this.grid;
        this.generatedRoom = false;
    }

    generateRoom() {

        this.generatedRoom = true;

        this.grid = [...Array(this.w)].map(e => Array(this.h));

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {

                if (i == 0 || i == this.w-1 || j == 0 || j == this.h-1 ) {
                    this.grid[i][j] = new Rock(i, j);
                } else {
                    this.grid[i][j] = new EmptyCell(i, j);
                    this.grid[i][j].height = this.height;
                }
            }
        }

        let randomisedItems = shuffle(items);

        if (this.onlyPickaxes) randomisedItems = [items[0]];

        for (let i = 0; i < 3; i++) {
            if (!randomisedItems[i]) {
                this.grid[(i+1)*2][2] = new Note((i+1)*2, 2, this.height);
            } else {
                this.grid[(i+1)*2][2] = new Item(randomisedItems[i], (i+1)*2, 2, this.height);
            }
        }

        this.grid[4][4].symbol = symbols.door;
    }

    display() {

        if (this.height == -1) {
            fill(palette.wall);
        } else if (this.height == 0) {
            fill(palette.water);
        } else if (this.height == 1) {
            fill(palette.sand);
        } else if (this.height == 2) {
            fill(palette.grass);
        } else if (this.height == 3) {
            fill(palette.trees);
        } else if (this.height == 4) {
            fill(palette.mountain);
        } else if (this.height >= 5) {
            fill(palette.snow);
        }

        rect(this.x, this.y, cellSize);

        if (this.height == 1 || this.height == 2 || this.height >= 5) {
            fill(palette.black);
        } else {
            fill(palette.white);
        }

        textSize(cellSize * 0.7);
        text(this.symbol, this.x + cellSize / 2, this.y + cellSize / 2 + 2);
    }

    displayRoom() {

        if (!this.generatedRoom) this.generateRoom();

        push();
	    //translate(-cellSize/2, -cellSize/2);
        translate(-this.w/2 * cellSize + width/2, -this.h/2 * cellSize + height/2);

        background(palette.black);

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {

                if (this.grid[i][j] instanceof Rock) continue;

                this.grid[i][j].display();
            }
        }
        pop();
    }
}