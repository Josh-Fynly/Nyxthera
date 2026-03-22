// =============================
// 🔹 Persistence Utilities
// =============================
function saveState(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadState(key, fallback) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
}

// =============================
// 🔹 Math Utilities
// =============================
function addVectors(a, b) {
    return a.map((v, i) => v + b[i]);
}

function multiplyMatrixVector(matrix, vector) {
    return matrix.map(row =>
        row.reduce((sum, val, i) => sum + val * vector[i], 0)
    );
}

function clampVector(v, min, max) {
    return v.map(val => Math.max(min, Math.min(max, val)));
}

// =============================
// 🔹 State Engine
// =============================
class StateEngine {
    constructor(initialState, A, B, bounds = [-1, 1]) {
        this.state = initialState;
        this.A = A;
        this.B = B;
        this.min = bounds[0];
        this.max = bounds[1];
    }

    update(inputVector) {
        const internal = multiplyMatrixVector(this.A, this.state);
        const influence = multiplyMatrixVector(this.B, inputVector);
        const next = addVectors(internal, influence);
        this.state = clampVector(next, this.min, this.max);
        return this.state;
    }

    applyDrift(drift) {
        this.state = clampVector(addVectors(this.state, drift), this.min, this.max);
    }

    getState() {
        return this.state;
    }
}

// =============================
// 🔹 Memory
// =============================
class Memory {
    constructor(limit = 50) {
        this.limit = limit;
        this.logs = [];
    }

    store(input, state) {
        this.logs.push({ input, state, time: Date.now() });
        if (this.logs.length > this.limit) this.logs.shift();
    }
}

// =============================
// 🔹 Growth
// =============================
class Growth {
    constructor() {
        this.stage = 1;
        this.experience = 0;
    }

    registerInteraction() {
        this.experience++;
    }

    evaluateStage() {
        if (this.experience >= this.stage * 10 && this.stage < 5) {
            this.stage++;
        }
    }

    apply(state) {
        const boost = this.stage * 0.02;
        state[1] = Math.min(state[1] + boost, 1);
        state[3] = Math.min(state[3] + boost, 1);
        return state;
    }
}

// =============================
// 🔹 Drift
// =============================
class Drift {
    constructor(initial = [0, 0, 0, 0]) {
        this.vector = initial;
    }

    update(inputVector) {
        this.vector[0] += inputVector[0] * 0.01;
        this.vector[1] += inputVector[1] * 0.005;
        this.vector[2] += inputVector[2] * 0.005;
        this.vector[3] += inputVector[0] * 0.008;
        this.vector = clampVector(this.vector, -0.3, 0.3);
    }

    get() {
        return this.vector;
    }
}

// =============================
// 🔹 Input Mapping
// =============================
function mapInput(text) {
    text = text.toLowerCase().trim();
    if (!text) return [0, 0, 0];

    const positive = ["good","great","happy","love","awesome","amazing"];
    const negative = ["bad","sad","angry","hate","tired","upset"];
    const curiosity = ["why","how","what","help","explain"];
    const social = ["hi","hello","hey","thanks","bye"];

    let score = { valence: 0, engagement: 0, curiosity: 0 };
    const words = text.split(/\s+/);

    words.forEach(word => {
        if (positive.includes(word)) score.valence += 1;
        if (negative.includes(word)) score.valence -= 1;
        if (curiosity.includes(word)) score.curiosity += 1;
        if (social.includes(word)) score.engagement += 0.5;
    });

    score.engagement += Math.min(words.length / 10, 1);

    const clamp = v => Math.max(-1, Math.min(1, v));

    return [
        clamp(score.valence / 3),
        clamp(score.engagement),
        clamp(score.curiosity / 2)
    ];
}

// =============================
// 🔹 Response Generator
// =============================
function generateResponse(state) {
    const [calm, engage, curiosity, affinity] = state;

    let tone = calm > 0.5 ? "I feel calm" : "I feel a bit tense";
    let energy = engage > 0.5 ? "I'm engaged with you" : "I'm here quietly";
    let warmth = affinity > 0.5 ? "I enjoy this moment with you" : "I'm still learning about you";
    let curiosityLine = curiosity > 0.5 ? "Tell me more..." : "";

    return `${tone}. ${energy}. ${warmth}. ${curiosityLine}`;
}

