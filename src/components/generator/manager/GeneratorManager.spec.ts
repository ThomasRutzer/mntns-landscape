import {expect, should} from 'chai';
import GeneratorManager from './GeneratorManager';
import SceneManager from '../../scene/manager/SceneManager';

describe('GeneratorManager', () => {
    let manager: any = GeneratorManager.prototype;

    beforeEach(() => {
        let data = [
            {id: "1", thickness: 50, height: 100},
            {id: "2", thickness: 30, height: 50},
            {id: "3", thickness: 50, height: 30}],
            sceneManager = new SceneManager(
                {type: 'perspective', fieldOfView: 60, nearPlane: 0.1, farPlane: 3000, position: {x: 0, y: 0, z: 150}},
                'webGL',
                true);


        manager = new GeneratorManager(sceneManager, data);
    });

    describe('constructor()', () => {
        it('holds floor after construction', () => {
            let counter = 0;

            <any>manager.sceneManager.sceneElements.filter((element) => {
                if(element.id === 'floor') {
                    counter++;
                }
            });

            expect(counter).to.equal(1);
        });

        it('holds globalLight after construction', () => {
            let counter = 0;

            <any>manager.sceneManager.sceneElements.filter((element) => {
                if(element.id === 'globalLight') {
                    counter++;
                }
            });

            expect(counter).to.equal(1);
        });

        it('holds shadowLight after construction', () => {
            let counter = 0;

            <any>manager.sceneManager.sceneElements.filter((element) => {
                if(element.id === 'shadowLight') {
                    counter++;
                }
            });

            expect(counter).to.equal(1);
        });
    });

    describe('method addMountain()', () => {
        it('adds element with proper ID to Scene', () => {
            const data = {id: "4", thickness: 50, height: 100};
            let counter = 0;

            manager.addMountain(data);

            <any>manager.sceneManager.sceneElements.filter((element) => {
                if(element.id === data.id) {
                    counter++;
                }
            });

            expect(counter).to.equal(1);
        });

        it('adds element with proper coords to Scene', () => {
            const data = {id: "5", thickness: 50, height: 100, x: 10, z: 10};
            let addedElement = null;

            manager.addMountain(data);

            <any>manager.sceneManager.sceneElements.filter((element) => {
                if(element.id === data.id) {
                    addedElement = element;
                }
            });

            expect(addedElement.position.x).to.equal(data.x);
            expect(addedElement.position.z).to.equal(data.z);
        });

        it('adds element with position.y=0 to Scene', () => {
            const data = {id: "5", thickness: 50, height: 100, x: 10, z: 10};
            let addedElement = null;

            manager.addMountain(data);

            <any>manager.sceneManager.sceneElements.filter((element) => {
                if(element.id === data.id) {
                    addedElement = element;
                }
            });

            expect(addedElement.position.y).to.equal(0);
        });
    });

    describe('method findMountainById()', () => {
       it('returns requested mountain if available', () => {
           const id = '1';
           let result = <any>manager.findMountainById(id);

           expect(result.id).to.equal(id);
       });

        it('returns null when requested mountain is not available', () => {
            const id = '5';
            let result = <any>manager.findMountainById(id);

            expect(result).to.equal(null);
        })
    });

    describe('method clearMountain()', () => {
        it('clears requested mountain from Generator', async () => {
            const id = '1';

            await manager.clearMountain(id, false);
            ((<any>manager.mountains.length)).should.equal(2);

        });
    });

    describe('method clearAllMountains()', () => {
        it('clears all mountain from Generator', async () => {
            await manager.clearAllMountains(false);
            ((<any>manager.mountains.length)).should.equal(0);
        });
    });
});