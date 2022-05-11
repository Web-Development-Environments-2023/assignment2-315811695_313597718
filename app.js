var context;
var shape = new Object();
var board;
var score;
var start_time;
var time_elapsed;
var interval;
var interval1;
var gameOn;
var ballLeft;
var ghostList;
var dLst = [];
var life;
var Images;
var prev;
var actualFoodAmout;
var keepGhosts;
var keepGameTime;
var smallFood;
var largeFood;
var bigFood;


// Music:
var gameMusic = new Audio('src/inGameSound.wav');
var gameMusicStop = false; //to play and pause the music in the game

// var upKey = 38;
// var downKey = 40;
// var leftKey = 37;
// var rightKey = 39;
// var threeColors = new Array();
// var ballsAmount = 55;
// var gameTime = 70;
// var monsterAmount = 1;

$(document).ready(function () {
	context = canvas.getContext("2d");
});

function Start() {
	// to fix the bug that after few times the pacman moves very fast.
	window.clearInterval(interval);
	window.clearInterval(interval1);
	
	gameMusic.currentTime = 0;
	gameMusic.play();

	keepGameTime = gameTime;
	gameOn = true;
	life = 5;
	lblLife.value = life;
	console.log("start game, life: ", life)
	prev = 0;
	ghostList = new Array();
	timeLeft = gameTime
	board = new Array();
	score = 0;
	ballLeft = ballsAmount;
	keepGhosts = monsterAmount;
	Images = new Array();
	Images[0] = new Image();
	Images[1] = new Image();
	Images[2] = new Image();
	Images[3] = new Image();
	Images[0].src = 'src/packman.png';
	Images[1].src = 'src/cherry.png';
	Images[2].src = 'src/clock.jpg';
	Images[3].src = 'src/ghost.png';

	//var cnt = 100;// ?
	var food_remain = ballLeft;
	smallFood = Math.floor(ballsAmount * 0.6);
	largeFood = Math.floor(ballsAmount * 0.3);
	bigFood = Math.floor(ballsAmount * 0.1);
	actualFoodAmout = bigFood + largeFood + smallFood;
	var pacman_remain = 1;
	start_time = new Date();

	for (var i = 0; i < 20; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 20; j++) {
			if (i == 0 || j == 0) {
				continue;
			}
			// draw ghost in the corners only!
			if (keepGhosts > 0) {
				if ((i == 1 && j == 1) || (i == 1 && j == 18) || (i == 18 && j == 18) || (i == 18 && j == 1)) {
					board[i][j] = 6; // 6 -> ghost!
					let pos = [i, j];
					ghostList.push(pos);// new monster add to the ghost list !
					keepGhosts--;
				}
			}

			if (//put obstacles
				(i == 2 && j == 3) || (i == 3 && j == 3) || (i == 4 && j == 3) ||
				(i == 2 && j == 4) || (i == 2 && j == 5) || (i == 2 && j == 6)
			) {
				board[i][j] = 4; // 4 -> wall
			} else {
				//var randomNum = Math.random();
				// if (pacman_remain != 0 && randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) { 
				//if (pacman_remain != 0 ) { // 2-> pacman
				// the initilize packman is in the middle: pos = [10,10] 
				// shape.i = 10;
				// shape.j = 10;
				// pacman_remain--;
				// board[10][10] = 2;
				//} else { //0 -> empty 
				board[i][j] = 0;
				//}
				//cnt--;
			}
		}
	}
	// 2-> draw pacman
	shape.i = 10;
	shape.j = 10;
	pacman_remain--;
	board[10][10] = 2;

	for (var i = 0; i < 20; i++) {
		board[i][0] = 4;
		board[i][19] = 4;
	}
	for (var i = 0; i < 20; i++) {
		board[0][i] = 4;
		board[19][i] = 4;
	}
	console.log("food:", smallFood, largeFood, bigFood);
	while (smallFood > 0 && food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 11; //11 -> food small
		food_remain--;
		smallFood--;
	}
	while (largeFood > 0 && food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 12; //12 -> food large
		food_remain--;
		largeFood--;
	}
	while (bigFood > 0 && food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 13; //13 -> food Big
		food_remain--;
		bigFood--;
	}

	board[17][18] = 100;
	board[12][12] = 50;

	// //monster Amount , use distance function.
	// while (keepGhosts > 0) {
	// 	var emptyCell = findRandomEmptyCell(board);
	// 	if (distance(emptyCell[0], emptyCell[1]) > 3) {
	// 		board[emptyCell[0]][emptyCell[1]] = 6; // 6 -> monster!
	// 		let pos = [emptyCell[0], emptyCell[1]];
	// 		ghostList.push(pos);// new monster add to the ghost list !
	// 		keepGhosts--;
	// 	}
	// }


	keysDown = {};
	addEventListener(
		"keydown",
		function (e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function (e) {
			keysDown[e.keyCode] = false;
		},
		false
	);

	interval = setInterval(UpdatePosition, 100);
	interval1 = setInterval(updateGhost, 1000);
}

