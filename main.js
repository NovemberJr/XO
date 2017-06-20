/*
function update() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'update');
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) return;
				
		if (xhr.status != 200) {
			messageBox.innerHTML = xhr.status + ': ' + xhr.statusText;
		} else {
			messageBox.innerHTML = xhr.responseText;
		}
	}
	xhr.send();
}
*/
function restart() {
	for (i = 0; i < 9; i++) $(".box")[i].innerHTML = "";
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'restart');
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) return;
				
		if (xhr.status != 200) {
			messageBox.innerHTML = xhr.status + ': ' + xhr.statusText;
		} else {
			messageBox.innerHTML += xhr.responseText.split(',')[0];
			$(".box")[4].innerHTML = xhr.responseText.split(',')[1]
		}
	}
	xhr.send();
}


function makeMove() {
	//проверка перед отправкой
	if (this.innerHTML != "") return;
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'makeMove?box=' + gameField.indexOf(this));
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) return;
				
		if (xhr.status != 200) {
			messageBox.innerHTML += xhr.status + ': ' + xhr.statusText;
		} else {
			var response = xhr.responseText.split(',');
			for (i = 0; i < 9; i++){
				//response - массив с содержимым ячеек, то есть с Х и О
				if (response[i] == "X")	$(".box")[i].innerHTML = "<div class='cross1'></div><div class='cross2'></div>";
				else if (response[i] == "O")	$(".box")[i].innerHTML = "<div class='nought'></div>";
				else $(".box")[i].innerHTML = "";
			}
			if (response[9] != null) alert(response[9]);
			//messageBox.innerHTML += '['+xhr.responseText+']';
		}
	}
	xhr.send();
}


$(document).ready(function () {
	gameField = [];
	for (i = 0; i < $('.box').length; i++) gameField[i] = $('.box')[i];
	//массив содержит сами ячейки поля, а не их содержимое; для того, чтобы определить индекс ячейки, с которой приходит вызов
	
	//setInterval("update()", 1000); // Обновление окна чата каждую секунду
	restart();
	$(".box").on("click", makeMove);
	$("#reset").on("click", restart);
});
