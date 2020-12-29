const getElement = (selector) => document.querySelector(selector);

const getAllElements = (selector) => document.querySelectorAll(selector);

let score = Number(window.localStorage.getItem("score")) || 0;

const choiceList = ["lizard", "scissors", "paper", "spock", "rock"];

let gameStep = 0,
	playerChoice = "",
	houseChoice = "";

const ruleContainer = getElement(".rules-container");

const bodyElement = getElement("body");

const playerChoiceContainer = getElement(".js-player");

const houseChoiceContainer = getElement(".js-house");

const scoreContainer = getElement(".score");
scoreContainer.innerHTML = score;

const resultContainer = getElement(".js-game-result");

const gameIcons = getAllElements(".icon");

const ruleButtons = getAllElements(".js-btn-rules");

const gameScreens = getAllElements(".section");

const getRandomIndex = (arrayLength) => {
	return Math.floor(Math.random() * arrayLength);
};

const changeScreen = () => {
	gameScreens.forEach((screen) => screen.classList.remove("show-screen"));
	gameScreens[gameStep].classList.add("show-screen");
};

const selectHouseChoice = () => {
	const arrayLength = choiceList.length;
	let choice = choiceList[getRandomIndex(arrayLength)];
	while (choice === playerChoice) {
		choice = choiceList[getRandomIndex(arrayLength)];
	}
	houseChoice = choice;
};

const createChoiceHtml = (choice) => {
	const choiceElement = `
    <div class="icon icon--big icon--${choice} selected">
      <span>
        <img src="./images/icon-${choice}.svg" class="icon__image--big"/>
      <span>
    <div>
  `;
	return choiceElement;
};

const addPlayerToScreen = (choice) => {
	const choiceElement = createChoiceHtml(choice);
	playerChoiceContainer.innerHTML = "";
	playerChoiceContainer.innerHTML = `
    <p>you picked</p>
    ${choiceElement}
  `;
};

const addHouseToScreen = (choice) => {
	const choiceElement = createChoiceHtml(choice);
	houseChoiceContainer.innerHTML = "";
	houseChoiceContainer.innerHTML = `
    <p>The house picked</p>
    ${choiceElement}
  `;
};

const isPlayerWinner = () => {
	if (playerChoice === "lizard" && (houseChoice === "spock" || houseChoice ==="paper"))
		return true;
	if (playerChoice === "spock" && (houseChoice === "scissors" || houseChoice === "rock"))
		return true;
	if (playerChoice === "scissors" && (houseChoice === "lizard" || houseChoice === "paper"))
		return true;
	if (playerChoice === "paper" && (houseChoice === "rock" || houseChoice === "spock"))
		return true;
	if (playerChoice === "rock" && (houseChoice === "lizard" || houseChoice === "scissors"))
		return true;

	return false;
};

const displayScore = (type) => {
	if (type === "win") {
		score += 1;
	} else if (type === "lose" && score > 0) {
		score -= 1;
	}
	scoreContainer.innerHTML = score;
	window.localStorage.setItem("score", score);
};

const setUpResetButton = () => {
  const resetButton = getElement('.btn--reset');
  resetButton.addEventListener('click', e => {
    resetGame();
  })
}

const resetGame = () => {
  gameStep -= 1;
  changeScreen();
}

const displayMessage = (msg) => {
	let messageElement = `
      <p>${msg}</p>
      <button class="btn btn--reset">play again<button>
  `;
  resultContainer.innerHTML = '';
	resultContainer.innerHTML = messageElement;
  setUpResetButton();
};

const displayGameResults = () => {
	let resultMessage = "";
	if (isPlayerWinner()) {
		resultMessage = "you win";
		displayScore("win");
    getElement('.js-player .selected').classList.add('win');
	} else {
		resultMessage = "you lose";
		displayScore("lose");
    getElement('.js-house .selected').classList.add('win');
	}
	displayMessage(resultMessage);
};

const startGame = (element) => {
	playerChoice = element.dataset.icon;
	changeScreen();
	addPlayerToScreen(playerChoice);
	selectHouseChoice();
	console.log(playerChoice, houseChoice);
	addHouseToScreen(houseChoice);
	displayGameResults();
};

ruleButtons.forEach((button) =>
	button.addEventListener("click", (e) => {
		ruleContainer.classList.toggle("is-visible");
		bodyElement.classList.toggle("is-visible-child");
	})
);

gameIcons.forEach((icon) =>
	icon.addEventListener("click", (e) => {
		gameStep += 1;
		startGame(e.currentTarget);
	})
);