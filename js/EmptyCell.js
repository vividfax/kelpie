class EmptyCell {

    constructor(x, y) {

        this.x = x * cellSize;
        this.y = y * cellSize;
        this.height = 0;
        this.symbol = symbols.emptyCell;
        this.fog = true;
        this.eaten = false;
    }

    getTooltip() {

    }

    display() {

        if (this.eaten) {
            fill(palette.river);
            rect(this.x, this.y, cellSize);
            return;
        }

        if (this.height == 0) {
            fill(palette.water);
        } if (this.height == 1) {
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

        if (this.height == 0 && this.symbol == symbols.emptyCell) return;

        if (this.height == 1 || this.height == 2 || this.height >= 5) {
            fill(palette.black);
        } else {
            fill(palette.white);
        }

        textSize(cellSize * 0.7);

        if (this.symbol == symbols.door) {
            text(this.symbol, this.x + cellSize / 2, this.y + cellSize / 2 + 2);
        } else {
            text(this.height, this.x + cellSize / 2, this.y + cellSize / 2 + 2);
        }
    }
}