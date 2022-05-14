class Chest {

    constructor(x, y) {

        this.x = x;
        this.y = y;
        this.words = this.makeWords();
        this.price = this.words.length;
        this.opened = false;
    }

    open() {

        if (!this.opened && player.stamina >= this.price) {
            this.opened = true;
            player.stamina -= this.price;
            sweep.mineGrid[this.x][this.y] = symbols.openedLetter;
            sweep.grid[this.x][this.y] = symbols.openedLetter;
        }
    }

    makeWords() {

        let words = [];

        words.push(random(kelpieWords));

        if (int(random(5)) != 1) {
            words.push(random(kelpieWords));
        }

        if (int(random(5)) == 1) {
            words.push(random(commonWords));
        }

        words = shuffle(words);
        words = words.join(" ");

        return words;
    }
}