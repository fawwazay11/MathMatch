const gameBoard = document.getElementById("game-board");
const timerDisplay = document.getElementById("timer");
const resetButton = document.getElementById("reset-button");

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let timer = 60;
let timerInterval;

// Initialize Game
function initializeGame() {
    cards = generateCards();
    shuffledCards = shuffle(cards);
    renderCards(shuffledCards);
    matchedPairs = 0;
    flippedCards = [];
    timer = 60;
    timerDisplay.textContent = `Time Left: ${timer}`;
    resetButton.style.display = "none";
    clearInterval(timerInterval);
    startTimer();
}

// Generate Card Pairs
function generateCards() {
    const values = ["A", "B", "C", "D"];
    return [...values, ...values].map(value => ({ value, isMatched: false }));
}

// Shuffle Cards
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Render Cards on Game Board
function renderCards(cards) {
    gameBoard.innerHTML = "";
    cards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        cardElement.dataset.index = index;
        cardElement.addEventListener("click", () => flipCard(card, cardElement));
        gameBoard.appendChild(cardElement);
    });
}

// Handle Card Flip
function flipCard(card, cardElement) {
    if (flippedCards.length < 2 && !card.isMatched) {
        cardElement.textContent = card.value;
        cardElement.classList.add("flipped");
        flippedCards.push({ card, element: cardElement });

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

// Check for Match
function checkMatch() {
    const [first, second] = flippedCards;
    if (first.card.value === second.card.value) {
        first.card.isMatched = true;
        second.card.isMatched = true;
        matchedPairs++;
        if (matchedPairs === 4) endGame("win");
    } else {
        setTimeout(() => {
            first.element.classList.remove("flipped");
            first.element.textContent = "";
            second.element.classList.remove("flipped");
            second.element.textContent = "";
        }, 1000);
    }
    flippedCards = [];
}

// Start Timer
function startTimer() {
    timerInterval = setInterval(() => {
        timer--;
        timerDisplay.textContent = `Time Left: ${timer}`;
        if (timer === 0) endGame("lose");
    }, 1000);
}

// End Game
function endGame(result) {
    clearInterval(timerInterval);
    alert(result === "win" ? "You win!" : "Time's up! You lose!");
    resetButton.style.display = "block";
}

// Reset Game
resetButton.addEventListener("click", initializeGame);

// Start Game on Load
initializeGame();
