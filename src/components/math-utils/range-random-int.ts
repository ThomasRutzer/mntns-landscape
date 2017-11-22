/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
export default function rangeRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
