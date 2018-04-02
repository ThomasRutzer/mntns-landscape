import * as THREE from 'three';
import {stub} from 'sinon';
import {expect} from 'chai';
import SceneMousemoveManager from './SceneMousemoveManager';
import CameraManager from '../../camera/manager/CameraManager';
import CameraFactoryTypes from './../../camera/factory/CameraFactoryTypes';

describe('SceneMousemoveManager', () => {

    let manager, windowStubWidth, windowStubHeight;

    before(() => {
        windowStubWidth = stub(window, 'innerWidth').value(1000);
        windowStubHeight = stub(window, 'innerHeight').value(1000);

        const cameraManager = new CameraManager({
                type: CameraFactoryTypes.PERSPECTIVE,
                fieldOfView: 1,
                aspectRatio: 1,
                nearPlane: 1,
                farPlane: 1,
            },
            {
                x: 50,
                y: 50,
                z: 50
            },
            {
                x: 0,
                y: 0,
                z: 0
            }
        );

        manager = new SceneMousemoveManager(new THREE.Scene(), cameraManager, {
            reactiveAreaSize: 10,
            zoomThreshold: 10
        });
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
            expect(result).to.equal(48.8);
        });

        it('returns current camera position, when are not hitting reactive areas', () => {
            manager.mouseCoords.y = 11;
            manager.checkCameraHorizontal();

            expect(manager.cameraManager.getPosition().x).to.equal(50);
            expect(manager.cameraManager.getPosition().y).to.equal(50);
            expect(manager.cameraManager.getPosition().z).to.equal(50);
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

            expect(manager.cameraManager.getPosition().x).to.equal(50);
            expect(manager.cameraManager.getPosition().y).to.equal(50);
            expect(manager.cameraManager.getPosition().z).to.equal(50);
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