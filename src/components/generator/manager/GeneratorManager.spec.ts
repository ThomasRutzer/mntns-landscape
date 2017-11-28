import {expect, should} from 'chai';
import {spy, assert} from 'sinon';
import GeneratorManager from './GeneratorManager';
import Scene from '../../scene/manager/SceneManager'

describe('GeneratorManager', () => {
    let manager;

    beforeEach(() => {
        let data = [{thickness: 50, height: 100}, {thickness: 30, height: 50}, {thickness: 50, height: 30}],
            scene = new Scene(100, 100,
                {type: 'perspective', fieldOfView: 60, nearPlane: 0.1, farPlane: 3000, position: {x: 0, y: 0, z: 150}},
                'webGL',
                true);


        manager = new GeneratorManager(scene, data);
    });

    describe('constructor()', () => {
        it('holds one mountain for each object in passed data', () => {
            expect((<any>manager.mountains.length)).to.equal(3);
        });
    });

    describe('method clearAllMountains()', () => {
        it('clears all added mountains from Generator', (done) => {
            manager.clearAllMountains().then(() => {
                ((<any>manager.mountains.length)).should.equal(0);
                done();
            });
        });
    });

    describe('method clearMountain()', () => {
        it('clears requested mountain from Generator', (done) => {
            const id = `mountain-1`;
            manager.clearMountain(id).then(() => {
                ((<any>manager.mountains.length)).should.equal(2);
                done();
            });
        });
    });
});