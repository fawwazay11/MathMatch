
const leftCards = [
    { id: 1, question: "f(x) = 2x, f'(x)?" },
    { id: 2, question: "f(x) = x^2, f'(x)?" },
    { id: 3, question: "f(x) = x^3, f'(x)?" },
    { id: 4, question: "f(x) = sin(x), f'(x)?" },
];

const rightCards = [
    { id: 1, answer: "2" },
    { id: 2, answer: "2x" },
    { id: 3, answer: "3x^2" },
    { id: 4, answer: "cos(x)" },
];

let selectedLeftCard = null;
let selectedRightCard = null;
let score = 0;
let timeLeft = 60;
const totalTime = 60; // Total game time
let matchedPairs = 0; // Count of matched pairs
const totalPairs = leftCards.length; // Total pairs
let decisionTimer; // Decision timer reference
let decisionTimeLeft = 5; // Time for decision phase


function initializeGame() {
    const leftZone = document.getElementById("left-zone");
    const rightZone = document.getElementById("right-zone");

    leftZone.innerHTML = '';
    rightZone.innerHTML = '';

    leftCards.forEach((card) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.dataset.id = card.id;
        div.dataset.type = "left";
        div.innerText = ""; // Initially blank
        div.addEventListener("click", () => flipLeftCard(div, card.question));
        leftZone.appendChild(div);
    });

    rightCards.forEach((card) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.dataset.id = card.id;
        div.dataset.type = "right";
        div.innerText = ""; // Initially blank
        div.addEventListener("click", () => flipRightCard(div, card.answer));
        rightZone.appendChild(div);
    });
}

function flipLeftCard(div, content) {
    if (selectedLeftCard || div.classList.contains("flipped")) return; // Prevent multiple clicks
    div.innerText = content;
    div.classList.add("flipped");
    selectedLeftCard = div;
}

function flipRightCard(div, content) {
    if (!selectedLeftCard || selectedRightCard || div.classList.contains("flipped")) return;

    div.innerText = content;
    div.classList.add("flipped");
    selectedRightCard = div;

    if (selectedLeftCard && selectedRightCard) {
        showCloseUpView();
        startDecisionTimer();
    }
}

function showCloseUpView() {
    document.getElementById("left-zone").style.display = "none";
    document.getElementById("right-zone").style.display = "none";

    const closeUpContainer = document.createElement("div");
    closeUpContainer.id = "close-up-container";
    closeUpContainer.style.display = "flex";
    closeUpContainer.style.justifyContent = "center";
    closeUpContainer.style.alignItems = "center";
    closeUpContainer.style.gap = "20px";

    closeUpContainer.innerHTML = `
        <div class="close-up-card">${selectedLeftCard.innerText}</div>
        <div class="close-up-card">${selectedRightCard.innerText}</div>
    `;
    document.getElementById("game-container").appendChild(closeUpContainer);

    document.getElementById("decision-buttons").style.display = "flex";
}


function startDecisionTimer() {
    const existingTimer = document.getElementById("decision-timer");
    if (existingTimer) existingTimer.remove();

    const decisionTimerDisplay = document.createElement("div");
    decisionTimerDisplay.id = "decision-timer";
    decisionTimerDisplay.innerText = `Decision Time: ${decisionTimeLeft}s`;
    document.body.appendChild(decisionTimerDisplay);

    clearInterval(decisionTimer); // Clear any existing timer
    decisionTimer = setInterval(() => {
        decisionTimeLeft--;
        decisionTimerDisplay.innerText = `Decision Time: ${decisionTimeLeft}s`;

        if (decisionTimeLeft <= 0) {
            clearInterval(decisionTimer);
            score = Math.max(0, score - 1);
            document.getElementById("score-value").innerText = score;
            alert("Time's up! -1 point.");
            resetTurn();
        }
    }, 1000);

    document.getElementById("match-button").onclick = () => {
        clearInterval(decisionTimer);
        evaluateMatch(true);
    };

    document.getElementById("not-match-button").onclick = () => {
        clearInterval(decisionTimer);
        evaluateMatch(false);
    };
}

function evaluateMatch(isMatch) {
    const leftId = selectedLeftCard.dataset.id;
    const rightId = selectedRightCard.dataset.id;

    if ((leftId === rightId && isMatch) || (leftId !== rightId && !isMatch)) {
        score += leftId === rightId ? 5 : 1;

        if (leftId === rightId) {
            selectedLeftCard.style.visibility = "hidden";
            selectedRightCard.style.visibility = "hidden";
            matchedPairs++;
        }
    } else if (score > 0) {
        score -= 2;
    }

    document.getElementById("score-value").innerText = score;

    resetTurn();

    if (matchedPairs === totalPairs) {
        endGame(true);
    }
}

function resetTurn() {
    const closeUpContainer = document.getElementById("close-up-container");
    if (closeUpContainer) closeUpContainer.remove();

    const decisionTimerDisplay = document.getElementById("decision-timer");
    if (decisionTimerDisplay) decisionTimerDisplay.remove();

    selectedLeftCard = null;
    selectedRightCard = null;
    decisionTimeLeft = 5;

    const leftZone = document.getElementById("left-zone");
    const rightZone = document.getElementById("right-zone");
    leftZone.style.display = "grid";
    rightZone.style.display = "grid";

    document.getElementById("decision-buttons").style.display = "none";


    document.querySelectorAll(".card").forEach((card) => {
        if (card.style.visibility === "hidden") {

            card.style.display = "none";
        } else {

            card.style.display = "block";
            card.style.margin = "0 auto";
            card.innerText = ""; 
            card.classList.remove("flipped"); 
        }
    });
}


function startTimer() {
    const timerBar = document.getElementById("timer-bar");

    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time-left").innerText = timeLeft;

        const progressPercentage = (timeLeft / totalTime) * 100;
        timerBar.style.width = `${progressPercentage}%`;

        if (progressPercentage <= 50 && progressPercentage > 20) {
            timerBar.style.backgroundColor = "#ffc107";
        } else if (progressPercentage <= 20) {
            timerBar.style.backgroundColor = "#dc3545";
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame(false);
        }
    }, 1000);
}

function endGame(allCardsMatched) {
    if (allCardsMatched) {
        score += timeLeft;
        document.getElementById("score-value").innerText = score;
        alert(`Congratulations! Your final score is ${score}.`);
    } else {
        alert(`Time's up! Your final score is ${score}.`);
    }

    document.querySelectorAll(".card").forEach((card) => (card.style.pointerEvents = "none"));
    document.getElementById("decision-buttons").style.display = "none";

    const returnButton = document.createElement("button");
    returnButton.classList.add("return-button");
    returnButton.innerText = "Return to Menu";
    returnButton.onclick = () => {
        window.location.href = "menu.html";
    };

    document.getElementById("game-container").appendChild(returnButton);
}

initializeGame();
startTimer();
