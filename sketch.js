const palette = {
	snow: "#EEEEEE",
	mountain: "#736A55",
	trees: "#2F8C5F",
	grass: "#A5C350",
	sand: "#F2E0A1",
	water: "#1B6193",
	river: "#7197DF",
	white: "#FFFFFF",
	black: "#4F4F4F",
	fog: "#A5AAB0",
	ghosting: "#A5AAB0dd",
	wall: "#333333"
};

const symbols = {
	smiley: "☻",
	emptySmiley: "☺",
	heart: "❤",
	emptyHeart: "♡",
	house: "☗",
	emptyHouse: "☖",
	river: "~",
	wall: "▞",
	envelope: "✉",
	openedLetter: "≋",
	door: "⛩",
	item: "★",
	pickaxe: "⛏"
};

//let items = ["jump", "pickaxe", "a bomb", "a tunneling bomb", "100 " + symbols.heart, "invicibility"];
let items = [];
let inventory = [];

let sweep;
let player;
let walls;
let dead;
let chests = [];
let rooms = [];

let kelpieWords = [];
let commonWords = [];

let worldWidth = 1000;
let worldHeight = 1000;

let cellSize = 45;
let gridWidth = 10;
let gridHeight = 10;
let mapScale = 1;

let hasBuiltHouse;

let housePrice = 20;
let houses = [];

let lastMoveWasDiagonal = false;
let displayJumpTooltip = false;
let hasMoved = false;
let isInRoom = false;
let roomNumber = 0;

let playerXCache;
let playerYCache;

function preload(){

	kelpieWords = loadStrings("kelpie-words.txt");
	kelpieWords.pop();
	commonWords = loadStrings("common.txt");
	commonWords.pop();
}

function setup() {

	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);

	gridWidth = int(width/cellSize);
	gridHeight = int(height/cellSize);

	if (gridHeight > worldHeight/2) gridHeight = worldHeight/2;
	if (gridWidth > worldWidth/2) gridWidth = worldWidth/2;

	walls = new Walls(worldWidth, worldHeight);
	sweep = new Minesweeper(worldWidth, worldHeight, gridWidth, gridHeight, walls);
	player = new Player(sweep);

	houses.push([player.x, player.y]);

	for (let i = 0; i < houses.length; i++) {
		sweep.placeHouse(houses[i][0], houses[i][1]);
	}

	rooms.push(new Room(player.x+1, player.y+1))

	draw();
	sweep.clearFog(player.x, player.y);

	noLoop();

	document.onfocus = function() {focus()};
}

function focus() {

	if (hasMoved) {
		displayJumpTooltip = true;
		draw();
	}
}

