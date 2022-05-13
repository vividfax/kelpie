class Player {

    constructor(sweep, cellSize) {

        this.symbol = symbols.smiley;
        this.x;
        this.y;
        this.gridWidth = sweep.w;
        this.gridHeight = sweep.h;
        this.cellSize = cellSize;

        this.stamina = 5;

        this.placePlayer(sweep);

        this.cameraX = 0;
        this.cameraY = 0;
    }

    placePlayer(sweep) {

        let middleX = int(sweep.w/2);
        let middleY = int(sweep.h/2);

        this.x = middleX;
        this.y = middleY;
    }

    move(x, y) {

        this.x += x;
        this.y += y;

        if (this.x >= this.gridWidth) this.x = 0;
        if (this.x < 0) this.x = this.gridWidth-1;
        if (this.y >= this.gridHeight) this.y = 0;
        if (this.y < 0) this.y = this.gridHeight-1;

        this.cameraX -= x;
        this.cameraY -= y;

        if (this.cameraX > gridWidth*0.25 || this.cameraX < -gridWidth*0.25) {
            this.cameraX += x;
        }

        if (this.cameraY > gridHeight*0.25 || this.cameraY < -gridHeight*0.25) {
            this.cameraY += y;
        }
    }

    display() {

        if (player.stamina <= 0) {

            push();

            translate(width/2 - this.gridWidth/2*this.cellSize, height/2 - this.gridHeight/2*this.cellSize);
            translate(this.x*this.cellSize + this.cellSize / 2 + 16/30*this.cellSize, this.y*this.cellSize + this.cellSize / 2 - 7/30*this.cellSize);
            rotate(180);

            noStroke();
            fill(palette.white);
            textSize(this.cellSize);
            text(this.symbol, 0, 0);

            pop();

        } else {

            push();
            translate(width/2 - this.gridWidth/2*this.cellSize, height/2 - this.gridHeight/2*this.cellSize);

            if (player.stamina <= 0) {
                noFill();
            } else if (sweep.grid[this.x][this.y] == symbols.emptyHeart || sweep.grid[this.x][this.y] == "" || sweep.grid[this.x][this.y] == symbols.house) {
                fill(palette.water);
            } else if (sweep.grid[this.x][this.y] == symbols.river) {
                fill(palette.river);
            }

            noStroke();
            rect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);

            fill(palette.white);
            textSize(this.cellSize);
            text(this.symbol, this.x*this.cellSize + this.cellSize / 2 - 16/30*this.cellSize, this.y*this.cellSize + this.cellSize / 2 + 7/30*this.cellSize);

            pop();
        }
    }
}
