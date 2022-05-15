class Player {

    constructor(sweep) {

        this.symbol = symbols.smiley;
        this.x;
        this.y;
        this.gridWidth = sweep.w;
        this.gridHeight = sweep.h;

        this.stamina = 5;
        this.steps = 1;

        this.placePlayer(sweep);

        this.cameraX = 0;
        this.cameraY = 0;

        this.wiggle = 0;
    }

    placePlayer(sweep) {

        let middleX = int(sweep.w/2);
        let middleY = int(sweep.h/2);

        this.x = middleX;
        this.y = middleY;
    }

    move(x, y) {

        if (sweep.grid[this.x+x][this.y+y] == symbols.wall) {
            if (inventory.pickaxe > 0) {
                inventory.pickaxe--;
            } else {
                return;
            }
        }
        if (isInRoom && rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-player.x+int(rooms[roomNumber].w/2))-1+x][rooms[roomNumber].h-(worldHeight/2-player.y+int(rooms[roomNumber].h/2))-1+y] == symbols.wall) return;

        this.x += x;
        this.y += y;

        if (this.x >= this.gridWidth) this.x = 0;
        if (this.x < 0) this.x = this.gridWidth-1;
        if (this.y >= this.gridHeight) this.y = 0;
        if (this.y < 0) this.y = this.gridHeight-1;

        this.cameraX -= x;
        this.cameraY -= y;

        // let progress = player.stamina;

        // if (player.stamina > 20) {
        //     progress = 20;
        // }

        if (this.cameraX > gridWidth*0.25 || this.cameraX < -gridWidth*0.25) {
            this.cameraX += x;
        }

        if (this.cameraY > gridHeight*0.25 || this.cameraY < -gridHeight*0.25) {
            this.cameraY += y;
        }

        this.steps++;
        hasMoved = true;

        if (sweep.grid[this.x][this.y] == symbols.door && !isInRoom) {

            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].x == player.x && rooms[i].y == player.y) {
                    roomNumber = i;
                    break;
                }
            }

            isInRoom = true;
            playerXCache = this.x;
            playerYCache = this.y;
            this.x = worldWidth/2;
            this.y = worldHeight/2+2;
            this.cameraX = 0;
            this.cameraY = 0;
            draw();
        } else if (isInRoom && rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-this.x+int(rooms[roomNumber].w/2))-1][rooms[roomNumber].h-(worldHeight/2-this.y+int(rooms[roomNumber].h/2))-1] == symbols.door) {
            isInRoom = false;
            this.x = playerXCache;
            this.y = playerYCache;
            draw();
        }
    }

    display() {

        if (player.stamina <= 0) {

            push();

            translate(width/2 - this.gridWidth/2*cellSize, height/2 - this.gridHeight/2*cellSize);
            translate(this.x*cellSize + cellSize / 2 + 16/30*cellSize, this.y*cellSize + cellSize / 2 - 7/30*cellSize);
            rotate(180);

            noStroke();
            fill(palette.white);
            textSize(cellSize);
            text(this.symbol, 0, 0);

            pop();

        } else {

            push();
            translate(width/2 - this.gridWidth/2*cellSize, height/2 - this.gridHeight/2*cellSize);

            if (isInRoom) {
                fill(palette.water);
            } else if (player.stamina <= 0) {
                noFill();
            } else if (sweep.grid[this.x][this.y] == "" || sweep.grid[this.x][this.y] == symbols.house || sweep.grid[this.x][this.y] == symbols.envelope || sweep.grid[this.x][this.y] == symbols.openedLetter || sweep.grid[this.x][this.y] == symbols.door) {
                fill(palette.water);
            } else if (sweep.grid[this.x][this.y] == symbols.river || sweep.grid[this.x][this.y] == symbols.emptyHeart) {
                fill(palette.river);
            }

            noStroke();
            rect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);

            fill(palette.white);
            textSize(cellSize);
            text(this.symbol, this.x*cellSize + cellSize / 2 - 16/30*cellSize, this.y*cellSize + cellSize / 2 + 7/30*cellSize + this.wiggle);

            pop();
        }
    }
}
