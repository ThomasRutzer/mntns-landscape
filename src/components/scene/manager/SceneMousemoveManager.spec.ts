import * as THREE from 'three';
import {stub} from 'sinon';
import SceneMousemoveManager from './SceneMousemoveManager';
import {expect} from 'chai';

describe('SceneMousemoveManager', () => {

    let manager, windowStubWidth, windowStubHeight;

    before(() => {
        windowStubWidth = stub(window, 'innerWidth').value(1000);
        windowStubHeight = stub(window, 'innerHeight').value(1000);

        manager = new SceneMousemoveManager(new THREE.Scene(), new THREE.Camera(), {
            reactiveAreaSize: 10,
            zoomThreshold: 10
        });

        manager.camera.position.x = 50;
        manager.camera.position.y = 50;
        manager.camera.position.z = 50;

        manager.options.cameraInitialPos.x = 50;
        manager.options.cameraInitialPos.y = 50;
        manager.options.cameraInitialPos.z = 50;

    });

    after(() => {
        windowStubWidth.restore();
        windowStubHeight.restore();
    });

    describe('method checkCameraHorizontal()', () => {

        it('updates camera position by adding current factor 1.2, when hitting reactive areas', () => {
            manager.mouseCoords.y = 5;

            manager.reactiveAreaSize = {
                top: 10,
                bottom: 10
            };

            const result = manager.checkCameraHorizontal();
            expect(result).to.equal(51.2);
        });

        it('returns current camera position, when are not hitting reactive areas', () => {
            manager.mouseCoords.y = 11;
            manager.checkCameraHorizontal();

            expect(manager.camera.position.x).to.equal(50);
            expect(manager.camera.position.y).to.equal(50);
            expect(manager.camera.position.z).to.equal(50);
        })
    });

    describe('method checkCameraVertical()', () => {

        it('updates camera position by adding current factor 1.2, when hitting reactive areas', () => {
            manager.mouseCoords.x = 5;

            manager.reactiveAreaSize = {
                left: 10,
                right: 10
            };

            const result = manager.checkCameraVertical();
            expect(result).to.equal(51.2);
        });

        it('returns current camera position, when are not hitting reactive areas', () => {
            manager.mouseCoords.x = 11;
            manager.checkCameraVertical();

            expect(manager.camera.position.x).to.equal(50);
            expect(manager.camera.position.y).to.equal(50);
            expect(manager.camera.position.z).to.equal(50);
        })
    });

    describe('method calcReactiveAreaSize()', () => {
       it ('returns expected object', () => {
            const results = manager.calcReactiveAreaSize(10);
            expect(results.top).to.equal(-400);
            expect(results.bottom).to.equal(400);
            expect(results.left).to.equal(-400);
            expect(results.right).to.equal(400);
       })
    });
});