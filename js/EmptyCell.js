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
        return "";
    }

    display() {

        if (this.eaten) {
            fill(palette.river);
            rect(this.x, this.y, cellSize);
            return;
        }

        if (this.height == 0) {
            fill(palette.water);
        } else if (this.height == 1) {
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

        rect(this.x, this.y, cellSize);

        if (this.height == 0 && this.symbol == symbols.emptyCell) return;

        // if (this.height > 0) {
        //     fill(palette.black);
        // } else {
        //     fill(palette.white);
        // }

        // textSize(cellSize * 0.7);

        if (this.symbol == symbols.door) {
            fill(palette.white);
            text(this.symbol, this.x + cellSize / 2, this.y + cellSize / 2 + 2);
        }
        // else {
        //     text(this.height, this.x + cellSize / 2, this.y + cellSize / 2 + 2);
        // }
        if (this.height == 1) {
            image(images.height1, this.x + cellSize/2, this.y + cellSize/2, cellSize, cellSize)
        } else if (this.height == 2) {
            image(images.height2, this.x + cellSize/2, this.y + cellSize/2, cellSize, cellSize)
        } else if (this.height == 3) {
            image(images.height3, this.x + cellSize/2, this.y + cellSize/2, cellSize, cellSize)
        } else if (this.height == 4) {
            image(images.height4, this.x + cellSize/2, this.y + cellSize/2, cellSize, cellSize)
        } else if (this.height == 5) {
            image(images.height5, this.x + cellSize/2, this.y + cellSize/2, cellSize, cellSize)
        } else if (this.height == 6) {
            image(images.height6, this.x + cellSize/2, this.y + cellSize/2, cellSize, cellSize)
        } else if (this.height == 7) {
            image(images.height7, this.x + cellSize/2, this.y + cellSize/2, cellSize, cellSize)
        } else if (this.height == 8) {
            image(images.height8, this.x + cellSize/2, this.y + cellSize/2, cellSize, cellSize)
        }
    }
}