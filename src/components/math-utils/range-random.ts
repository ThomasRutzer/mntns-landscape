/**
 * Get a random floating point number between `min` and `max`.
 *
 * @param {number} v1
 * @param {number} v2
 * @return {number} a random floating point number
 */
export default function rangeRandom(v1, v2) {
    const max = Math.max( v1, v2 );
    const min = ( max === v1 ) ? v2 : v1;
    return min + Math.random() * ( max - min );
}
