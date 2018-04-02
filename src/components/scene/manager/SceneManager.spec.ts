import {expect} from 'chai';
import {spy, assert} from 'sinon';
import SceneManager from './SceneManager';
import SceneObjectModel from './../model/SceneObjectModel';
import * as THREE from 'three';
import CameraManager from './../../camera/manager/CameraManager';
import CameraFactoryTypes from './../../camera/factory/CameraFactoryTypes';

describe('SceneManager', () => {
    let cameraManager = null;
    let renderer = new THREE.WebGLRenderer();

    before(() => {
        cameraManager = new CameraManager({
                type: CameraFactoryTypes.PERSPECTIVE,
                fieldOfView: 1,
                aspectRatio: 1,
                nearPlane: 1,
                farPlane: 1,
            },
            {
                x: 1,
                y: 1,
                z: 1
            },
            {
                x: 1,
                y: 1,
                z: 1
            }
        );
    });

    describe('constructor()', () => {
        it('calls method loop when passed argument "autoUpdate" is true', () => {
            let manager;
            const loopMethodSpy = spy(<any>SceneManager.prototype, 'loop');

            manager = new SceneManager(
                new THREE.Scene(),
                cameraManager,
                renderer,
                true,
                undefined,
                undefined
            );

            assert.called(loopMethodSpy);
        });
    });

    describe('method addElement()', () => {

        let manager = null;

        beforeEach(() => {
            manager = new SceneManager(
                new THREE.Scene(),
                cameraManager,
                renderer,
                true,
                undefined,
                undefined
            );
        });

        it('adds Element to both, ThreeJS Scene and elemens array', () => {
            const element = new THREE.Object3D();
            const elementId = 'test';
            manager.addElement(SceneObjectModel.create(elementId, element));

            expect((<any>manager).sceneElements[0].id).to.equal(elementId);
            expect((<any>manager).sceneElement.getObjectByName(elementId).name).to.equal(elementId);
        });

        it('throws error when same Id is added twice', () => {
            const element = new THREE.Object3D();
            const elementId = 'test';
            manager.addElement(SceneObjectModel.create(elementId, element));

            expect(() => {
                manager.addElement(SceneObjectModel.create(elementId, element))
            }).to.throw();
        });

        it('throws error passed element is not of type SceneObjectModel', () => {
            const element = new THREE.Object3D();
            const elementId = 'test';

            expect(() => {
                manager.addElement(elementId, element)
            }).to.throw();
        });
    });

    describe('method removeElement()', () => {
        let manager = null;

        beforeEach(() => {
            manager = new SceneManager(
                new THREE.Scene(),
                cameraManager,
                renderer,
                true,
                undefined,
                undefined
            );
        });

        it('removes Element from both, ThreeJS Scene and elemens array', () => {
            const element = new THREE.Object3D();
            const elementId = 'test';
            let isIn = false;

            manager.addElement(SceneObjectModel.create(elementId, element));
            manager.removeElement(elementId);

            (<any>manager).sceneElements.forEach((element) => {
                if (element.id === elementId) {
                    isIn = true;
                }
            })

            expect(isIn).to.be.false;
            expect((<any>manager).sceneElement.getObjectByName(elementId)).to.be.undefined;
        });
    });

    describe('method loop()', () => {
        it('calls method render', () => {
            let manager =  new SceneManager(
                new THREE.Scene(),
                cameraManager,
                renderer,
                true,
                undefined,
                undefined
            );

            const renderMethodSpy = spy(<any>SceneManager.prototype, 'render');
            const prototype = <any>manager;
            prototype.loop();
            assert.called(renderMethodSpy);
        });
    });
});