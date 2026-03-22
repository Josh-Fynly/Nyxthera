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

    getState() {
        return this.state;
    }
}

// =============================
// 🔹 Memory System
// =============================
class Memory {
    constructor(limit = 50) {
        this.limit = limit;
        this.logs = [];
    }

    store(input, state) {
        this.logs.push({
            input,
            state,
            time: Date.now()
        });

        if (this.logs.length > this.limit) {
            this.logs.shift();
        }
    }
}

// =============================
// 🔹 Growth System
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
        if (this.experience >= this.stage * 10) {
            this.stage++;
        }
    }

    apply(state) {
        const boost = this.stage * 0.02;

        state[1] = Math.min(state[1] + boost, 1); // engagement
        state[3] = Math.min(state[3] + boost, 1); // affinity

        return state;
    }
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
// 🔹 Load Persisted Data
// =============================
const savedState = loadState("nyx_state", [0.6, 0.4, 0.5, 0.3]);
const savedMemory = loadState("nyx_memory", []);
const savedGrowth = loadState("nyx_growth", { stage: 1, experience: 0 });

// =============================
// 🔹 Initialize Systems
// =============================
const engine = new StateEngine(savedState, A, B);

const memory = new Memory();
memory.logs = savedMemory;

const growth = new Growth();
growth.stage = savedGrowth.stage;
growth.experience = savedGrowth.experience;

// =============================
// 🔹 UI Elements
// =============================
const avatar = document.getElementById("avatar");
const output = document.getElementById("output");
const input = document.getElementById("input");
const button = document.getElementById("send");

// =============================
// 🔹 Render Function
// =============================
function normalize(v) {
    return (v + 1) / 2;
}

function render(state) {
    const [calm, engage, curiosity, affinity] = state;

    avatar.style.opacity = normalize(calm);
    avatar.style.transform = `scale(${0.8 + normalize(engage) * 0.4})`;
    avatar.style.background = `hsl(${200 + normalize(curiosity) * 60}, 70%, 60%)`;

    output.textContent =
        `Calm:${calm.toFixed(2)} | Engage:${engage.toFixed(2)} | ` +
        `Curiosity:${curiosity.toFixed(2)} | Affinity:${affinity.toFixed(2)} | ` +
        `Stage:${growth.stage}`;
}

// =============================
// 🔹 Input Mapping
// =============================
function mapInput(text) {
    text = text.toLowerCase();

    if (!text) return [0, 0, 0];
    if (text.includes("good")) return [1, 0, 0];
    if (text.includes("neutral")) return [0, 1, 0];
    return [0, 0, 1];
}

// =============================
// 🔹 Event Handler
// =============================
button.addEventListener("click", () => {
    const value = input.value.trim();
    input.value = "";

    const vector = mapInput(value);

    let state = engine.update(vector);

    memory.store(value, state);

    growth.registerInteraction();
    growth.evaluateStage();
    state = growth.apply(state);

    render(state);

    // 🔥 PERSIST EVERYTHING
    saveState("nyx_state", engine.getState());
    saveState("nyx_memory", memory.logs);
    saveState("nyx_growth", {
        stage: growth.stage,
        experience: growth.experience
    });
});

// =============================
// 🔹 Initial Render
// =============================
render(engine.getState());