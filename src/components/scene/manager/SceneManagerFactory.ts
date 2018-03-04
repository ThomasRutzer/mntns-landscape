import SceneManager from './SceneManager';

class SceneManagerFactory {
    public static create(camera, renderer?, autoUpdate?) {
        return new SceneManager(camera, renderer, autoUpdate);
    }
}

export default SceneManagerFactory;
