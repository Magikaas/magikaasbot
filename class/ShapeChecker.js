class ShapeChecker {
    constructor(fullShapeData) {}

    determineShape(data) {

    }

    /**
     * 
     * @param {array} data 
     * 
     * Determine the direction the line is going, straight, diagonal, etc
     */
    determineHeading(data) {

    }

    /**
     * 
     * @param {array} data 
     * 
     * Determine largest difference
     */
    determineLargestDelta(data) {
        const sorted = clone(data);
        sorted.sort();
        return (sorted[sorted.length-1] - sorted[0]);
    }

    determineAverageDifference(data) {
        const sorted = clone(data);
        sorted.sort();
        const cleaned = [sorted.pop()];

        let prev = -1;
        for (let i of data) {
            if (prev > 0 && i != prev) {
                cleaned.push(i);
            }
            prev = i;
        }

        return cleaned.reduce((partialSum, a) => partialSum + a, 0);
    }
}

module.exports = ShapeChecker;