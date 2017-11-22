import {expect} from 'chai';
import LightFactory from './LightFactory';

describe('LightFactory', () => {
    describe('static method create()', () => {
        it('creates requested light object type', () => {
            let light = LightFactory.create('global', '#fff', '#fff', 1);

            expect(light.constructor.name).to.equal('GlobalLight');
        })
    });
});
