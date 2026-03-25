// app.js
// Nyxthera: AI-Enhanced Virtual Companion (Frontend Layer)

// ==========================
// DOM Elements
// ==========================
const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");
const sendBtn = document.getElementById("send");
const avatarEl = document.getElementById("avatar");

// ==========================
// Persistence Helpers
// ==========================
function saveState(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function loadState(key, defaultValue) {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
}

// ==========================
// Nyxthera Engine
// ==========================
class NyxtheraEngine {
    constructor() {
        this.memory = loadState("nyx_memory", []);
        this.growth = loadState("nyx_growth", { stage: 1, experience: 0 });
    }

    respond(userText) {
        // Store memory
        this.memory.push(userText);
        saveState("nyx_memory", this.memory);

        // Simulate growth points per interaction
        this.growth.experience += 1;

        // Upgrade stage every 5 points
        if (this.growth.experience >= this.growth.stage * 5 && this.growth.stage < 5) {
            this.growth.stage += 1;
            this.growth.experience = 0;
            alert(`Nyxthera evolved to Stage ${this.growth.stage}!`);
        }

        saveState("nyx_growth", this.growth);

        return `Nyxthera (Stage ${this.growth.stage}) heard: ${userText}`;
    }

    getStage() {
        return this.growth.stage;
    }
}

// Initialize engine
const engine = new NyxtheraEngine();

// ==========================
// Visual Layer (Avatar)
// ==========================
function updateAvatar(stage) {
    // Clear previous classes
    avatarEl.className = "";
    
    switch(stage) {
        case 1:
            avatarEl.classList.add("stage1"); // glowing orb
            break;
        case 2:
            avatarEl.classList.add("stage2"); // subtle eyes
            break;
        case 3:
            avatarEl.classList.add("stage3"); // animated patterns
            break;
        case 4:
            avatarEl.classList.add("stage4"); // reflective aura
            break;
        case 5:
            avatarEl.classList.add("stage5"); // fully dynamic companion
            break;
        default:
            avatarEl.classList.add("stage1");
    }
}

// Initialize avatar on load
updateAvatar(engine.getStage());

// ==========================
// Event Handlers
// ==========================
function sendMessage() {
    const userText = inputEl.value.trim();
    if (!userText) return;

    const response = engine.respond(userText);

    // Render response
    outputEl.innerText = response;

    // Clear input
    inputEl.value = "";

    // Update avatar visually based on stage
    updateAvatar(engine.getStage());
}

// Button click
sendBtn.addEventListener("click", sendMessage);

// Enter key
inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Load memory preview
if (engine.memory.length > 0) {
    outputEl.innerText = `Nyxthera remembers: ${engine.memory.join(", ")}`;
}