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

        if (this.eaten) {
            fill(palette.river);
        }

        rect(this.x, this.y, cellSize);

        if (this.height == 1 || this.height == 2 || this.height >= 5) {
            fill(palette.black);
        } else {
            fill(palette.white);
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