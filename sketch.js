const white = "#ffffff";
const light = "#EAF2F1";
const mid = "#64b6ac";
const dark = "#5d737e";
const black = "#000000";

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
}

let sweep;
let player;
let score = 0;

let worldWidth = 1000;
let worldHeight = 1000;

let cellSize = 35;
let gridWidth = 10;
let gridHeight = 10;

function setup() {

	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);

	gridWidth = int(width/cellSize);
	gridHeight = int(height/cellSize);

	if (gridHeight > worldHeight/2) gridHeight = worldHeight/2;
	if (gridWidth > worldWidth/2) gridWidth = worldWidth/2;

	sweep = new Minesweeper(worldWidth, worldHeight, gridWidth, gridHeight, cellSize);
	player = new Player(sweep, cellSize);

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
	rect(0,20, width, height-20, 50);
	pop();

	push();
	translate(width/2, 0);

	fill(white);
	textAlign(CENTER, CENTER);
	textSize(20);
	textFont("Fira Code");

	if (player.stamina < 0) {
		player.stamina = 0;
	}

	if (player.stamina >= 35) {
		fill(palette.black);
	}

	text("stamina = " + player.stamina, 0, 30);

	pop();
}

function display() {

	push();

	translate(worldWidth*cellSize/2-(player.x + player.positionX)*cellSize, worldHeight*cellSize/2-(player.y+player.positionY)*cellSize);

	sweep.display();

	if (player.stamina <= 0) {
		sweep.displaySurrounding(player.x, player.y);
		//rect(0, 0, worldWidth*cellSize, worldHeight*cellSize, palette.ghosting);
		sweep.displayHeartsOnly();
	}

	player.display();

	pop();
}

function keyPressed() {

	if (keyCode == UP_ARROW || keyCode == 87) {

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

	draw();
}