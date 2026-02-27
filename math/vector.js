// math/vector.js

export function createVector(size, fill = 0) {
    return Array(size).fill(fill);
}

export function addVectors(a, b) {
    if (a.length !== b.length) {
        throw new Error("Vector dimension mismatch.");
    }
    return a.map((val, i) => val + b[i]);
}

export function scaleVector(v, scalar) {
    return v.map(val => val * scalar);
}

export function clampVector(v, min, max) {
    return v.map(val => Math.max(min, Math.min(max, val)));
}

export function dotProduct(a, b) {
    if (a.length !== b.length) {
        throw new Error("Vector dimension mismatch.");
    }
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
}
