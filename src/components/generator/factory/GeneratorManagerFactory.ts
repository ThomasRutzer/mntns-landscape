import { SceneManagerFactory, sceneConfig } from '../../scene';
import CameraFactoryTypes from './../../camera/factory/CameraFactoryTypes';
import GeneratorManager from '../manager/GeneratorManager';

const instances = {};

class GeneratorManagerFactory {
    static getById(generatorId: string) {
        return instances[generatorId];
    }

    static create(generatorId: string, mountainsData?: Object[]): GeneratorManager {
        if (instances[generatorId]) {
            return instances[generatorId];
        }

        const sceneManager = SceneManagerFactory.getById(generatorId);

        // shall always create an instance
        if (sceneManager) {
            instances[generatorId] = new GeneratorManager(sceneManager, mountainsData);
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
        }

        return instances[generatorId];
    }
}

export default GeneratorManagerFactory;