class Room {

    constructor (x, y) {

        this.x = x;
        this.y = y;

        this.w = 9;
        this.h = 7;

        this.items = [];
        this.grid = [...Array(this.w)].map(e => Array(this.h));

        this.placedItems = false;

        this.playerX;
        this.playerY;
    }

    createItems() {

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {

                if (i == 0 || i == this.w-1 || j == 0 || j == this.h-1 ) {
                    this.grid[i][j] = symbols.wall;
                } else {
                    this.grid[i][j] = "";
                }
            }
        }

        let randomisedItems = shuffle(items);

        for (let i = 0; i < 3; i++) {
            if (!randomisedItems[i]) {
                this.items.push(new Chest((i+1)*2,2));
                this.grid[(i+1)*2][2] = symbols.envelope + i;
            } else {
                this.items.push(randomisedItems[i]);
                this.grid[(i+1)*2][2] = randomisedItems[i][0] + i;
            }
        }

        this.grid[4][5] = symbols.door;
    }

    open(itemNumber) {

        if (player.stamina >= 50) {
            inventory[this.items[itemNumber].slice(3)] += 3;
            player.stamina -= 50;
        }
        //items.splice(items.indexOf(this.items[itemNumber]), 1);
        //this.grid[(itemNumber+1)*2][2] = "";
    }

    display() {

        for (let i = 0; i < 3; i++) {
            if (items.indexOf(this.items[i]) == -1 && this.number != null && this.grid[(i+1)*2][2][0] == symbols.item) {
                this.grid[(i+1)*2][2] = "";
            }
        }

        if (!this.placedItems) {
            this.placedItems = true;
            this.createItems();
        }

        background(palette.black);

        push();
        translate(width/2 - worldWidth/2*cellSize*1/mapScale, height/2 - worldHeight/2*cellSize*1/mapScale);

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {

                let targetX = int(worldWidth/2-(this.w/2-1))+i;
                let targetY = int(worldHeight/2-(this.h/2-1))+j;

                const x = targetX * cellSize;
                const y = targetY * cellSize;

                let number = this.grid[i][j];

                if (number == undefined || number[0] == symbols.pickaxe[0] || number == symbols.door || number[0] == symbols.envelope || number[0] == symbols.openedLetter) {
                    fill(palette.water);
                } else if (number == symbols.wall) {
                    fill(palette.wall);
                } else {
                    fill(palette.water);
                }

                noStroke();
                rect(x, y, cellSize, cellSize);

                if (number == undefined) {
                    continue
                } else if (number[0] == symbols.pickaxe[0] || number == symbols.door || number[0] == symbols.envelope || number[0] == symbols.openedLetter) {
                    fill(palette.white);
                } else if (number == symbols.wall) {
                    fill(palette.black);
                }

                textAlign(CENTER, CENTER);
                textFont("Fira Code");
                textSize(cellSize * .7);
                text(number.toString()[0], x + cellSize / 2, y + cellSize / 2 + 2);


            }
        }

        if (player.stamina <= 0) {
            background(palette.ghosting);
        }

        pop();
    }
}