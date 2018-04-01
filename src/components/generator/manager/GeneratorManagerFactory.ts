import { SceneManagerFactory } from './../../scene';
import GeneratorManager from './GeneratorManager';

class GeneratorManagerFactory {
    static create(sceneId: string, mountainsData: Object[]): GeneratorManager {
        const sceneManager = SceneManagerFactory.getById(sceneId);
        return new GeneratorManager(sceneManager, mountainsData);
    }
}

export default GeneratorManagerFactory;