class Player {

    constructor() {

        this.x;
        this.y;
        this.roomX;
        this.roomY;
        this.cameraX = 0;
        this.cameraY = 0;
        this.reset();
        this.symbol = symbols.smiley;
        this.points = 5;
        this.dead = false;
        this.jumpOffset = 0;
        this.memory = "nothing";
        this.isInRoom = false;
        this.lastNPCtalkedTo = null;
        this.steps = 0;

        this.inventory = {
            pickaxe: 0,
            building_materials: 0,
            invisibility_cloak: 0
        }
    }

    reset() {

        this.x = int(worldWidth/2);
        this.y = int(worldHeight/2);
        this.cameraX = 0;
        this.cameraY = 0;
        grid.clearFog(this.x, this.y);

        this.inventory = {
            pickaxe: 0,
            building_materials: 0,
            invisibility_cloak: 0
        }
    }

    move(x, y) {

        if (!this.isInRoom) {

            let targetCell = grid.grid[mod(this.x+x, worldWidth)][mod(this.y+y, worldHeight)];

            if ((targetCell instanceof Rock || targetCell.height == -1) && !targetCell.eaten) {

                if (this.inventory.pickaxe > 0) {
                    this.inventory.pickaxe--;
                } else {
                    return;
                }
            }

            this.x += x;
            this.y += y;

            this.x = mod(this.x, worldWidth);
            this.y = mod(this.y, worldHeight);

            this.eatCell(grid.grid[this.x][this.y]);
            grid.clearFog(this.x, this.y);

            this.cameraX -= x;
            this.cameraY -= y;

            if (this.cameraX > width/cellSize*0.25 || this.cameraX < -width/cellSize*0.25) {
                this.cameraX += x;
            }

            if (this.cameraY > height/cellSize*0.1 || this.cameraY < -height/cellSize*0.1) {
                this.cameraY += y;
            }

        } else {

            if (grid.grid[this.x][this.y].grid[this.roomX+x][this.roomY+y] instanceof Rock) return;

            this.roomX += x;
            this.roomY += y;

            this.eatCell(grid.grid[this.x][this.y].grid[this.roomX][this.roomY]);
        }

        if (this.lastNPCtalkedTo != null) {

            this.lastNPCtalkedTo.asked = false;
            this.lastNPCtalkedTo.answered = false;
        }

        hasMoved = true;
        this.steps++;
    }

    eatCell(cell) {

        if (cell instanceof EmptyCell && cell.height > 0 && !cell.eaten) {
            cell.eaten = true;
            this.points -= cell.height;
        } else if (cell instanceof Mine && !cell.eaten) {
            cell.eaten = true;
            this.points += 2;
        } else if (cell instanceof Note && cell.opened) {
            this.memory = cell.phrase;
        } else if (cell instanceof Rock && !cell.eaten) {
            cell.eaten = true;
        } else if ((cell instanceof Note || cell instanceof NPC) && !cell.eaten && cell.height == -1) {
            cell.eaten = true;
        }

        if (this.points < 0) {
            this.points = 0;
            this.dead = true;
        }
    }

    enterRoom() {

        this.isInRoom = true;
        this.roomX = 4;
        this.roomY = 4;
    }

    exitRoom() {

        this.isInRoom = false;
    }

    reply(currentCell) {

        currentCell.asked = true;

        if (currentCell.subject != "" && this.memory.includes(currentCell.subject)) {
            player.points += 200;
            grid.currentNumberOfNPCs--;
            //currentCell.generateQuestion();
            currentCell.answered = true;
            currentCell.silence();
        }
    }

    display() {

        push();
        translate(width/2, height/2);
        if (this.isInRoom) translate((this.roomX-4)*cellSize, (this.roomY-3)*cellSize + cellSize/2);

        if (grid.grid[this.x][this.y] instanceof Rock || grid.grid[this.x][this.y].height == -1) {
            fill(palette.black);
        } else if (grid.grid[this.x][this.y].height == 0) {
            fill(palette.water);
        } else {
            fill(palette.river);
        }

        rect(-cellSize/2, -cellSize/2, cellSize);

        if (this.dead) {
            fill(palette.ghosting);
            rect(-cellSize/2, -cellSize/2, cellSize);
            rotate(180);
        }

        fill(palette.white);
        textSize(cellSize);
        text(this.symbol, 0, this.jumpOffset);

        pop();
    }
}