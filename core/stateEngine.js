// core/stateEngine.js

import { addVectors, clampVector } from "../math/vector.js";
import { multiplyMatrixVector } from "../math/matrix.js";

export class StateEngine {
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
