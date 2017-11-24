import {expect} from 'chai';
import inBetween from './in-between';
import rangeRandom from './range-random';
import rangeRandomInt from './range-random-int';

describe('function rangeRandomInt', () => {
    it('returns a value which is not greater or lower than given range values', () => {
        const value = rangeRandomInt(1, 3);

        expect(value).not.to.be.below(1);
        expect(value).not.to.be.above(3);
    });

    it('returns an integer', () => {
        const value = rangeRandomInt(1, 3);

        // crazy integer test - sometines JS lacks simplicity:)
        //https://www.inventpartners.com/javascript_is_int
        expect((parseFloat(value) == parseInt(value)) && !isNaN(value)).to.be.true;
    });
});

describe('function rangeRandom', () => {
    it('returns a value which is not greater or lower than given range values', () => {
        const value = rangeRandom(1, 3);

        expect(value).not.to.be.below(1);
        expect(value).not.to.be.above(3);
    });
});

describe('function inBetween', () => {
    it('returns given value when this is in range', () => {
        const value = inBetween(2, 1, 3);

        expect(value).to.equal(2);
    });

    it('returns max value given value is above', () => {
        const value = inBetween(5, 1, 3);

        expect(value).to.equal(3);
    });

    it('returns min value when given value is below', () => {
        const value = inBetween(5, 10, 30);

        expect(value).to.equal(10);
    });

    it('handles float numbers', () => {
        const float = 0.52134;
        const value = inBetween(float, 0.51, 0.53);

        expect(value).to.equal(float);
    });
});