function draw() {

	background(palette.black);

	display();

	push();
	stroke(palette.black);
	strokeWeight(80);
	noFill();
	rect(0,20, width, height-40, 50);
	pop();

	push();
	translate(width/2, 0);

	fill(palette.white);
	textAlign(CENTER, CENTER);
	textSize(20);
	textFont("Fira Code");

	if (player.stamina < 0) {
		player.stamina = 0;
	}

	let staminaString = "";

	for (let i = 0; i < player.stamina; i++) {
		staminaString += symbols.heart;
	}

	if (player.stamina >= housePrice) {

		staminaString += "\n= ";

		for (let i = housePrice-1; i < player.stamina; i += housePrice) {
			staminaString += symbols.house;
		}
	}

	text(staminaString, 0, 30);

	let hintText = "";

	if (!hasMoved) {
		hintText = "wasd or arrow keys to walk";
	} else if (displayJumpTooltip) {
		hintText = "press spacebar to jump";
	} else if (isInRoom && rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-player.x+int(rooms[roomNumber].w/2))-1][rooms[roomNumber].h-(worldHeight/2-player.y+int(rooms[roomNumber].h/2))-1] == symbols.item + "0") {
		hintText = "press b to buy " + rooms[roomNumber].items[0] + " for 50 " + symbols.heart;
	} else if (isInRoom && rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-player.x+int(rooms[roomNumber].w/2))-1][rooms[roomNumber].h-(worldHeight/2-player.y+int(rooms[roomNumber].h/2))-1] == symbols.item + "1") {
		hintText = "press b to buy " + rooms[roomNumber].items[1] + " for 50 " + symbols.heart;
	} else if (isInRoom && rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-player.x+int(rooms[roomNumber].w/2))-1][rooms[roomNumber].h-(worldHeight/2-player.y+int(rooms[roomNumber].h/2))-1] == symbols.item + "2") {
		hintText = "press b to buy " + rooms[roomNumber].items[2] + " for 50 " + symbols.heart;
	} else if (isInRoom) {
		if (rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-player.x+int(rooms[roomNumber].w/2))-1][rooms[roomNumber].h-(worldHeight/2-player.y+int(rooms[roomNumber].h/2))-1] == symbols.envelope + "0" || rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-player.x+int(rooms[roomNumber].w/2))-1][rooms[roomNumber].h-(worldHeight/2-player.y+int(rooms[roomNumber].h/2))-1] == symbols.openedLetter + "0") {
			if (rooms[roomNumber].items[0].opened) {
				textStyle(ITALIC);
				hintText = rooms[roomNumber].items[0].words;
			} else if (player.stamina < rooms[roomNumber].items[0].price) {
				hintText = "you need " + rooms[roomNumber].items[0].price + " " + symbols.heart + " to open this";
			} else {
				hintText = "press o to open for " + rooms[roomNumber].items[0].price+ " " + symbols.heart;
			}
		} else if (rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-player.x+int(rooms[roomNumber].w/2))-1][rooms[roomNumber].h-(worldHeight/2-player.y+int(rooms[roomNumber].h/2))-1] == symbols.envelope + "1" || rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-player.x+int(rooms[roomNumber].w/2))-1][rooms[roomNumber].h-(worldHeight/2-player.y+int(rooms[roomNumber].h/2))-1] == symbols.openedLetter + "1") {
			if (rooms[roomNumber].items[1].opened) {
				textStyle(ITALIC);
				hintText = rooms[roomNumber].items[1].words;
			} else if (player.stamina < rooms[roomNumber].items[1].price) {
				hintText = "you need " + rooms[roomNumber].items[1].price + " " + symbols.heart + " to open this";
			} else {
				hintText = "press o to open for " + rooms[roomNumber].items[1].price+ " " + symbols.heart;
			}
		} else if (rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-player.x+int(rooms[roomNumber].w/2))-1][rooms[roomNumber].h-(worldHeight/2-player.y+int(rooms[roomNumber].h/2))-1] == symbols.envelope + "2" || rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-player.x+int(rooms[roomNumber].w/2))-1][rooms[roomNumber].h-(worldHeight/2-player.y+int(rooms[roomNumber].h/2))-1] == symbols.openedLetter + "2") {
			if (rooms[roomNumber].items[2].opened) {
				textStyle(ITALIC);
				hintText = rooms[roomNumber].items[2].words;
			} else if (player.stamina < rooms[roomNumber].items[2].price) {
				hintText = "you need " + rooms[roomNumber].items[2].price + " " + symbols.heart + " to open this";
			} else {
				hintText = "press o to open for " + rooms[roomNumber].items[2].price+ " " + symbols.heart;
			}
		}
	} else if (dead) {
		hintText = "press any key to respawn";
	} else if (player.stamina >= housePrice && sweep.grid[player.x][player.y] == "" && !isInRoom) {
		hintText = "press h to build a house for " + housePrice + " " + symbols.heart;
	} else if (houses.length > 1 && sweep.grid[player.x][player.y] == symbols.house) {
		hintText = "press t to fast travel between houses";
	} else if (sweep.grid[player.x][player.y] == symbols.envelope || sweep.grid[player.x][player.y] == symbols.openedLetter) {

		for (let i = 0; i < chests.length; i++) {
			if (chests[i].x == player.x && chests[i].y == player.y) {

				if (chests[i].opened) {
					textStyle(ITALIC);
					hintText = chests[i].words;
				} else if (player.stamina < chests[i].price) {
					hintText = "you need " + chests[i].price + " " + symbols.heart + " to open this";
				} else {
					hintText = "press o to open for " + chests[i].price + " " + symbols.heart;
				}
				break;
			}
		}
	}

	text(hintText, 0, height - 30);

	pop();

	frameCount++;
}

function display() {

	push();

	if (sweep.grid[player.x][player.y] == symbols.house && hasBuiltHouse) {
		mapScale = 0.5;
		scale(mapScale);
		translate(worldWidth*cellSize/2-(player.x)*cellSize, worldHeight*cellSize/2-(player.y)*cellSize);
		translate(width/2, height/2);
	}
	else {
		mapScale = 1;
		translate(worldWidth*cellSize/2-(player.x + player.cameraX)*cellSize, worldHeight*cellSize/2-(player.y+player.cameraY)*cellSize);
	}

	if (!isInRoom) {
		sweep.display();

		for (let i = 0; i < houses.length; i++) {
			sweep.placeHouse(houses[i][0], houses[i][1]);
		}

		if (player.stamina <= 0) {
			sweep.displaySurrounding(player.x, player.y);
		}
	} else {
		rooms[roomNumber].display();
	}

	player.display();

	pop();
}

function keyPressed() {

	displayJumpTooltip = false;

	if (dead) return;

	if (keyCode == 32) {
		player.wiggle = -cellSize/9;
		draw();
	}
}

