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
	pickaxe: "⛏",
	emptyCell: "",
	building_materials: "⚒",
	invisibility_cloak: "⛉",
	people: ["𓀔", "𓀀", "𓀁", "𓀂", "𓀃", "𓀉", "𓁎", "𓀦"],
	coin: "❂"
};

//const items = ["pickaxe5"];
const items = ["pickaxe3", "building materials2"];
// const items = ["pickaxe3", "building materials2", "invisibility cloak1"];
let landmarks;

let verbs = [];
let adjectives = [];
let nouns = [];

let grid;
let player;
let houses = [];

let worldWidth = 1000;
let worldHeight = 1000;
let cellSize = 45;
let renderScale = 0.5;

let lastMoveWasDiagonal = false;
let hasMoved = false;
let hasMovedDiagonally = false;
let displayJumpTooltip = false;
let mapDisplayed = false;

function preload(){

	verbs = loadStrings("txt/verbs.txt");
	adjectives = loadStrings("txt/adjectives.txt");
	nouns = loadStrings("txt/nouns.txt");

	landmarks = loadJSON("landmarks.json");
}

function setup() {

	verbs.pop();
	adjectives.pop();
	nouns.pop();
	shuffle(verbs, true);
	shuffle(adjectives, true);
	shuffle(nouns, true);
	verbs = verbs.slice(0, 5);
	adjectives = adjectives.slice(0, 5);
	nouns = nouns.slice(0, 5);

	createCanvas(windowWidth, windowHeight);

	angleMode(DEGREES);
	textAlign(CENTER, CENTER);
	textFont("Fira Code");
	noStroke();

	grid = new Grid(worldWidth, worldHeight);
	player = new Player();

    noLoop();
    draw();

	document.onfocus = function() {focus()};
}

function draw() {

    background(palette.fog);

	push();

	if (grid.grid[player.x][player.y] instanceof House && houses.length > 1 && !player.isInRoom) {
		scale(renderScale);
		translate(width/2, height/2);
		player.cameraX = 0;
		player.cameraY = 0;
	} else if (!player.isInRoom) {
		translate(-player.cameraX * cellSize, -player.cameraY * cellSize);
	}

    if (!player.isInRoom) {
        grid.display();
        if (player.dead) background(palette.ghosting);
    } else {
        grid.grid[player.x][player.y].displayRoom();
    }

    player.display();

	pop();

	if (mapDisplayed) displayMap();

    displayUI();
}

function displayUI() {

    push();
	stroke(palette.black);
	strokeWeight(80);
	noFill();
	rect(0, 20, width, height-40, 50);
	pop();

	fill(palette.white);
	textSize(20);

	let topString = player.stamina + " " + symbols.heart;
	if (player.coins > 0) topString += "     " + player.coins + " " + symbols.coin;

	let inventoryKeys = Object.keys(player.inventory);

	for (let i = 0; i < inventoryKeys.length; i++) {
		if (player.inventory[inventoryKeys[i]] > 0) topString += "     " + player.inventory[inventoryKeys[i]] + " " + symbols[inventoryKeys[i]];
	}

	if (player.memory != "nothing") topString += "\n" + player.memory;
	else topString += "\n";

	text(topString, width/2, 30);

	// let cornerString = "";

	// if (grid.currentNumberOfNPCs == 0) {
	// 	cornerString = grid.originalNumberOfNPCs + " souls saved";
	// } else if (grid.currentNumberOfNPCs == 1) {
	// 	cornerString = grid.currentNumberOfNPCs + " stranded soul";
	// } else {
	// 	cornerString = grid.currentNumberOfNPCs + " stranded souls";
	// }

	// push();
	// textAlign(RIGHT);
	// text(cornerString, width-40, 30);
	// pop();

    displayToolip();
}

function displayToolip() {

	let tooltip = "";

    let currentCell = grid.grid[player.x][player.y];
	let currentRoomCell = null;

	if (currentCell instanceof Shop && currentCell.generatedRoom) {
		currentRoomCell = currentCell.grid[player.roomX][player.roomY];
	}

    if (mapDisplayed) tooltip = "press m to hide map";
    else if (!hasMoved) tooltip = "wasd or arrow keys to walk";
    else if (displayJumpTooltip) tooltip = "press spacebar to jump";
    else if (currentCell instanceof Shop && !player.isInRoom) tooltip = "press e to enter";
    else if (player.isInRoom && currentRoomCell.symbol == symbols.door) tooltip = "press e to exit";
    else if (currentCell instanceof Shop && player.isInRoom && currentRoomCell) tooltip = currentRoomCell.getTooltip();
    else if (currentCell instanceof Ruin && player.stamina >= 20) tooltip = "press h to repair for 20 " + symbols.heart;
    else if (currentCell instanceof Note) tooltip = currentCell.getTooltip();
    else if (currentCell instanceof House && houses.length > 1) tooltip = "press t to fast travel";
    else if (currentCell instanceof EmptyCell && currentCell.height == 0 && player.inventory.building_materials > 0) tooltip = "press h to build a house";
    else if (currentCell instanceof NPC) tooltip = currentCell.getTooltip(true);
    else if (!hasMovedDiagonally && player.steps > 15) tooltip = "press two arrow keys at the same time to move diagonally";

	text(tooltip, width/2, height - 30);
}

function keyPressed() {

	displayJumpTooltip = false;

	if (player.dead) return;

	if (keyCode == 32) {
		player.jumpOffset = -cellSize/9;
		draw();
	}
}

