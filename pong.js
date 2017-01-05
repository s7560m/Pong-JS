var ball, paddle, A_I,
    speedX = 10,//This is a constant
	   speedY = 0, //This will change
    game = document.getElementById('game'),
    ctx = game.getContext('2d'),
    score = [0, 0],
    center = [game.width / 2, game.height / 2],
    fps = 75;

function drawBox(x, y, size, size2) {
	ctx.fillStyle = 'black';
	ctx.fillRect(x, y, size, size2);
}

function handleKeys(e) {
	var keys = [38, 40]; //in the format wasd, but with arrow keys
	for (var i = 0; i < keys.length; i++) {
		if (e.keyCode === keys[i]) {
			switch(i) {
				case 0:
					paddle.dir = "up";
					break;
				case 1:
					paddle.dir = "down";
					break;
			}

		}
		else continue;
	}
	return true;
}

function bounce(ai, paddle, obj) {
//This allows the ball to bounce
	obj.dir.y = (((obj.dir.y === "down" && obj.curPos[1] >= game.height - 25) ? "up" : null) ||
	((obj.dir.y === "up" && obj.curPos[1] <= 0) ? "down" : null) || obj.dir.y);
	if ((obj.dir.x === "left" || obj.dir.y === "center") && obj.curPos[0] <= ai.curPos[0] + 25) {
		(obj.curPos[1] <= ai.curPos[1] && obj.curPos[1] >= ai.curPos[1] - 25)
		? (speedY += 1, obj.dir.y = "up", obj.dir.x = "right") : null;
		(obj.curPos[1] <= ai.curPos[1] + 25 && obj.curPos[1] >= ai.curPos[1])
		? obj.dir.x = "right" : null;
		(obj.curPos[1] <= ai.curPos[1] + 50 && obj.curPos[1] >= ai.curPos[1] + 25)
		? (obj.dir.x = "right", speedY += 1, obj.dir.y = "down") : null;
	}
	else if (obj.dir.x === "right" && obj.curPos[0] >= paddle.curPos[0] - 25) {
    (obj.curPos[1] <= paddle.curPos[1] + 0 && obj.curPos[1] >= paddle.curPos[1] - 25)
		? (speedY += 1, obj.dir.y = "up", obj.dir.x = "left") : null;
		(obj.curPos[1] <= paddle.curPos[1] + 25 && obj.curPos[1] >= paddle.curPos[1])
		? (speedY += 1, obj.dir.y = "up", obj.dir.x = "left") : null;
		(obj.curPos[1] <= paddle.curPos[1] + 50 && obj.curPos[1] >= paddle.curPos[1] + 25)
		? obj.dir.x = "left" : null;
		(obj.curPos[1] <= paddle.curPos[1] + 75 && obj.curPos[1] >= paddle.curPos[1] + 50)
		? (speedY += 1, obj.dir.y = "down", obj.dir.x = "left") : null;
	}
}

function AI(ai, obj) {
  var buffer = 10;
  var y = 1;
	if (ai.curPos[y] + 25 - buffer > obj.curPos[y]) {
    ai.dir = "up";
  } else if (ai.curPos[y] + 25 + buffer < obj.curPos[y]) {
    ai.dir = "down";
  } else {
    ai.dir = "center";
  }
}
function move(obj, pad, ai) {
//This also handles paddle and AI movement
  var x = 0, y = 1;
	var handler = [obj, pad, ai];
	for (var i = 0; i < 3; i++) {
		switch(handler[i].dir.y || handler[i].dir) {
			case "up":
        handler[i].curPos[y] -= (i === 0) ? speedY : 15;
        if (i !== 0 && handler[i].curPos[y] < 25) {
          while(handler[i].curPos[y] < 25) handler[i].curPos[y]++;
        }
				break;
			case "down":
				handler[i].curPos[y] += (i === 0) ? speedY : 15;
        if (i !== 0 && handler[i].curPos[y] > game.height - 75) {
          while(handler[i].curPos[y] > game.height - 75) handler[i].curPos[y]--;
        }
        break;
			case "center":
				break;
		}
	}
	obj.curPos[0] += (obj.dir.x === "left") ? -speedX : speedX;
}
function getScore(obj) {
	var funcs = {
		a0: function() {
			obj.curPos = [center[0], center[1]];
			obj.dir.x = "right";
			obj.dir.y = "center";
			paddle.curPos = [game.width - 25, center[1] + 25];
			speedY = 0;
		}
	};
	((obj.curPos[0] <= 0) ? (alert("player 1 scored"), funcs.a0()) : null) ||
	((obj.curPos[0] >= game.width) ? (alert("Computer scored"), funcs.a0()): null);
	if (score[0] - score[1] >= 2 && score[0] >= 7) {
		alert("Player 1 wins");
		location.reload();
	}
	else if (score[1] - score[0] >= 2 && score[1] >= 7) {
		alert("Computer wins");
		location.reload();
	}
}

ball = {
	curPos: [center[0], center[1]],
	dir: {x: "right", y: "center"}
};

A_I = {
	curPos: [25, center[1] + 25],
	dir: "center"
};

paddle = {  //The paddle that the user will control
	curPos: [game.width - 25, center[1] + 25],
	dir: "center"
};

function update() {  //Runs all of the code functions simultaneously
	ctx.clearRect(0, 0, game.width, game.height);
	drawBox(ball.curPos[0], ball.curPos[1], 25, 25);
	drawBox(paddle.curPos[0], paddle.curPos[1], 25, 75);
	drawBox(A_I.curPos[0], A_I.curPos[1], 25, 75);
	bounce(A_I, paddle, ball);
	move(ball, paddle, A_I);
	getScore(ball);
	AI(A_I, ball);
	window.addEventListener("keydown", handleKeys);
	window.addEventListener("keyup", function(e) {
    		if (handleKeys(e, true)) paddle.dir = "center";
	});
}

setInterval(update, 1000 / fps); //This will run all of the code until said time
