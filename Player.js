class Player {

    constructor(sweep, cellSize) {

        this.symbol = "☻";
        this.x;
        this.y;
        this.gridWidth = sweep.w;
        this.gridHeight = sweep.h;
        this.cellSize = cellSize;

        this.stamina = 0;

        this.placePlayer(sweep);
    }

    placePlayer(sweep) {

        let middleX = int(sweep.w/2);
        let middleY = int(sweep.h/2);

        while (sweep.grid[middleX][middleY] != "") {

            middleX++;

            if (middleX >= sweep.grid[middleX].length) {
                middleY++;
                middleX = 0;
            }
        }

        this.x = middleX;
        this.y = middleY;
    }

    display() {

        push();
        translate(width/2 - this.gridWidth/2*this.cellSize, height/2 - this.gridHeight/2*this.cellSize)

        fill(dark);

        stroke(dark);
        strokeWeight(1);
        rect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);

        fill(white);
        textSize(this.cellSize);

        text(this.symbol, this.x*this.cellSize + this.cellSize / 2-10, this.y*this.cellSize + this.cellSize / 2 + 5);

        pop();
    }

    move(x, y) {

        this.x += x;
        this.y += y;
    }
}
