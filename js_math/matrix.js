// math/matrix.js

export function createMatrix(rows, cols, fill = 0) {
    return Array.from({ length: rows }, () =>
        Array(cols).fill(fill)
    );
}

export function multiplyMatrixVector(matrix, vector) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    if (vector.length !== cols) {
        throw new Error("Matrix and vector dimension mismatch.");
    }

    const result = [];

    for (let i = 0; i < rows; i++) {
        let sum = 0;
        for (let j = 0; j < cols; j++) {
            sum += matrix[i][j] * vector[j];
        }
        result.push(sum);
    }

    return result;
}
