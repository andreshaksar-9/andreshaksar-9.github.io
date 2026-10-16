const WORD_LENGTH = 7;
const TOTAL_ATTEMPTS = 4;
const allWords = [
    "HACKING", "NETWORK", "MALWARE", "ROUTERS", "PACKETS", 
    "SERVERS", "MONITOR", "DISPLAY", "KEYPADS", "SYSTEMS", 
    "CONSOLE", "COMMAND", "ENCRYPT", "DECRYPT", "Trojans"
].map(w => w.toUpperCase());

let password = "";
let attempts = TOTAL_ATTEMPTS;
let activeWords = [];

const wordListEl = document.getElementById("word-list");
const consoleOutputEl = document.getElementById("console-output");
const attemptsDisplayEl = document.getElementById("attempts-display");

function initGame() {
    // Select 10 random words
    let shuffled = [...allWords].sort(() => 0.5 - Math.random());
    activeWords = shuffled.slice(0, 10);
    
    // Pick the winning password
    password = activeWords[Math.floor(Math.random() * activeWords.length)];
    
    // Render words
    wordListEl.innerHTML = "";
    activeWords.forEach(word => {
        const div = document.createElement("div");
        div.className = "word";
        div.innerText = word;
        div.onclick = () => handleGuess(word, div);
        wordListEl.appendChild(div);
    });

    updateAttemptsDisplay();
    logToConsole("INITIALIZING SYSTEM...");
}

function handleGuess(guess, element) {
    if (attempts <= 0 || guess === password) return;

    let similarity = 0;
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guess[i] === password[i]) similarity++;
    }

    logToConsole(`> ${guess}`);
    
    if (guess === password) {
        logToConsole(`> EXACT MATCH!`);
        logToConsole(`> PLEASE WAIT WHILE SYSTEM IS ACCESSED...`);
        wordListEl.innerHTML = "<h2 style='color: #1fff0f;'>SYSTEM UNLOCKED</h2>";
        return;
    }

    attempts--;
    logToConsole(`> ENTRY DENIED`);
    logToConsole(`> SIMILARITY: ${similarity}/${WORD_LENGTH}`);
    updateAttemptsDisplay();

    // Disable the clicked word
    element.onclick = null;
    element.style.opacity = "0.3";
    element.style.cursor = "default";

    if (attempts === 0) {
        logToConsole(`> TERMINAL LOCKED`);
        logToConsole(`> PLEASE CONTACT ADMINISTRATOR`);
        wordListEl.innerHTML = "<h2 style='color: red;'>SYSTEM LOCKED</h2>";
    }
}

function updateAttemptsDisplay() {
    let blocks = "[ ] ".repeat(attempts);
    attemptsDisplayEl.innerText = `${attempts} ATTEMPT(S) LEFT: ${blocks}`;
}

function logToConsole(message) {
    const p = document.createElement("p");
    p.innerText = message;
    consoleOutputEl.appendChild(p);
}

// Start game
initGame();
