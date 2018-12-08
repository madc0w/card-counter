const slowInterval = 240;
const superspeedInterval = 10;
const colors = [ "red", "orange", "blue", "green", "yellow", "black", "white", "pink", ];
const numCards = 12;
const numWild = 8;
const stats = {
	"hands-dealt-stat" : 0,
	"no-cards-same-stat" : 0,
	"2-colors-same-stat" : 0,
	"3-colors-same-stat" : 0,
	"4-colors-same-stat" : 0,
	"5-colors-same-stat" : 0,
	"2-wilds-stat" : 0,
	"3-wilds-stat" : 0,
	"4-wilds-stat" : 0,
	"5-wilds-stat" : 0,
};
const testHand = [ "wild", "wild", "blue", "green", "yellow" ];

interval = slowInterval;
isCounting = false;
countIntervalId = null;

function onLoad() {
	deal();
}

function count() {
	isCounting = !isCounting;
	if (isCounting) {
		countIntervalId = setInterval(deal, interval);
		$("#count-button").html("Stop");
	} else {
		clearInterval(countIntervalId);
		countIntervalId = null;
		$("#count-button").html("Count!");
	}
}

function deal() {
	buildDeck();
	const hand = [];
	const numSame = {
		wild : 0
	};
	for (var i in colors) {
		numSame[colors[i]] = 0;
	}
	for (var cardNum = 1; cardNum <= 5; cardNum++) {
		const n = Math.floor(Math.random() * deck.length);
		const color = deck[n];
		//		const color = testHand[cardNum - 1];
		hand.push(color);
		for (var j in hand) {
			if (hand[j] == color) {
				numSame[color]++;
				break;
			}
		}

		//		$("#card" + cardNum).fadeTo(interval / 2.5, 0.5, function() {
		//			$(this).css("background-image", "url(" + color + "-card.png)");
		//		}).fadeTo(interval / 2.5, 1);

		$("#card" + cardNum).css("background-image", "url(" + color + "-card.png)");
		deck.splice(n, 1);
	}

	stats["hands-dealt-stat"]++;

	var isNoneSame = true;
	for (var color in numSame) {
		for (var j = 2; j <= 5; j++) {
			if (numSame[color] == j) {
				isNoneSame = false;
				if (color == "wild") {
					stats[j + "-wilds-stat"]++;
				} else {
					stats[j + "-colors-same-stat"]++;
				}
			}
		}
	}
	if (isNoneSame) {
		stats["no-cards-same-stat"]++;
	}

	const numHands = stats["hands-dealt-stat"];
	for (var key in stats) {
		const stat = stats[key];
		if (key == "hands-dealt-stat") {
			$("#" + key).html(stat);
		} else {
			const ratio = (100 * stat / numHands).toFixed(2);
			$("#" + key).html(stat + " ( " + ratio + "% )");
		}
	}
}

function buildDeck() {
	deck = [];
	for (var i in colors) {
		for (var j = 0; j < numCards; j++) {
			deck.push(colors[i]);
		}
	}
	for (var j = 0; j < numWild; j++) {
		deck.push("wild");
	}
}


function superspeedChange() {
	const isSuperspeed = $("#superspeed-checkbox")[0].checked;
	interval = isSuperspeed ? superspeedInterval : slowInterval;
	if (countIntervalId) {
		clearInterval(countIntervalId);
		isCounting = false;
		count();
	}
}
