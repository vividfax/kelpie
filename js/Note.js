class Note {

    constructor(x, y, h) {

        this.x = x * cellSize;
        this.y = y * cellSize;
        this.height = h;
        this.symbol = symbols.envelope;
        this.fog = true;
        this.opened = false;
        this.phrase = this.makePhrase();
        this.price = this.phrase.length-8;
        this.eaten = false;
    }

    makePhrase() {

        let phrases = [
            `"...$adjective $noun..."`,
            `"...$verb $adjective $noun..."`,
            `"...$noun $noun..."`,
            `"...$verb and $verb..."`,
            `"...$noun of $noun..."`,
            `"...$adjective $noun of $noun..."`,
            `"...$noun and $noun..."`,
            `"...$verb the $noun..."`,
            `"...$adjective and $adjective $noun..."`,
            `"...$adjective, $adjective $noun..."`,
            `"...$adjective $noun $noun..."`,
            `"...$verb, $verb, $verb..."`,
            `"...$adjective and $adjective..."`,
            `"...$adjective $noun and $noun..."`
        ];

        let phrase = random(phrases);

        phrase = phrase.replace("$noun", random(nouns));
        phrase = phrase.replace("$noun", random(nouns));
        phrase = phrase.replace("$noun", random(nouns));
        phrase = phrase.replace("$verb", random(verbs));
        phrase = phrase.replace("$verb", random(verbs));
        phrase = phrase.replace("$verb", random(verbs));
        phrase = phrase.replace("$adjective", random(adjectives));
        phrase = phrase.replace("$adjective", random(adjectives));
        phrase = phrase.replace("$adjective", random(adjectives));

        return phrase;
    }

    open() {

        if (player.points >= this.price) {
            this.opened = true;
            player.points -= this.price;
            player.memory = this.phrase;
        }
    }

    getTooltip() {

        if (this.opened) {
            return this.phrase;
        } else if (!this.opened && player.points < this.price) {
            return "you need " + this.price + " " + symbols.heart + " to open this";
        } else if (!this.opened) {
            return "press o to open for " + this.price + " " + symbols.heart;
        }
    }

    display() {

        if (this.height == -1 && !this.eaten) {
            fill(palette.wall);
        } else if (this.height == -1 && this.eaten) {
            fill(palette.black);
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

        if (this.opened) {
            text(symbols.openedLetter, this.x + cellSize / 2, this.y + cellSize / 2 + 2);
        } else {
            text(this.symbol, this.x + cellSize / 2, this.y + cellSize / 2 + 2);
        }
    }
}