function keyReleased() {

	if (dead) {
		reset();
		return;
	}

	if (keyCode == 32) { // spacebar
		player.wiggle = 0;
		draw();
		return;
	}

	if (lastMoveWasDiagonal) {
		lastMoveWasDiagonal = false;
		return;
	}

	if (keyCode == 72 && player.stamina >= housePrice && sweep.grid[player.x][player.y] == "") { // h

		player.stamina -= housePrice;
		houses.push([player.x, player.y]);

		for (let i = 0; i < houses.length; i++) {
			sweep.placeHouse(houses[i][0], houses[i][1]);
		}

		hasBuiltHouse = true;

	} else if (keyCode == 84) { // t

		let houseIndex = -1;

		for (let i = 0; i < houses.length; i++) {
			if (houses[i][0] == player.x && houses[i][1] == player.y) {
				houseIndex = i;
				break;
			}
		}

		if (houseIndex != -1) {
			houseIndex++;
			if (houseIndex >= houses.length) {
				houseIndex = 0;
			}
			player.x = houses[houseIndex][0];
			player.y = houses[houseIndex][1];
		}


	} else if (keyCode == 79 && sweep.grid[player.x][player.y] == symbols.envelope) { // o

		for (let i = 0; i < chests.length; i++) {
			if (chests[i].x == player.x && chests[i].y == player.y) {
				chests[i].open();
			}
		}
	} else if (keyCode == 79 && isInRoom) { // 0

		if (rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-player.x+int(rooms[roomNumber].w/2))-1][rooms[roomNumber].h-(worldHeight/2-player.y+int(rooms[roomNumber].h/2))-1] == symbols.envelope + "0") {
			rooms[roomNumber].items[0].open();
		} else if (rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-player.x+int(rooms[roomNumber].w/2))-1][rooms[roomNumber].h-(worldHeight/2-player.y+int(rooms[roomNumber].h/2))-1] == symbols.envelope + "1") {
			rooms[roomNumber].items[1].open();
		} else if (rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-player.x+int(rooms[roomNumber].w/2))-1][rooms[roomNumber].h-(worldHeight/2-player.y+int(rooms[roomNumber].h/2))-1] == symbols.envelope + "2") {
			rooms[roomNumber].items[2].open();
		}
	} else if (isInRoom &&  keyCode == 66) { // b

		if (isInRoom && rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-player.x+int(rooms[roomNumber].w/2))-1][rooms[roomNumber].h-(worldHeight/2-player.y+int(rooms[roomNumber].h/2))-1] == symbols.item + "0") {
			rooms[roomNumber].open(0);
		} else if (isInRoom && rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-player.x+int(rooms[roomNumber].w/2))-1][rooms[roomNumber].h-(worldHeight/2-player.y+int(rooms[roomNumber].h/2))-1] == symbols.item + "1") {
			rooms[roomNumber].open(1);
		} else if (isInRoom && rooms[roomNumber].grid[rooms[roomNumber].w-(worldWidth/2-player.x+int(rooms[roomNumber].w/2))-1][rooms[roomNumber].h-(worldHeight/2-player.y+int(rooms[roomNumber].h/2))-1] == symbols.item + "2") {
			rooms[roomNumber].open(2);
		}

	} else if ((keyCode == 65 && keyIsDown(87)) || (keyCode == 87 && keyIsDown(65)) || (keyCode == UP_ARROW && keyIsDown(LEFT_ARROW)) || (keyCode == LEFT_ARROW && keyIsDown(UP_ARROW))) {
		player.move(-1, -1);
		lastMoveWasDiagonal = true;
	} else if ((keyCode == 65 && keyIsDown(83)) || (keyCode == 83 && keyIsDown(65)) || (keyCode == DOWN_ARROW && keyIsDown(LEFT_ARROW)) || (keyCode == LEFT_ARROW && keyIsDown(DOWN_ARROW))) {
		player.move(-1, 1);
		lastMoveWasDiagonal = true;
	} else if ((keyCode == 68 && keyIsDown(87)) || (keyCode == 87 && keyIsDown(68)) || (keyCode == UP_ARROW && keyIsDown(RIGHT_ARROW)) || (keyCode == RIGHT_ARROW && keyIsDown(UP_ARROW))) {
		player.move(1, -1);
		lastMoveWasDiagonal = true;
	} else if ((keyCode == 68 && keyIsDown(83)) || (keyCode == 83 && keyIsDown(68)) || (keyCode == DOWN_ARROW && keyIsDown(RIGHT_ARROW)) || (keyCode == RIGHT_ARROW && keyIsDown(DOWN_ARROW))) {
		player.move(1, 1);
		lastMoveWasDiagonal = true;
	} else if (keyCode == UP_ARROW || keyCode == 87) {
		player.move(0, -1);
	} else if (keyCode == DOWN_ARROW || keyCode == 83) {
		player.move(0, 1);
	} else if (keyCode == LEFT_ARROW || keyCode == 65) {
		player.move(-1, 0);
	} else if (keyCode == RIGHT_ARROW || keyCode == 68) {
		player.move(1, 0);
	} else {
		return;
	}

	if (!isInRoom) {
		sweep.eatCell(player.x, player.y);
		sweep.clearFog(player.x, player.y);
	}

	if (player.stamina <= 0) {
		dead = true;
	}

	draw();
}

function reset() {

	dead = false;
	player.stamina = 5;
	player.placePlayer(sweep);
	sweep.reset();
	sweep.clearFog(player.x, player.y);
	player.cameraX = 0;
	player.cameraY = 0;
	draw();
}