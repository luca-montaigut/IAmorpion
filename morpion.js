ia = "J2";
map = [];
for (i = 0; i < 3; i++) {
	map[i] = [];
	for (j = 0; j < 3; j++)
		map[i][j] = "EMPTY";
}
finish = false;

const getZone = (x, y) => {
	if (y == 0)
		return 'A' + (x + 1);
	else if (y == 1)
		return 'B' + (x + 1);
	else
		return 'C' + (x + 1);
}

const fillGrid = (x, y, player) => {
	const image = (player == joueur) ? 'croix' : 'rond';
	const zone = getZone(x, y);

	if (map[x][y] != "EMPTY")
		return false;
	map[x][y] = player;
	document.getElementById(zone).style.backgroundImage = `url(image-morpion/${image}.png)`;
	document.getElementById(zone).className += " filled";
	checking(player);
	return true;
}

const playerTurn = (x, y) => {
	if (finish)
		return;
	if (!fillGrid(x, y, joueur)) {
		alert('La case n\'est pas vide');
		return;
	}
	else if (!finish)
		iaTurn();
};

const iaTurn = () => {
	x = 0;
	y = 0;
	while (!fillGrid(x, y, ia)) {
		console.log('test');
		x++;
		if (x >= 3) {
			x = 0;
			y++;
		}
	}
}

const checking = (player) => {
	one = map[0][0];
	two = map[0][1];
	three = map[0][2];
	four = map[1][0];
	five = map[1][1];
	six = map[1][2];
	seven = map[2][0];
	eight = map[2][1];
	nine = map[2][2];
	if (one === two && one === three && one != "EMPTY" ||
		four === five && four === six && four != "EMPTY" ||
		seven === eight && seven === nine && seven != "EMPTY" ||
		one === five && one === nine && one != "EMPTY" ||
		three === five && three === seven && three != "EMPTY" ||
		one === four && one === seven && one != "EMPTY" ||
		two === five && two === eight && two != "EMPTY" ||
		three === six && three === nine && three != "EMPTY") {
		finish = true;
		if (player == ia) {
			document.getElementById('victoire').textContent = 'L\'IA a gagné !';
		} else if (player == joueur) {
			document.getElementById('victoire').textContent = 'Tu as battu l\'IA !';
		}
	}
}

joueur = (ia == "J1") ? "J2" : "J1";
if (ia == "J1") {
	iaTurn();
}