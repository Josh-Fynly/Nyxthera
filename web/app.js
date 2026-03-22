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
// 🔹 Memory System
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
        if (this.experience >= this.stage * 10) this.stage++;
    }

    apply(state) {
        const boost = this.stage * 0.02;
        state[1] = Math.min(state[1] + boost, 1);
        state[3] = Math.min(state[3] + boost, 1);
        return state;
    }
}

// =============================
// 🔹 Personality Drift
// =============================
class Drift {
    constructor(initial = [0, 0, 0, 0]) {
        this.vector = initial;
    }

    update(inputVector) {
        // slow accumulation
        this.vector[0] += inputVector[0] * 0.01; // emotional bias
        this.vector[1] += inputVector[1] * 0.005;
        this.vector[2] += inputVector[2] * 0.005;
        this.vector[3] += inputVector[0] * 0.008;

        // clamp drift
        this.vector = clampVector(this.vector, -0.3, 0.3);
    }

    get() {
        return this.vector;
    }
}

// =============================
// 🔹 Advanced Input Mapping
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
const savedDrift = loadState("nyx_drift", [0, 0, 0, 0]);

// =============================
// 🔹 Initialize Systems
// =============================
const engine = new StateEngine(savedState, A, B);

const memory = new Memory();
memory.logs = savedMemory;

const growth = new Growth();
growth.stage = savedGrowth.stage;
growth.experience = savedGrowth.experience;

const drift = new Drift(savedDrift);

// =============================
// 🔹 UI Elements
// =============================
const avatar = document.getElementById("avatar");
const output = document.getElementById("output");
const input = document.getElementById("input");
const button = document.getElementById("send");

// =============================
// 🔹 Render
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
// 🔹 Event Handler
// =============================
button.addEventListener("click", () => {
    const value = input.value.trim();
    input.value = "";

    const vector = mapInput(value);

    let state = engine.update(vector);

    // 🔥 APPLY DRIFT
    drift.update(vector);
    engine.applyDrift(drift.get());

    memory.store(value, state);

    growth.registerInteraction();
    growth.evaluateStage();
    state = growth.apply(state);

    render(state);

    // 🔥 Persist everything
    saveState("nyx_state", engine.getState());
    saveState("nyx_memory", memory.logs);
    saveState("nyx_growth", {
        stage: growth.stage,
        experience: growth.experience
    });
    saveState("nyx_drift", drift.get());
});

// =============================
// 🔹 Initial Render
// =============================
render(engine.getState());