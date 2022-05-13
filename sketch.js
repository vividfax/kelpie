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
	ghosting: "#A5AAB0dd"
};

const symbols = {
	smiley: "☻",
	emptySmiley: "☺",
	heart: "❤",
	emptyHeart: "♡",
	house: "☗",
	emptyHouse: "☖",
	river: "~"
};

let sweep;
let player;
let dead;

let worldWidth = 1000;
let worldHeight = 1000;

let cellSize = 45;
let gridWidth = 10;
let gridHeight = 10;

let housePrice = 20;
let houses = [];

function setup() {

	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);

	gridWidth = int(width/cellSize);
	gridHeight = int(height/cellSize);

	if (gridHeight > worldHeight/2) gridHeight = worldHeight/2;
	if (gridWidth > worldWidth/2) gridWidth = worldWidth/2;

	sweep = new Minesweeper(worldWidth, worldHeight, gridWidth, gridHeight);
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

	let backgroundColourValue;
	let backgroundColour;

	if (player.stamina <= 50) {
		backgroundColourValue = map(player.stamina, 0, 50, 0, 1);
		backgroundColour = lerpColor(color("#404040"), color("#C8F8FF"), backgroundColourValue);
	}
	else {
		backgroundColourValue = map(player.stamina, 50, 150, 0, 1);
		backgroundColour = lerpColor(color("#C8F8FF"), color("#FFE37F"), backgroundColourValue);
	}

	background(backgroundColour);

	// for (let i = -1; i < 2; i++) {
	// 	for (let j = -1; j < 2; j++) {

	// 		push();
	// 		translate(i*worldWidth*cellSize, j*worldHeight*cellSize);

			display();

// 			pop();
// 		}
// 	}

	push();
	stroke(backgroundColour);
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

	if (player.stamina >= 35) {
		fill(palette.black);
	}

	let staminaString = "";

	for (let i = 0; i < player.stamina; i++) {
		staminaString += symbols.heart;
	}

	if (player.stamina >= housePrice) {

		staminaString += " = ";

		for (let i = housePrice-1; i < player.stamina; i += housePrice) {
			staminaString += symbols.house;
		}
	}

	text(staminaString, 0, 30);

	let hintText = "";

	if (player.stamina > housePrice+5 && sweep.grid[player.x][player.y] == "") {
		hintText = "press h to build a house for " + housePrice + " " + symbols.heart;
	} else if (houses.length > 1 && sweep.grid[player.x][player.y] == symbols.house) {
		hintText = "press t to teleport between houses";
	}

	text(hintText, 0, height - 30);

	pop();
}

function display() {

	push();

	translate(worldWidth*cellSize/2-(player.x + player.cameraX)*cellSize, worldHeight*cellSize/2-(player.y+player.cameraY)*cellSize);

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