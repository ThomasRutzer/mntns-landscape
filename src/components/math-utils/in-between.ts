/**
 * Checks if given value is not below or higher range values
 * If one of this conditions are the case, though, next matching will be returned,
 * other value passes
 *
 * @param {number} value
 * @param {number} min
 * @return {number} max
 */
export default function inBetween(value: number, min: number, max: number): number {
    if (value >= min && value <= max) {
        return value;
    }

    if (value < min) {
        return min;
    }

    if (value > max) {
        return max;
    }
}
