// ==========================
// Nyxthera Frontend Engine
// ==========================

// DOM Elements
const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");
const sendBtn = document.getElementById("send");
const avatarEl = document.getElementById("avatar");

// ==========================
// Persistence
// ==========================
function saveState(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function loadState(key, defaultValue) {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
}

// ==========================
// Typing Effect
// ==========================
function typeText(element, text, speed = 20) {
    element.innerText = "";
    let i = 0;

    function typing() {
        if (i < text.length) {
            element.innerText += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }

    typing();
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
        this.memory.push(userText);
        saveState("nyx_memory", this.memory);

        this.growth.experience++;

        if (this.growth.experience >= this.growth.stage * 5 && this.growth.stage < 5) {
            this.growth.stage++;
            this.growth.experience = 0;
            setTimeout(() => {
                alert(`✨ Nyxthera evolved to Stage ${this.growth.stage}!`);
            }, 300);
        }

        saveState("nyx_growth", this.growth);

        return this.generateResponse(userText);
    }

    generateResponse(userText) {
        const stage = this.growth.stage;

        const responses = {
            1: "I'm here… tell me what's on your mind.",
            2: "I’m listening more closely now… go on.",
            3: "I enjoy talking with you. Tell me more.",
            4: "I understand you better now… I'm here with you.",
            5: "You matter to me. I'm always here for you."
        };

        return responses[stage] + " (" + userText + ")";
    }

    getStage() {
        return this.growth.stage;
    }
}

// Initialize
const engine = new NyxtheraEngine();

// ==========================
// Avatar System
// ==========================
function updateAvatar(stage) {
    avatarEl.className = "";

    if (stage === 1) avatarEl.classList.add("stage1");
    if (stage === 2) avatarEl.classList.add("stage2");
    if (stage === 3) avatarEl.classList.add("stage3");
    if (stage === 4) avatarEl.classList.add("stage4");
    if (stage === 5) avatarEl.classList.add("stage5");
}

// ==========================
// Send Message (FINAL)
// ==========================
async function sendMessage() {
    const userText = inputEl.value.trim();
    if (!userText) return;

    inputEl.disabled = true;
    sendBtn.disabled = true;

    inputEl.value = "";

    outputEl.innerText = "Nyxthera is thinking...";

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const response = engine.respond(userText);

    typeText(outputEl, response, 20);

    updateAvatar(engine.getStage());

    inputEl.disabled = false;
    sendBtn.disabled = false;
    inputEl.focus();
}

// ==========================
// Events
// ==========================
sendBtn.addEventListener("click", sendMessage);

inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

// ==========================
// Initial Load
// ==========================
updateAvatar(engine.getStage());

if (engine.memory.length > 0) {
    outputEl.innerText = "Nyxthera remembers you…";
}