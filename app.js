const WORD_BANK = [
    "HACKING", "NETWORK", "MALWARE", "ROUTERS", "PACKETS", 
    "SERVERS", "MONITOR", "DISPLAY", "KEYPADS", "SYSTEMS", 
    "CONSOLE", "COMMAND", "ENCRYPT", "DECRYPT", "TROJANS",
    "FIREWALL", "PHISHING", "BOTNETS", "SPYWARE", "EXPLOIT",
    "PAYLOAD", "ROOTKIT", "BACKDOOR", "VIRUSES", "GATEWAY",
    "KEYLOGS", "SCANNER", "SNIFFER", "SPOOFED", "ZOMBIES",
    "CIPHERS", "HASHING", "INTRUDE", "DATABSE", "VECTORS",
    "BREACH", "SPLICER", "PHANTOM", "PROXY", "BASTION"
];

const DUD_BANK = [
    "[!@#$]", "[%^&*]", "[<>?/]", "[-_+=]", "[~|\\}]", "[1234]",
    "(::::)", "{....}", "<////>", "[||||]", "(*&^%)", "{}{}{}"
];

let secret = "";
let attempts = 4;
let terminalData = [];
let isGameOver = false;

const wordListEl = document.getElementById("word-list");
const consoleOutputEl = document.getElementById("console-output");
const attemptsDisplayEl = document.getElementById("attempts-display");
const bodyEl = document.getElementById("body");

function initGame() {
    isGameOver = false;
    attempts = 4;
    consoleOutputEl.innerHTML = "";
    bodyEl.classList.remove("locked"); // Reset red theme
    logToConsole("GNK-CYBER SEC INTERFACE INITIALIZED");
    
    // Increased quantities for the new grid layout
    let numDuds = Math.floor(Math.random() * 3) + 4; 
    let numWords = 14; 
    
    let activeWords = [...WORD_BANK].sort(() => 0.5 - Math.random()).slice(0, numWords);
    let activeDuds = [...DUD_BANK].sort(() => 0.5 - Math.random()).slice(0, numDuds);
    
    let combined = [...activeWords, ...activeDuds].sort(() => 0.5 - Math.random());
    secret = activeWords[Math.floor(Math.random() * activeWords.length)];
    
    // Lock the hex codes to the items so they don't scramble on re-render
    terminalData = combined.map(item => ({
        text: item,
        hex: "0x" + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000).toString(16).toUpperCase(),
        status: "active" // Can be "active", "incorrect", or "removed"
    }));
    
    renderTerminal();
    updateAttemptsDisplay();
}

function renderTerminal() {
    wordListEl.innerHTML = "";
    
    terminalData.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "word";
        
        if (item.status === "removed") {
            div.innerText = `${item.hex}: ........`;
            div.style.opacity = "0.3";
            div.style.cursor = "default";
        } else {
            div.innerText = `${item.hex}: ${item.text}`;
            
            if (item.status === "incorrect") {
                div.classList.add("incorrect");
            }
            
            // Only allow clicking if the game is active and the word hasn't been guessed
            if (!isGameOver && item.status !== "incorrect") {
                div.onclick = () => handleGuess(index);
            } else if (item.status === "incorrect") {
                div.style.cursor = "default";
            }
        }
        
        wordListEl.appendChild(div);
    });
}

function handleGuess(index) {
    if (isGameOver) return;

    let item = terminalData[index];
    let guess = item.text;

    logToConsole(`> ${guess}`);

    // Dud Mechanic
    if (guess.startsWith("[")) {
        item.status = "removed";
        logToConsole(`> ${guess} DISCARDED FROM BUFFER`);
        
        // Find one active wrong word and remove it
        for (let i = 0; i < terminalData.length; i++) {
            let w = terminalData[i];
            if (w.status === "active" && w.text !== secret && WORD_BANK.includes(w.text)) {
                w.status = "removed";
                logToConsole(`> DUD REMOVED: ${w.text}`);
                break;
            }
        }
        renderTerminal();
        return;
    }

    // Win State
    if (guess === secret) {
        logToConsole("> ACCESS GRANTED. SYSTEM UNLOCKED.");
        wordListEl.innerHTML = "<h2 style='color: #1fff0f; grid-column: span 2;'>SYSTEM UNLOCKED</h2><div class='word' style='margin-top: 20px; grid-column: span 2;' onclick='initGame()'>[REBOOT TERMINAL]</div>";
        isGameOver = true;
        return;
    }

    // Incorrect Guess
    attempts--;
    item.status = "incorrect"; // Flags for red styling instead of dots
    
    let secretSet = new Set(secret.split(''));
    let guessSet = new Set(guess.split(''));
    let matched = [...secretSet].filter(char => guessSet.has(char));
    
    logToConsole(`> ENTRY DENIED. LIKENESS=${matched.length}`);
    
    updateAttemptsDisplay();
    renderTerminal();

    // Loss State
    if (attempts <= 0) {
        logToConsole(`> LOCKOUT INITIATED. PASSWORD WAS: ${secret}`);
        bodyEl.classList.add("locked"); // Triggers global red CSS
        wordListEl.innerHTML = `<h2 style='color: red; grid-column: span 2;'>SYSTEM LOCKED</h2><p style='grid-column: span 2;'>PASSWORD WAS: ${secret}</p><div class='word' style='margin-top: 20px; grid-column: span 2;' onclick='initGame()'>[REBOOT TERMINAL]</div>`;
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
    
    if (consoleOutputEl.children.length > 9) {
        consoleOutputEl.removeChild(consoleOutputEl.children[1]); // Keep the ">" arrow at top
    }
}

initGame();
