const WORD_BANK = [
    "HACKING", "NETWORK", "MALWARE", "ROUTERS", "PACKETS", 
    "SERVERS", "MONITOR", "DISPLAY", "KEYPADS", "SYSTEMS", 
    "CONSOLE", "COMMAND", "ENCRYPT", "DECRYPT", "TROJANS",
    "FIREWALL", "PHISHING", "BOTNETS", "SPYWARE", "EXPLOIT"
];

const DUD_BANK = [
    "[!@#$]", "[%^&*]", "[<>?/]", "[-_+=]", "[~|\\}]", "[1234]"
];

let secret = "";
let attempts = 4;
let terminalList = [];
let isGameOver = false;

const wordListEl = document.getElementById("word-list");
const consoleOutputEl = document.getElementById("console-output");
const attemptsDisplayEl = document.getElementById("attempts-display");

function initGame() {
    isGameOver = false;
    attempts = 4;
    consoleOutputEl.innerHTML = "";
    logToConsole("CYBERSEC TERMINAL INTERFACE INITIALIZED");
    
    // Pick 2-3 duds (matching random.randint(2, 3))
    let numDuds = Math.floor(Math.random() * 2) + 2; 
    
    // Sample 10 words and the duds
    let activeWords = [...WORD_BANK].sort(() => 0.5 - Math.random()).slice(0, 10);
    let activeDuds = [...DUD_BANK].sort(() => 0.5 - Math.random()).slice(0, numDuds);
    
    // Combine and shuffle (terminal_list = active_words + active_duds)
    terminalList = [...activeWords, ...activeDuds].sort(() => 0.5 - Math.random());
    
    // Choose the secret word
    secret = activeWords[Math.floor(Math.random() * activeWords.length)];
    
    renderTerminal();
    updateAttemptsDisplay();
}

function renderTerminal() {
    wordListEl.innerHTML = "";
    
    terminalList.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "word";
        
        // Generate the fake memory address (e.g., 0x1A2B) exactly like your Python loop
        const hex = "0x" + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000).toString(16).toUpperCase();
        
        div.innerText = `${hex}: ${item}`;
        
        // Only allow clicking if the game is active and the item isn't "........"
        if (item !== "........" && !isGameOver) {
            div.onclick = () => handleGuess(item, index);
        } else if (item === "........") {
            div.style.opacity = "0.3";
            div.style.cursor = "default";
        }
        
        wordListEl.appendChild(div);
    });
}

function handleGuess(guess, index) {
    if (isGameOver) return;

    logToConsole(`> ${guess}`);

    // Dud Mechanic: If user clicks a bracketed dud
    if (guess.startsWith("[")) {
        terminalList[index] = "........";
        logToConsole(`> ${guess} DISCARDED FROM BUFFER`);
        
        // Find one wrong word and remove it
        for (let i = 0; i < terminalList.length; i++) {
            let word = terminalList[i];
            if (word !== secret && WORD_BANK.includes(word) && word !== "........") {
                terminalList[i] = "........";
                logToConsole(`> DUD REMOVED: ${word}`);
                break;
            }
        }
        renderTerminal();
        return;
    }

    // Win State
    if (guess === secret) {
        logToConsole("> ACCESS GRANTED. SYSTEM UNLOCKED.");
        wordListEl.innerHTML = "<h2 style='color: #1fff0f;'>SYSTEM UNLOCKED</h2><div class='word' style='margin-top: 20px;' onclick='initGame()'>[REBOOT TERMINAL]</div>";
        isGameOver = true;
        return;
    }

    // Incorrect Guess
    attempts--;
    
    // Likeness Calculation (Matches Python exactly: shared unique characters)
    let secretSet = new Set(secret.split(''));
    let guessSet = new Set(guess.split(''));
    let matched = [...secretSet].filter(char => guessSet.has(char));
    
    logToConsole(`> ENTRY DENIED. LIKENESS=${matched.length}`);
    terminalList[index] = "........";
    
    updateAttemptsDisplay();
    renderTerminal();

    // Loss State
    if (attempts <= 0) {
        logToConsole(`> LOCKOUT INITIATED. PASSWORD WAS: ${secret}`);
        wordListEl.innerHTML = `<h2 style='color: red;'>SYSTEM LOCKED</h2><p>PASSWORD WAS: ${secret}</p><div class='word' style='margin-top: 20px;' onclick='initGame()'>[REBOOT TERMINAL]</div>`;
        isGameOver = true;
    }
}

function updateAttemptsDisplay() {
    let blocks = "■ ".repeat(attempts);
    attemptsDisplayEl.innerText = `ATTEMPTS REMAINING: ${blocks}`;
}

function logToConsole(message) {
    const p = document.createElement("p");
    p.innerText = message;
    consoleOutputEl.appendChild(p);
    
    // Keeps the console window from scrolling infinitely
    if (consoleOutputEl.children.length > 8) {
        consoleOutputEl.removeChild(consoleOutputEl.firstChild);
    }
}

// Start game
initGame();
