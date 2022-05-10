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

let gridWidth = 30;
let gridHeight = 20;
let cellSize = 20;

function setup() {

	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);

	sweep = new Minesweeper(gridWidth, gridHeight, cellSize);
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

	sweep.display();

	if (player.stamina <= 0) {
		background(palette.ghosting);
		sweep.displaySurrounding(player.x, player.y);
		sweep.displayHeartsOnly();
	}

	player.display();

	push();
	translate(width/2, height/2);

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

	text("stamina = " + player.stamina, 0, -sweep.cellSize * sweep.h/2 - 20);

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