function distance(x, y) {
	let yy = Math.abs(shape.i - x) + Math.abs(shape.j - y);
	// console.log(yy);
	return yy;
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 19 + 1);
	var j = Math.floor(Math.random() * 19 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 19 + 1);
		j = Math.floor(Math.random() * 19 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	// console.log(keysDown)
	if (keysDown[upKey]) {
		return 1;
	}
	if (keysDown[downKey]) {
		return 2;
	}
	if (keysDown[leftKey]) {
		return 3;
	}
	if (keysDown[rightKey]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	timeLeft = Math.floor(keepGameTime - time_elapsed);
	lblTime.value = timeLeft;
	if (timeLeft <= 0) {
		console.log("end of time");
		endGame();
	}
	for (var i = 0; i < 20; i++) {
		for (var j = 0; j < 20; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) { //draw pacman
				context.drawImage(Images[0], center.x - 30, center.y - 30, 40, 40)
			}
			else if (board[i][j] == 11) { //draw food
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = threeColors[0]; //color
				context.fill();
			} else if (board[i][j] == 12) { //draw food
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = threeColors[1]; //color
				context.fill();
			} else if (board[i][j] == 13) { //draw food
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = threeColors[2]; //color
				context.fill();
			}
			else if (board[i][j] == 4) { // wall
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
			else if (board[i][j] == 6) { // ghost
				context.drawImage(Images[3], center.x - 30, center.y - 30, 50, 50)
			}
			else if (board[i][j] == 100) { // cherry - Bonus !
				context.drawImage(Images[1], center.x - 30, center.y - 30, 50, 50)
			}
			else if (board[i][j] == 50) { // clock - Bonus !
				context.drawImage(Images[2], center.x - 30, center.y - 30, 50, 50)
			}
		}
	}
}

function endGame() {
	gameOn = false;
	ShowDialogGameOver();
	gameMusic.pause();
}

function UpdatePosition() {
	if (gameOn) {
		board[shape.i][shape.j] = 0;
		var x = GetKeyPressed();
		if (x == 1) {// up
			if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
				shape.j--;
			}
		}
		if (x == 2) { // down
			if (shape.j < 19 && board[shape.i][shape.j + 1] != 4) {
				shape.j++;
			}
		}
		if (x == 3) { // left
			if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
				shape.i--;
			}
		}
		if (x == 4) {//right
			if (shape.i < 19 && board[shape.i + 1][shape.j] != 4) {
				shape.i++;
			}
		}
		if (board[shape.i][shape.j] == 11) {
			score += 5; ballLeft--; actualFoodAmout--;
		}
		if (board[shape.i][shape.j] == 12) {
			score += 15; ballLeft--; actualFoodAmout--;
		}
		if (board[shape.i][shape.j] == 13) {
			score += 25; ballLeft--; actualFoodAmout--;
		}
		if (board[shape.i][shape.j] == 100) { // life bonus
			life += 1; lblLife.value -= -1;
			console.log("+1 life");
		}
		if (board[shape.i][shape.j] == 50) { // time bonus
			//todo: add the time !
			console.log("+ 20 second time bonus");
		}

		var currentTime = new Date();
		time_elapsed = (currentTime - start_time) / 1000;

		board[shape.i][shape.j] = 2;
		// ghost eat the packman?
		for (let i = 0; i < ghostList.length; i++) {
			if (ghostList[i][0] == shape.i && ghostList[i][1] == shape.j) {
				life--;
				lblLife.value -= 1;
				score -= 10;// new -> every eat 
				if (score < 0) {
					score = 0;
				}
				if (life == 0) {
					console.log("game over! losing..");
					gameMusic.pause();
					gameMusic.currentTime = 0;
					window.clearInterval(interval);
					window.clearInterval(interval1);
					// window.alert("game over!, You lost");
					endGame();
				} else {
					let pos = findRandomEmptyCell(board);
					shape.i = pos[0];
					shape.j = pos[1];
				}
			}
		}
		// player win the game?
		if (ballLeft == 0 || actualFoodAmout == 0) {
			console.log("Winner !!");
			gameMusic.pause();
			gameMusic.currentTime = 0;
			window.clearInterval(interval);
			window.clearInterval(interval1);
			// window.alert("winner!");
			endGame();
		} else {
			Draw();
		}
	}
}

function calcNextStepGhost(x, y) {
	// x,y - current location of the ghost.
	let lstNextmove = checkMoveGhost(x, y);
	dlst = [];
	lstNextmove.forEach(element => {
		let dis = distance(element[0], element[1]);
		dlst.push([element, dis]);
	});
	let min = 23;
	let indx;
	for (let k = 0; k < dlst.length; k++) {
		if (dlst[k][1] < min) {
			min = dlst[k][1];
			indx = dlst[k][0];
		}
	}
	// check best move, and maybe random ..
	return indx;
}

function checkMoveGhost(x, y) {
	let lstghostNextmove = [];
	if (y > 0 && board[x][y - 1] != 4 && board[x][y - 1] != 6) {
		lstghostNextmove.push([x, y - 1]);
	}
	if (y < 19 && board[x][y + 1] != 4 && board[x][y + 1] != 6) {
		lstghostNextmove.push([x, y + 1]);
	}
	if (shape.i > 0 && board[x - 1][y] != 4 && board[x - 1][y] != 6) {
		lstghostNextmove.push([x - 1, y]);
	}
	if (shape.i < 19 && board[x + 1][y] != 4 && board[x + 1][y] != 6) {
		lstghostNextmove.push([x + 1, y]);
	}
	return lstghostNextmove;
}

function updateGhost() {
	var newlst = new Array();//new Array(monsterAmount)
	for (let k = 0; k < ghostList.length; k++) {

		let mon = ghostList[k];
		let x = mon[0]; // x of ghost
		let y = mon[1]; // y of ghost
		let i;
		let j;
		try {
			let pos = calcNextStepGhost(x, y);
			i = pos[0]
			j = pos[1]
		}
		catch (error) {
			console.log("This ghost can't move, check next ghost");
			i = x;
			j = y;
		}
		board[x][y] = prev;

		prev = board[i][j];

		if (prev == 2) {// if ghost eat the packman, draw empty cell
			prev = 0;
		}
		board[i][j] = 6; // make it ghost.
		newlst.push([i, j]);

	}
	ghostList = newlst;
	//todo: make prevs as many as ghost number.
}
