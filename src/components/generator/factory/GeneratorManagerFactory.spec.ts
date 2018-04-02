import {expect} from 'chai';
import GeneratorManagerFactory from './GeneratorManagerFactory';

describe('GeneratorManagerFactory', () => {
    let data = [
            {id: "1", thickness: 50, height: 100},
            {id: "2", thickness: 30, height: 50},
            {id: "3", thickness: 50, height: 30}
        ];

    it('returns an instance of a GeneratorManager', () => {
        const manager = GeneratorManagerFactory.create('any', data);
        expect(manager.constructor.name).to.equal('GeneratorManager');
    });
});