function keyReleased() {

	if (!player) return;

    if (player.dead) {
        reset();
        draw();
        return;
    }

	if (keyCode == 32) { // spacebar
		player.jumpOffset = 0;
		draw();
		return;
	}

	if (lastMoveWasDiagonal) {
		lastMoveWasDiagonal = false;
		return;
	}

    let currentCell = grid.grid[player.x][player.y];
	let currentRoomCell = null;

	if (currentCell instanceof Shop && currentCell.generatedRoom) {
		currentRoomCell = currentCell.grid[player.roomX][player.roomY];
	}

    if (keyCode == 79 && currentCell instanceof Note && !currentCell.opened) { // o
        currentCell.open();
    } else if (keyCode == 79 && player.isInRoom && currentRoomCell instanceof Note) { // o
        currentRoomCell.open();
    } else if (keyCode == 69 && currentCell instanceof Shop && !player.isInRoom) { // e
        player.enterRoom();
    } else if (keyCode == 66 && player.isInRoom && currentRoomCell instanceof Item) { // b
		currentRoomCell.buy();
	} else if (keyCode == 82 && !player.isInRoom && currentCell instanceof NPC) { // r
		player.reply(currentCell);
	} else if (keyCode == 84 && !player.isInRoom && currentCell instanceof House && houses.length > 1) { // t
		let nextHouseIndex = houses.indexOf(currentCell)+1;
		if (nextHouseIndex >= houses.length) nextHouseIndex = 0;
		let nextHouse = houses[nextHouseIndex];
		player.x = nextHouse.x/cellSize;
		player.y = nextHouse.y/cellSize;
	} else if (keyCode == 77) { // m
		mapDisplayed = !mapDisplayed;
	} else if (keyCode == 72 && !player.isInRoom && currentCell instanceof EmptyCell && currentCell.height == 0 && player.inventory.building_materials > 0) { // h
		let house = new House(player.x, player.y);
		grid.grid[player.x][player.y] = house;
		houses.push(house);
		player.inventory.building_materials--;
	} else if (keyCode == 72 && currentCell instanceof Ruin && player.stamina >= 20) { // h
		let house = new House(player.x, player.y);
		grid.grid[player.x][player.y] = house;
		houses.push(house);
		player.stamina -= 20;
	} else if (keyCode == 69 && player.isInRoom && currentRoomCell instanceof EmptyCell && currentRoomCell.symbol == symbols.door) { // e
        player.exitRoom();
    } else if ((keyCode == 65 && keyIsDown(87)) || (keyCode == 87 && keyIsDown(65)) || (keyCode == UP_ARROW && keyIsDown(LEFT_ARROW)) || (keyCode == LEFT_ARROW && keyIsDown(UP_ARROW))) {
		player.move(-1, -1);
		lastMoveWasDiagonal = true;
		hasMovedDiagonally = true;
	} else if ((keyCode == 65 && keyIsDown(83)) || (keyCode == 83 && keyIsDown(65)) || (keyCode == DOWN_ARROW && keyIsDown(LEFT_ARROW)) || (keyCode == LEFT_ARROW && keyIsDown(DOWN_ARROW))) {
		player.move(-1, 1);
		lastMoveWasDiagonal = true;
		hasMovedDiagonally = true;
	} else if ((keyCode == 68 && keyIsDown(87)) || (keyCode == 87 && keyIsDown(68)) || (keyCode == UP_ARROW && keyIsDown(RIGHT_ARROW)) || (keyCode == RIGHT_ARROW && keyIsDown(UP_ARROW))) {
		player.move(1, -1);
		lastMoveWasDiagonal = true;
		hasMovedDiagonally = true;
	} else if ((keyCode == 68 && keyIsDown(83)) || (keyCode == 83 && keyIsDown(68)) || (keyCode == DOWN_ARROW && keyIsDown(RIGHT_ARROW)) || (keyCode == RIGHT_ARROW && keyIsDown(DOWN_ARROW))) {
		player.move(1, 1);
		lastMoveWasDiagonal = true;
		hasMovedDiagonally = true;
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

    draw();
}

function reset() {

    player.dead = false;
    player.stamina = 5;
    grid.reset();
    player.reset();
}

function focus() {

	if (hasMoved) {
		displayJumpTooltip = true;
		draw();
	}
}

function mod(n, m) {
	return ((n % m) + m) % m;
}

function displayMap() {

	push();
	translate(width/2, height/2);
	translate(-worldWidth/2/2, -worldHeight/2/2);
	background(palette.fog);

	for (let i = 0; i < worldWidth; i+=8) {
		for (let j = 0; j < worldHeight; j+=8) {

			let cell = grid.grid[i][j];
			if (cell.fog) continue;

			if (cell instanceof Rock) fill(palette.wall);
			else if (cell instanceof NPC) fill(palette.water);
			else if (cell instanceof Shop) fill(palette.water);
			else if (cell instanceof Note && cell.height == -1) fill(palette.wall);
			else if (cell instanceof Note && cell.height != -1) fill(palette.water);
			else if (cell.height >= 5) fill(palette.snow);
			else if (cell.height == 4) fill(palette.mountain);
			else if (cell.height == 3) fill(palette.trees);
			else if (cell.height == 2) fill(palette.grass);
			else if (cell.height == 1) fill(palette.sand);
			else if (cell.height == 0) fill(palette.water);

			rect(i/2, j/2, 4)
		}
	}

	fill(palette.white);
	rect(round(player.x/8) * 8/2, round(player.y/8) * 8/2, 4)

	pop();
}