console.log("App loaded");

// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

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
    }

    // =============================
    // 🔹 Input Mapping
    // =============================
    function mapInput(text) {
        text = text.toLowerCase().trim();
        if (!text) return [0, 0, 0];

        const positive = ["good","great","happy","love"];
        const negative = ["bad","sad","angry","hate"];
        const curiosity = ["why","how","what","help"];

        let score = { valence: 0, engagement: 0, curiosity: 0 };

        text.split(/\s+/).forEach(word => {
            if (positive.includes(word)) score.valence++;
            if (negative.includes(word)) score.valence--;
            if (curiosity.includes(word)) score.curiosity++;
        });

        score.engagement = Math.min(text.length / 20, 1);

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
    // 🔹 Realism
    // =============================
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function showTyping(output) {
        const states = ["Nyxthera is thinking.", "Nyxthera is thinking..", "Nyxthera is thinking..."];
        for (let s of states) {
            output.textContent = s;
            await sleep(300);
        }
    }

    async function typeText(output, text) {
        output.textContent = "";
        for (let c of text) {
            output.textContent += c;
            await sleep(20);
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
    // 🔹 Init
    // =============================
    const engine = new StateEngine(loadState("nyx_state", [0.6, 0.4, 0.5, 0.3]), A, B);
    const growth = new Growth();

    const avatarWrapper = document.getElementById("avatarWrapper");
    const output = document.getElementById("output");
    const input = document.getElementById("input");
    const button = document.getElementById("send");

    // =============================
    // 🔹 Render
    // =============================
    function render(state) {
        const [calm, engage, curiosity, affinity] = state;
        const stage = growth.stage;

        const n = (v) => (v + 1) / 2;

        const size = 120 + stage * 15;
        avatarWrapper.style.width = size + "px";
        avatarWrapper.style.height = size + "px";

        avatarWrapper.style.background = `radial-gradient(circle,
            hsl(${200 + n(curiosity) * 120}, 70%, 60%),
            hsl(220, 60%, 20%))`;

        avatarWrapper.style.boxShadow =
            `0 0 ${10 + stage * 10}px rgba(0,150,255,${0.3 + n(affinity) * 0.5})`;

        avatarWrapper.style.borderRadius = "50%";
    }

    // =============================
    // 🔹 Interaction (FIXED)
    // =============================
    button.addEventListener("click", async () => {
        console.log("Button clicked");

        const value = input.value.trim();
        if (!value) return;

        input.value = "";

        await showTyping(output);

        let state = engine.update(mapInput(value));

        growth.registerInteraction();
        growth.evaluateStage();

        render(state);

        await typeText(output, generateResponse(state));

        saveState("nyx_state", engine.getState());
    });

    // =============================
    // 🔹 Start
    // =============================
    render(engine.getState());

});