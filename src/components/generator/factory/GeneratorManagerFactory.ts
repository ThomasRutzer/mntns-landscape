import { SceneManagerFactory, sceneConfig } from '../../scene';
import CameraFactoryTypes from './../../camera/factory/CameraFactoryTypes';
import GeneratorManager from '../manager/GeneratorManager';

class GeneratorManagerFactory {
    static create(sceneId: string, mountainsData: Object[]): GeneratorManager {
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

            return new GeneratorManager(sceneManager, mountainsData);
        }
    }
}

export default GeneratorManagerFactory;