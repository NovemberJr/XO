function update(res) {
	
}

function restart (res) {
	for (i = 0; i < 9; i++) gameField[i] = "";
	noughtsTurn = false;
	castLot(res);
	console.log('restart says: game field = '+gameField);
	res.end();
}

function castLot (res) {
	if (Math.random() < 0.8) {
		playersTurn = true;
		player.mark = "X";
		bot.mark = "O";
		res.write("<p>You're playing <span class=\'chat_cross\'>&times</span></p>,");
	} else {
		playersTurn = false;
		player.mark = "O";
		bot.mark = "X";
		//через запятую - крестик, который ставится компьтером в центр в первый ход
		res.write("<p>Congratulations! You are <span class=\'chat_nought\'>O</span></p>,<div class='cross1'></div><div class='cross2'></div>");
		bot.chooseMove(res);
	}
}

function makeMove (res, query) {
	//завершение, если ход не игрока
	if (!playersTurn) {
		console.log('makemove says: player\'s turn = '+playersTurn);
		res.write(gameField.join(","));
		res.end();
		return;
	}
	//победа игрока
	var flag = bot.checkAlert(player.mark, "");
	
	//ставим отметку игрока на поле
	gameField[+query.box] = player.mark;
	
	if (passTurn(res)) {return;}
	if (flag != -1 & flag != bot.checkAlert(player.mark, "")) {
		res.write(gameField.join(",")+", You won!");
		res.end();
		return;
		}
	if (bot.chooseMove(res)) return;
	res.write(gameField.join(","));
	res.end();
}

function isBoxEmpty (box) {
	if (gameField[box] == "") return true;
}

function checkDraw (res) {
	for (var i = 0; i < 9; i++) {
		if (gameField[i] == "") return 0;
	}
	console.log('checkdraw says: draw ');
	res.write(gameField.join(",")+",Draw");
	res.end(); 
	return 1;
}

function passTurn(res) {
	console.log('passturn says: gamefield = '+gameField);
	noughtsTurn = !noughtsTurn;
	playersTurn = !playersTurn;
	return checkDraw(res);
}


bot = {
	name: "Michael Bot",
	
	checkAlert: function (claimer, bot) {
		//перебор клеток по часовой стрелке
		var clockwise = [0, 1, 2, 5, 8, 7, 6, 3, 0, 1];
		for (i = 0, inCorner = true; i < clockwise.length - 2; i++, inCorner = !inCorner ){			
			if (gameField[clockwise[i]] == claimer & gameField[clockwise[i+1]] == claimer & isBoxEmpty(inCorner ? clockwise[i+2] : clockwise[i-1])) {
				gameField[(inCorner ? clockwise[i+2] : clockwise[i-1])] = bot;
				return (inCorner ? clockwise[i+2] : clockwise[i-1]);
			}
			if (gameField[clockwise[i]] == claimer & inCorner & gameField[clockwise[i+2]] == claimer & isBoxEmpty(clockwise[i+1])) {
				gameField[clockwise[i+1]] = bot;
				return clockwise[i+1];
			}
		}
		
		//проверка на диагональные победные ходы
		for (i = 0; i < 9; i++){		
			if (gameField[i] == claimer & gameField[4] == claimer & isBoxEmpty(8-i)) {
				gameField[8-i] = bot;
				return 8-i;
			}
		}
		return -1;
	},
	
	randomMove: function () {
		console.log("random move");
		var boxes = [0, 2, 6, 8, 1, 3, 5, 7];
		while (1) {
			var i = boxes[Math.floor(Math.random()*boxes.length)];
			if (isBoxEmpty(i)) {
				gameField[i] = this.mark;
				break;
			}
		}	
	},

	chooseMove: function (res) {
		console.log("Michael says: I choose wisely");
		if (playersTurn) return;
		
		//сначала - ход в центр
		if (gameField[4] == "") {
			gameField[4] = this.mark;
		} else if (this.checkAlert (bot.mark, bot.mark) != -1) {
			//затем - проверка, есть ли победные ходы для бота
			//setTimeout(alert, 50, "Michael Bot wins");
			console.log("Michael says: I won");
			res.write(gameField.join(",")+", Michael Bot wins");
			res.end();
			return 1;
		} else if (this.checkAlert (player.mark, bot.mark) != -1) {
			//затем - проверка, есть ли победные ходы для игрока
		} else this.randomMove();
		if (passTurn(res)) return 1;
		return 0;
	}	
};


exports.update = update;
exports.restart = restart;
exports.makeMove = makeMove;
