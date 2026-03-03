// =============================
// 1️⃣ Math Utilities
// =============================
function addVectors(a, b) {
    if (a.length !== b.length) throw new Error("Vector size mismatch.");
    return a.map((v, i) => v + b[i]);
}

function multiplyMatrixVector(matrix, vector) {
    if (matrix[0].length !== vector.length)
        throw new Error("Matrix/vector dimension mismatch.");
    return matrix.map(row =>
        row.reduce((sum, val, i) => sum + val * vector[i], 0)
    );
}

function clampVector(v, min, max) {
    return v.map(val => Math.max(min, Math.min(max, val)));
}

// =============================
// 2️⃣ Deterministic State Engine
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

    getState() {
        return this.state;
    }
}

// =============================
// 3️⃣ Memory System
// =============================
class Memory {
    constructor(limit = 50) {
        this.limit = limit;
        this.logs = [];
    }

    store(userInput, vector) {
        const entry = {input: userInput, timestamp: Date.now(), vector};
        this.logs.push(entry);
        if (this.logs.length > this.limit) this.logs.shift();
    }

    getRecent(n = 5) {
        return this.logs.slice(-n);
    }
}

// =============================
// 4️⃣ Growth Engine
// =============================
class Growth {
    constructor() {
        this.stage = 1;
        this.experience = 0;
    }

    registerInteraction() {
        this.experience += 1;
    }

    evaluateStage(state) {
        if (this.experience >= this.stage * 10) this.stage += 1;
    }

    applyGrowthEffects(state) {
        const factor = this.stage * 0.02;
        state[1] = Math.min(state[1] + factor, 1); // engagement
        state[3] = Math.min(state[3] + factor, 1); // affinity
        return state;
    }
}

// =============================
// 5️⃣ Initialize
// =============================
const initialState = [0.6, 0.4, 0.5, 0.3];
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

const engine = new StateEngine(initialState, A, B);
const memory = new Memory();
const growth = new Growth();

// =============================
// 6️⃣ Rendering
// =============================
const avatar = document.getElementById("avatar");
const output = document.getElementById("output");

function normalize(value) {
    return (value + 1) / 2;
}

function render(state) {
    const [calm, engage, curiosity, affinity] = state;

    const opacity = normalize(calm);
    const scale = 0.8 + normalize(engage) * 0.4;
    const hueShift = normalize(curiosity) * 60;

    avatar.style.opacity = opacity;
    avatar.style.transform = `scale(${scale})`;
    avatar.style.background = `hsl(${200 + hueShift}, 70%, 60%)`;

    output.textContent = `Calm:${calm.toFixed(2)} Engage:${engage.toFixed(2)} Curiosity:${curiosity.toFixed(2)} Affinity:${affinity.toFixed(2)} | Growth Stage:${growth.stage}`;
}

// =============================
// 7️⃣ Python AI Enhancement
// =============================
async function callAISuggestion(userInput) {
    try {
        const resp = await fetch("http://127.0.0.1:8000/ai/suggest", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({input: userInput})
        });
        const data = await resp.json();
        return data.vector || [0,0,0,0];
    } catch(e) {
        console.warn("AI service unavailable, continuing deterministically.");
        return [0,0,0,0];
    }
}

// Optional logging
async function logInteraction(userInput, vector) {
    try {
        await fetch("http://127.0.0.1:8000/memory/update", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({input: userInput, vector})
        });
    } catch(e) {
        console.warn("Memory API unavailable, skipping log.");
    }
}

// =============================
// 8️⃣ Input Handler
// =============================
document.getElementById("send").addEventListener("click", async () => {
    const inputValue = document.getElementById("input").value.trim();
    document.getElementById("input").value = "";

    // Deterministic vector mapping
    let vector;
    if (!inputValue) vector = [0,0,0];
    else if (inputValue.toLowerCase().includes("good")) vector = [1,0,0];
    else if (inputValue.toLowerCase().includes("neutral")) vector = [0,1,0];
    else vector = [0,0,1];

    // Update deterministic state
    let newState = engine.update(vector);

    // Optional AI perturbation
    const aiVector = await callAISuggestion(inputValue);
    newState = engine.update(aiVector.map(v => v*0.5));

    // Register memory & growth
    memory.store(inputValue, newState);
    growth.registerInteraction();
    growth.evaluateStage(newState);
    newState = growth.applyGrowthEffects(newState);

    // Render
    render(newState);

    // Optional log
    logInteraction(inputValue, newState);
});

// =============================
// 9️⃣ Initial Render
// =============================
render(engine.getState());