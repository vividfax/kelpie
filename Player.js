class Player {

    constructor(sweep) {

        this.symbol = symbols.smiley;
        this.x;
        this.y;
        this.gridWidth = sweep.w;
        this.gridHeight = sweep.h;

        this.stamina = 5;
        this.steps = 1;

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

        if (sweep.grid[this.x+x][this.y+y] == symbols.wall) return;

        this.x += x;
        this.y += y;

        if (this.x >= this.gridWidth) this.x = 0;
        if (this.x < 0) this.x = this.gridWidth-1;
        if (this.y >= this.gridHeight) this.y = 0;
        if (this.y < 0) this.y = this.gridHeight-1;

        this.cameraX -= x;
        this.cameraY -= y;

        // let progress = player.stamina;

        // if (player.stamina > 20) {
        //     progress = 20;
        // }

        if (this.cameraX > gridWidth*0.25 || this.cameraX < -gridWidth*0.25) {
            this.cameraX += x;
        }

        if (this.cameraY > gridHeight*0.25 || this.cameraY < -gridHeight*0.25) {
            this.cameraY += y;
        }

        this.steps++;
    }

    display() {

        if (player.stamina <= 0) {

            push();

            translate(width/2 - this.gridWidth/2*cellSize, height/2 - this.gridHeight/2*cellSize);
            translate(this.x*cellSize + cellSize / 2 + 16/30*cellSize, this.y*cellSize + cellSize / 2 - 7/30*cellSize);
            rotate(180);

            noStroke();
            fill(palette.white);
            textSize(cellSize);
            text(this.symbol, 0, 0);

            pop();

        } else {

            push();
            translate(width/2 - this.gridWidth/2*cellSize, height/2 - this.gridHeight/2*cellSize);

            if (player.stamina <= 0) {
                noFill();
            } else if (sweep.grid[this.x][this.y] == symbols.emptyHeart || sweep.grid[this.x][this.y] == "" || sweep.grid[this.x][this.y] == symbols.house || sweep.grid[this.x][this.y] == symbols.envelope || sweep.grid[this.x][this.y] == symbols.openedLetter) {
                fill(palette.water);
            } else if (sweep.grid[this.x][this.y] == symbols.river) {
                fill(palette.river);
            }

            noStroke();
            rect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);

            fill(palette.white);
            textSize(cellSize);
            text(this.symbol, this.x*cellSize + cellSize / 2 - 16/30*cellSize, this.y*cellSize + cellSize / 2 + 7/30*cellSize);

            pop();
        }
    }
}
