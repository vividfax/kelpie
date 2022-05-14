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
	openedLetter: "≋"
};

let sweep;
let player;
let walls;
let dead;
let chests = [];
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

	draw();
	sweep.clearFog(player.x, player.y);

	noLoop();
}

function draw() {

	background(palette.black);

	// for (let i = -1; i < 2; i++) {
	// 	for (let j = -1; j < 2; j++) {

	// 		push();
	// 		translate(i*worldWidth*cellSize, j*worldHeight*cellSize);

			display();

// 			pop();
// 		}
// 	}

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

	if (dead) {
		hintText = "move to respawn";
	} if (player.stamina > housePrice+5 && sweep.grid[player.x][player.y] == "") {
		hintText = "press h to build a house for " + housePrice + " " + symbols.heart;
	} else if (houses.length > 1 && sweep.grid[player.x][player.y] == symbols.house) {
		hintText = "press t to fast travel between houses";
	} else if (sweep.grid[player.x][player.y] == symbols.envelope || sweep.grid[player.x][player.y] == symbols.openedLetter) {

		for (let i = 0; i < chests.length; i++) {
			if (chests[i].x == player.x && chests[i].y == player.y) {

				hintText = chests[i].words;

				if (chests[i].opened) {
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

	sweep.display();

	for (let i = 0; i < houses.length; i++) {
		sweep.placeHouse(houses[i][0], houses[i][1]);
	}

	if (player.stamina <= 0) {
		sweep.displaySurrounding(player.x, player.y);
		//rect(0, 0, worldWidth*cellSize, worldHeight*cellSize, palette.ghosting);
		//sweep.displayHeartsOnly();
	}

	player.display();

	pop();
}

function keyPressed() {

	if (keyCode == 72 && player.stamina > housePrice && sweep.grid[player.x][player.y] == "") { // h

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
		}

		player.x = houses[houseIndex][0];
		player.y = houses[houseIndex][1];

	}  else if (keyCode == 79 && sweep.grid[player.x][player.y] == symbols.envelope) { // t

		for (let i = 0; i < chests.length; i++) {
			if (chests[i].x == player.x && chests[i].y == player.y) {
				chests[i].open();
			}
		}

	} else if (keyCode == UP_ARROW || keyCode == 87) {
		player.move(0, -1);
	} else if (keyCode == DOWN_ARROW || keyCode == 83) {
		player.move(0, 1);
	} else if (keyCode == LEFT_ARROW || keyCode == 65) {
		player.move(-1, 0);
	} else if (keyCode == RIGHT_ARROW || keyCode == 68) {
		player.move(1, 0);
	}
	else {
		return;
	}

	sweep.eatCell(player.x, player.y);
	sweep.clearFog(player.x, player.y);

	if (dead) {
		reset();
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