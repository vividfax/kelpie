class Chest {

    constructor(x, y) {

        this.x = x;
        this.y = y;
        this.words = this.makeWords();
        this.price = this.words.length-8;
        this.opened = false;
    }

    open() {

        if (!isInRoom && !this.opened && player.stamina >= this.price) {
            this.opened = true;
            player.stamina -= this.price-1;
            sweep.mineGrid[this.x][this.y] = symbols.openedLetter;
            sweep.grid[this.x][this.y] = symbols.openedLetter;
        } else if (isInRoom && !this.opened && player.stamina >= this.price) {
            this.opened = true;
            player.stamina -= this.price-1;
			rooms[roomNumber].grid[this.x][this.y] = symbols.openedLetter + int(this.x/2-1);
        }
    }

    makeWords() {

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
            `"...$adjective..."`,
            `"...$noun..."`,
            `"...$verb..."`,
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
}