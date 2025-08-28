const ROUNDS = [5, 5, 5, 4, 4, 4, 3, 3, 3, 1];

const ROUND_COLOURS = [
	"#1ABC9C",
	"#16A085",
	"#2ECC71",
	"#27AE60",
	"#3498DB",
	"#2980B9",
	"#9B59B6",
	"#8E44AD",
	"#34495E",
	"#E74C3C",
	"#C0392B",
	"#D35400",
	"#E67E22"
];

const COLOURS = {
	DEFAULT: "#2C3E50",
	WHITE: "#FFFFFF"
};

const DIRECTION = {
	IDLE: "IDLE",
	UP: "UP",
	DOWN: "DOWN",
	LEFT: "LEFT",
	RIGHT: "RIGHT"
};

class Paddle {
	constructor({ x, y }) {
		this.x = x;
		this.y = y;
		this.width = 20;
		this.height = 100;
		this.score = 0;
		this.speed = 5;
		this.move = DIRECTION.IDLE;
	}

	addScore() {
		this.score += 1;
	}

	getScore() {
		return this.score;
	}

	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}
