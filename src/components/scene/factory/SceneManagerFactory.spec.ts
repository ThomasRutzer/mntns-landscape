import {expect} from 'chai';
import SceneManagerFactory from './SceneManagerFactory';
import sceneConfig from './../sceneConfig';
import CameraFactoryTypes from './../../camera/factory/CameraFactoryTypes';

describe('SceneManagerFactory', () => {
    let manager;
    let cameraOptions = {
            type: CameraFactoryTypes.PERSPECTIVE,
            nearPlane: 1,
            farPlane: 1,
            fieldOfView: 1,
            position: {
                x: 1,
                y: 1,
                z: 1
            }
        };

    it('returns null, when no matching instance is found by id', () => {
        manager = SceneManagerFactory.create(
            `scene-manager-1`,
            cameraOptions,
            sceneConfig.renderer,
        );

        const manager1 = SceneManagerFactory.getById('scene-manager-2');

        expect(manager1).to.equal(undefined);
    });

    it('caches instances by id', () => {
        manager = SceneManagerFactory.create(
            `scene-manager-1`,
            cameraOptions,
            sceneConfig.renderer,
        );

        const manager1 = SceneManagerFactory.getById('scene-manager-1');

        expect(manager1).to.exist;
    });

    it('creates new SceneManager instance', () => {
        manager = SceneManagerFactory.create(
            `scene-manager-${Math.random()}`,
            cameraOptions,
            sceneConfig.renderer,
        );

        expect(manager.constructor.name).to.equal('SceneManager');
    });
});