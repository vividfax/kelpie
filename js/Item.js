class Item {

    constructor(type, x, y, h) {

        this.type = type.slice(0, -1);
        this.x = x * cellSize;
        this.y = y * cellSize;
        this.amount = Number(type.slice(-1));
        this.price = 50;
        this.symbol = symbols[this.type.replace(" ", "_")];
        this.height = h;
    }

    buy() {

        if (player.points >= this.price) {

            player.inventory[this.type.replace(" ", "_")] += this.amount;
            player.points -= this.price;
        }
    }

    getTooltip() {

        if (player.points >= this.price) {
            return "press b to buy " + this.amount +  " " + this.type + " for "  + this.price + " " + symbols.heart;
        } else {
            return this.amount +  " " + this.type + " for "  + this.price + " " + symbols.heart;
        }
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
}