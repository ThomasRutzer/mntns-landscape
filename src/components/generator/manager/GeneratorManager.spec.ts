import {expect, should} from 'chai';
import {stub} from 'sinon';
import GeneratorManager from './GeneratorManager';
import config from './GeneratorManagerConfig';
import Scene from '../../scene/manager/SceneManager';

describe('GeneratorManager', () => {
    let manager, prototype: any = GeneratorManager.prototype;

    // stub async call
    stub(prototype, 'getTexture').callsFake(() => {
        return Promise.resolve();
    });

    beforeEach(() => {
        let data = [{thickness: 50, height: 100}, {thickness: 30, height: 50}, {thickness: 50, height: 30}],
            scene = new Scene(
                {type: 'perspective', fieldOfView: 60, nearPlane: 0.1, farPlane: 3000, position: {x: 0, y: 0, z: 150}},
                'webGL',
                true);


        manager = new GeneratorManager(scene, data);
    });

    describe('constructor()', () => {
        it('holds floor after construction', () => {
            let counter = 0;

            <any>manager.scene.sceneElements.filter((element) => {
                if(element.id === 'floor') {
                    counter++;
                }
            });

            expect(counter).to.equal(1);
        });

        it('holds globalLight after construction', () => {
            let counter = 0;

            <any>manager.scene.sceneElements.filter((element) => {
                if(element.id === 'globalLight') {
                    counter++;
                }
            });

            expect(counter).to.equal(1);
        });

        it('holds shadowLight after construction', () => {
            let counter = 0;

            <any>manager.scene.sceneElements.filter((element) => {
                if(element.id === 'shadowLight') {
                    counter++;
                }
            });

            expect(counter).to.equal(1);
        });
    });

    describe('method clearMountain()', () => {
        it('clears requested mountain from Generator', () => {
            const id = `mountain-1`;

            <any>manager.mountains.forEach((mnt) => {
                stub(mnt.mountain, "shrink").callsFake(() => {
                    return Promise.resolve();
                });
            });

            return manager.clearMountain(id).then(() => {
                ((<any>manager.mountains.length)).should.equal(2);
            });
        });
    });

    describe('method clearAllMountains()', () => {
        it('clears all mountain from Generator', () => {
            <any>manager.mountains.forEach((mnt) => {
                stub(mnt.mountain, "shrink").callsFake(() => {
                    return Promise.resolve();
                });
            });

            return manager.clearAllMountains().then(() => {
                ((<any>manager.mountains.length)).should.equal(0);
            });
        });
    });
});