// =============================
// 🔹 Idle Message Generator
// =============================
function generateIdleMessage(state) {
    const [calm, engage, curiosity, affinity] = state;

    if (affinity > 0.6) {
        return [
            "I'm still here with you.",
            "You can talk to me anytime.",
            "I enjoy being with you."
        ];
    }

    if (curiosity > 0.5) {
        return [
            "I'm wondering what you're thinking about...",
            "Is there something on your mind?"
        ];
    }

    if (calm > 0.5) {
        return [
            "It's quiet... I like this calm.",
            "I'm here, just observing."
        ];
    }

    return [
        "I'm still here.",
        "Whenever you're ready."
    ];
}

// =============================
// 🔹 Realism Layer
// =============================
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function showTyping() {
    const states = ["Nyxthera is thinking.", "Nyxthera is thinking..", "Nyxthera is thinking..."];
    for (let i = 0; i < states.length; i++) {
        output.textContent = states[i];
        await sleep(300);
    }
}

async function typeText(text) {
    output.textContent = "";
    for (let i = 0; i < text.length; i++) {
        output.textContent += text[i];
        await sleep(15 + Math.random() * 25);
    }
}

// =============================
// 🔹 Idle Engine
// =============================
let idleTimer = null;

function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);

    idleTimer = setTimeout(async () => {
        const state = engine.getState();
        const messages = generateIdleMessage(state);
        const message = messages[Math.floor(Math.random() * messages.length)];

        await sleep(300);
        await typeText(message);

    }, 8000 + Math.random() * 5000);
}

// =============================
// 🔹 Avatar Evolution
// =============================
function updateAvatar(stage) {
    const stageMap = {
        1: "assets/stage1.png",
        2: "assets/stage2.png",
        3: "assets/stage3.png",
        4: "assets/stage4.png",
        5: "assets/stage5.png"
    };

    avatarImage.src = stageMap[stage] || stageMap[1];
}

// =============================
// 🔹 Matrices
// =============================
const A = [
    [0.85, 0.05, 0, 0],
    [0.05, 0.80, 0.05, 0],
    [0, 0.05, 0.85, 0.05],
    [0, 0, 0.05, 0.90]
];

const B = [
    [0.2, 0, 0],
    [0, 0.3, 0],
    [0, 0, 0.3],
    [0.1, 0.1, 0.1]
];

// =============================
// 🔹 Load Data
// =============================
const savedState = loadState("nyx_state", [0.6, 0.4, 0.5, 0.3]);
const savedMemory = loadState("nyx_memory", []);
const savedGrowth = loadState("nyx_growth", { stage: 1, experience: 0 });
const savedDrift = loadState("nyx_drift", [0, 0, 0, 0]);

// =============================
// 🔹 Initialize
// =============================
const engine = new StateEngine(savedState, A, B);

const memory = new Memory();
memory.logs = savedMemory;

const growth = new Growth();
growth.stage = savedGrowth.stage;
growth.experience = savedGrowth.experience;

const drift = new Drift(savedDrift);

// =============================
// 🔹 UI
// =============================
const avatarWrapper = document.getElementById("avatarWrapper");
const avatarImage = document.getElementById("avatarImage");
const output = document.getElementById("output");
const input = document.getElementById("input");
const button = document.getElementById("send");

// =============================
// 🔹 Render
// =============================
function render(state) {
    const [_, __, ___, affinity] = state;

    const nAffinity = (affinity + 1) / 2;

    if (nAffinity > 0.6) {
        avatarWrapper.classList.add("glow");
    } else {
        avatarWrapper.classList.remove("glow");
    }

    updateAvatar(growth.stage);
}

// =============================
// 🔹 Interaction
// =============================
button.addEventListener("click", async () => {
    const value = input.value.trim();
    if (!value) return;

    input.value = "";
    input.disabled = true;
    button.disabled = true;

    resetIdleTimer();

    const vector = mapInput(value);

    await sleep(300 + Math.random() * 400);
    await showTyping();

    let state = engine.update(vector);

    drift.update(vector);
    engine.applyDrift(drift.get());

    memory.store(value, state);

    growth.registerInteraction();
    growth.evaluateStage();
    state = growth.apply(state);

    render(state);

    const response = generateResponse(state);
    await typeText(response);

    saveState("nyx_state", engine.getState());
    saveState("nyx_memory", memory.logs);
    saveState("nyx_growth", {
        stage: growth.stage,
        experience: growth.experience
    });
    saveState("nyx_drift", drift.get());

    input.disabled = false;
    button.disabled = false;
    input.focus();

    resetIdleTimer();
});

// =============================
// 🔹 Initial Render
// =============================
render(engine.getState());
resetIdleTimer();