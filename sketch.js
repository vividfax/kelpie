const white = "#ffffff";
const light = "#EAF2F1";
const mid = "#64b6ac";
const dark = "#5d737e";
const black = "#000000";

let sweep;
let player;
let score = 0;

let gridWidth = 30;
let gridHeight = 20;
let cellSize = 20;

function setup() {

	createCanvas(windowWidth, windowHeight);

	sweep = new Minesweeper(gridWidth, gridHeight, cellSize);
	player = new Player(sweep, cellSize);

	draw();
	sweep.clearFog(player.x, player.y);

	noLoop();
}

function draw() {

	background(dark);
	sweep.display();
	player.display();

	push();
	translate(width/2, height/2);

	fill(white);
	textAlign(CENTER, CENTER);
	textSize(20);
	textFont("Fira Code");

	text("stamina = " + player.stamina, 0, -sweep.cellSize * sweep.h/2 - 20);

	pop();
}

function mousePressed() {

	sweep.clicked(mouseX, mouseY);

	draw();
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