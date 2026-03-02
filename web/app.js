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
// 3️⃣ Initialize Engine
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

// =============================
// 4️⃣ Rendering Binder
// =============================
const avatar = document.getElementById("avatar");
const output = document.getElementById("output");

function normalize(value) {
    return (value + 1) / 2;
}

function render(state) {
    const [calm, engage, curiosity, affinity] = state;

    // Visuals
    const opacity = normalize(calm);
    const scale = 0.8 + normalize(engage) * 0.4;
    const hueShift = normalize(curiosity) * 60;

    avatar.style.opacity = opacity;
    avatar.style.transform = `scale(${scale})`;
    avatar.style.background = `hsl(${200 + hueShift}, 70%, 60%)`;

    // Textual feedback
    output.textContent = `Calm:${calm.toFixed(2)} Engage:${engage.toFixed(2)} Curiosity:${curiosity.toFixed(2)} Affinity:${affinity.toFixed(2)}`;
}

// =============================
// 5️⃣ User Input Hook
// =============================
document.getElementById("send").addEventListener("click", () => {
    const inputValue = document.getElementById("input").value.trim();

    // Simple input to vector mapping (placeholder)
    let vector;
    if (!inputValue) vector = [0,0,0];
    else if (inputValue.toLowerCase().includes("good")) vector = [1,0,0];
    else if (inputValue.toLowerCase().includes("neutral")) vector = [0,1,0];
    else vector = [0,0,1];

    const newState = engine.update(vector);
    render(newState);

    document.getElementById("input").value = "";
});

// Initial render
render(engine.getState());