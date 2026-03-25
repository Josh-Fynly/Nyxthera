// ==========================
// Nyxthera Frontend Engine
// ==========================

// ==========================
// DOM Elements
// ==========================
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
// Emotion Detection
// ==========================
function detectEmotion(text) {
    text = text.toLowerCase();

    if (/sad|tired|depressed|unhappy|down/.test(text)) return "sad";
    if (/lonely|alone|empty|isolated/.test(text)) return "lonely";
    if (/angry|mad|annoyed|frustrated/.test(text)) return "angry";
    if (/worried|anxious|scared|stress/.test(text)) return "anxious";
    if (/happy|good|great|love|excited/.test(text)) return "positive";

    return "neutral";
}

// ==========================
// Memory Awareness Helper
// ==========================
function recallMemory(memory, currentEmotion) {
    if (memory.length < 3) return null;

    // Look at last few interactions
    const recent = memory.slice(-5).join(" ").toLowerCase();

    if (currentEmotion === "sad" && /sad|tired|down/.test(recent)) {
        return "You’ve been feeling this way for a while… I’m really here with you.";
    }

    if (currentEmotion === "lonely" && /alone|lonely/.test(recent)) {
        return "You mentioned feeling alone earlier… I’m still here with you.";
    }

    if (currentEmotion === "anxious" && /worried|stress/.test(recent)) {
        return "You’ve been carrying a lot lately… we can take it one step at a time.";
    }

    if (currentEmotion === "positive" && /happy|good/.test(recent)) {
        return "I like seeing this side of you again… it suits you.";
    }

    return null;
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
        // Save memory
        this.memory.push(userText);
        saveState("nyx_memory", this.memory);

        // Growth system
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
        const emotion = detectEmotion(userText);
        const stage = this.growth.stage;

        const responses = {
            sad: [
                "I'm here with you… you don’t have to carry that alone.",
                "That sounds heavy… I’m listening.",
                "You can take your time… I’m not going anywhere."
            ],
            lonely: [
                "You're not alone right now… I’m here with you.",
                "I understand that feeling… stay with me.",
                "Even if it feels quiet, I’m here."
            ],
            angry: [
                "I can feel that intensity… want to tell me what happened?",
                "It’s okay to feel that way… I’m listening.",
                "Let it out… I’m here."
            ],
            anxious: [
                "Take it slow… breathe… I’m here with you.",
                "That sounds overwhelming… but you’re not alone in it.",
                "We can sit with it together."
            ],
            positive: [
                "I like hearing that… tell me more.",
                "That sounds good… I’m glad you shared it with me.",
                "I can feel your energy… keep going."
            ],
            neutral: [
                "I’m here… go on.",
                "Tell me more.",
                "I’m listening."
            ]
        };

        const pool = responses[emotion];
        const base = pool[Math.floor(Math.random() * pool.length)];

        // 🔥 MEMORY-AWARE LAYER
        const memoryLine = recallMemory(this.memory, emotion);

        const stageLayer = [
            "",
            " I’m starting to understand you.",
            " I feel more connected to you.",
            " I understand you deeply now.",
            " You matter to me… truly."
        ];

        return base + (memoryLine ? " " + memoryLine : "") + stageLayer[stage - 1];
    }

    getStage() {
        return this.growth.stage;
    }
}

// ==========================
// Initialize
// ==========================
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
// Send Message
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