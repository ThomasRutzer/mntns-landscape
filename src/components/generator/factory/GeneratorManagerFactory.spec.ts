import {expect} from 'chai';
import GeneratorManagerFactory from './GeneratorManagerFactory';

describe('GeneratorManagerFactory', () => {
    let data = [
            {id: "1", thickness: 50, height: 100},
            {id: "2", thickness: 30, height: 50},
            {id: "3", thickness: 50, height: 30}
        ];

    it('returns an instance of a GeneratorManager', () => {
        const manager = GeneratorManagerFactory.create('generator-manager-1', data);
        expect(manager.constructor.name).to.equal('GeneratorManager');
    });

    it('caches instances by id', () => {
        const manager = GeneratorManagerFactory.create(
            `generator-manager-2`,
            data,
        );

        const manager1 = GeneratorManagerFactory.getById('generator-manager-2');

        expect(manager1).to.exist;
    });

    it('returns null, when no matching instance is found by id', () => {
        const manager = GeneratorManagerFactory.create(
            `generator-manager-3`,
            data,
        );

        const manager1 = GeneratorManagerFactory.getById('generator-manager-3');

        expect(manager1).to.equal(undefined);
    });
});