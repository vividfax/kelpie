class Mine {

    constructor(x, y) {

        this.x = x * cellSize;
        this.y = y * cellSize;
        this.height = 0;
        this.symbol = symbols.heart;
        this.eatenSymbol = symbols.emptyHeart;
        this.fog = true;
        this.eaten = false;
    }

    display() {

        if (this.height == 1) {
            fill(palette.height1);
        } else if (this.height == 2) {
            fill(palette.height2);
        } else if (this.height == 3) {
            fill(palette.height3);
        } else if (this.height == 4) {
            fill(palette.height4);
        } else if (this.height == 5) {
            fill(palette.height5);
        } else if (this.height == 6) {
            fill(palette.height6);
        } else if (this.height == 7) {
            fill(palette.height7);
        } else if (this.height == 8) {
            fill(palette.height8);
        }

        if (this.eaten) {
            fill(palette.river);
        }

        rect(this.x, this.y, cellSize);

        if (this.height > 0) {
            fill(palette.deepRed);
        }

        textSize(cellSize * 0.6);

        if (this.eaten) {
            fill(palette.white);
            textSize(cellSize * 0.7);
            text(this.eatenSymbol, this.x + cellSize / 2, this.y + cellSize / 2 + 2);
        } else {
            text(this.symbol, this.x + cellSize / 2, this.y + cellSize / 2 + 2);
        }
    }
}