import { SceneManagerFactory, sceneConfig } from '../../scene';
import CameraFactoryTypes from './../../camera/factory/CameraFactoryTypes';
import GeneratorManager from '../manager/GeneratorManager';

const instances = {};

class GeneratorManagerFactory {
    static getById(generatorId: string) {
        return instances[generatorId];
    }

    static create(generatorId: string, sceneId: string, mountainsData: Object[]): GeneratorManager {
        const existingSceneManager = SceneManagerFactory.getById(sceneId);

        // shall always create an instance
        if (existingSceneManager) {
            return new GeneratorManager(existingSceneManager, mountainsData);
        } else {
            const sceneManager = SceneManagerFactory.create(
                `generator-scene-${Math.random()}`,
                {
                    type: CameraFactoryTypes.PERSPECTIVE,
                    nearPlane: 1,
                    farPlane: 1,
                    fieldOfView: 1,
                    position: {
                        x: 1,
                        y: 1,
                        z: 1
                    }
                },
                sceneConfig.renderer,
            );

            instances[generatorId] = new GeneratorManager(sceneManager, mountainsData);
            return instances[generatorId];
        }
    }
}

export default GeneratorManagerFactory;