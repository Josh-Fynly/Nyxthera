// ==========================
// DOM
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

function loadState(key, fallback) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
}

// ==========================
// Typing
// ==========================
function typeText(el, text, speed = 20) {
    el.innerText = "";
    let i = 0;

    function type() {
        if (i < text.length) {
            el.innerText += text[i++];
            setTimeout(type, speed);
        }
    }

    type();
}

// ==========================
// Local Fallback Engine
// ==========================
function fallbackResponse(input) {
    return "I'm here with you… tell me more.";
}

// ==========================
// AI CALL
// ==========================
async function getAIResponse(input) {
    try {
        const res = await fetch("http://127.0.0.1:8000/ai/respond", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input })
        });

        const data = await res.json();

        if (data.response) return data.response;

        return null;
    } catch {
        return null;
    }
}

// ==========================
// Avatar
// ==========================
function updateAvatar() {
    avatarEl.classList.add("stage5");
}

// ==========================
// MAIN FLOW
// ==========================
async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = "";
    inputEl.disabled = true;
    sendBtn.disabled = true;

    outputEl.innerText = "Nyxthera is thinking...";

    await new Promise(r => setTimeout(r, 500));

    let response = await getAIResponse(text);

    // Fallback if AI fails
    if (!response) {
        response = fallbackResponse(text);
    }

    typeText(outputEl, response, 20);

    updateAvatar();

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