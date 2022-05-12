class Player {

    constructor(sweep, cellSize) {

        this.symbol = "☻";
        this.x;
        this.y;
        this.gridWidth = sweep.w;
        this.gridHeight = sweep.h;
        this.cellSize = cellSize;

        this.stamina = 3;

        this.placePlayer(sweep);

        this.positionX = 0;
        this.positionY = 0;
    }

    placePlayer(sweep) {

        let middleX = int(sweep.w/2);
        let middleY = int(sweep.h/2);

        // while (sweep.grid[middleX][middleY] != "") {

        //     middleX++;

        //     if (middleX >= sweep.grid[middleX].length) {
        //         middleY++;
        //         middleX = 0;
        //     }
        // }

        this.x = middleX;
        this.y = middleY;
    }

    display() {

        if (player.stamina <= 0) {

            push();

            translate(width/2 - this.gridWidth/2*this.cellSize, height/2 - this.gridHeight/2*this.cellSize);
            translate(this.x*this.cellSize + this.cellSize / 2 + 16/30*this.cellSize, this.y*this.cellSize + this.cellSize / 2 - 7/30*this.cellSize);
            rotate(180);

            noStroke();
            fill(white);
            textSize(this.cellSize);
            text(this.symbol, 0, 0);

            pop();

        } else {

            push();
            translate(width/2 - this.gridWidth/2*this.cellSize, height/2 - this.gridHeight/2*this.cellSize);

            if (player.stamina <= 0) {
                noFill();
            } else if (sweep.grid[this.x][this.y] == "♡" || sweep.grid[this.x][this.y] == "") {
                fill(palette.water);
            } else if (sweep.grid[this.x][this.y] == "~") {
                fill(palette.river);
            }

            noStroke();
            rect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);

            fill(white);
            textSize(this.cellSize);
            text(this.symbol, this.x*this.cellSize + this.cellSize / 2 - 16/30*this.cellSize, this.y*this.cellSize + this.cellSize / 2 + 7/30*this.cellSize);

            pop();
        }
    }

    move(x, y) {

        this.x += x;
        this.y += y;

        if (this.x >= this.gridWidth) this.x = 0;
        if (this.x < 0) this.x = this.gridWidth-1;
        if (this.y >= this.gridHeight) this.y = 0;
        if (this.y < 0) this.y = this.gridHeight-1;

        this.positionX -= x;
        this.positionY -= y;

        if (this.positionX > gridWidth*0.25 || this.positionX < -gridWidth*0.25) {
            this.positionX += x;
        }

        if (this.positionY > gridHeight*0.25 || this.positionY < -gridHeight*0.25) {
            this.positionY += y;
        }
    }
}
