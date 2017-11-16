
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function rangeRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Get a random floating point number between `min` and `max`.
 *
 * @param {number} v1
 * @param {number} v2
 * @return {number} a random floating point number
 */
function rangeRandom(v1, v2) {
    var max = Math.max(v1,v2);
    var min = (max==v1)?v2 : v1;
    return min + Math.random()*(max-min);
}

export {
    rangeRandomInt,
    rangeRandom
}
