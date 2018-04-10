import { SceneManagerFactory, sceneConfig } from '../../scene';
import CameraFactoryTypes from './../../camera/factory/CameraFactoryTypes';
import GeneratorManager from '../manager/GeneratorManager';

const instances = {};

class GeneratorManagerFactory {
    static getById(generatorId: string) {
        if (instances[generatorId]) {
            return instances[generatorId];
        }

        return GeneratorManagerFactory.create(generatorId);
    }

    static create(generatorId: string, mountainsData?: Object[], sceneId?: string, ): GeneratorManager {
        const existingSceneManager = SceneManagerFactory.getById(sceneId);

        // shall always create an instance
        if (existingSceneManager) {
            return new GeneratorManager(existingSceneManager, mountainsData);
        } else {
            const sceneManager = SceneManagerFactory.create(
                generatorId,
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