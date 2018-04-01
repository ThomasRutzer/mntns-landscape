import * as THREE from 'three';
import SceneManager from './SceneManager';
import sceneConfig from './../sceneConfig';
import { CameraManager } from '../../camera';
import SceneParticlesManager from './SceneParticlesManager';
import SceneParticlesManagerInterface from './SceneParticlesManagerInterface';
import SceneIntersectionObserverInterface from '../intersection-observer/SceneIntersectionObserverInterface';
import SceneIntersectionObserver from '../intersection-observer/SceneIntersectionObserver';

const instances = {};

class SceneManagerFactory {
    static create(
        id: string,
        camera: { type: string, position: { x, y, z }, fieldOfView: number, nearPlane: number, farPlane: number },
        rendererType: string = sceneConfig.renderer,
        autoUpdate: boolean = true
    ): SceneManager {
        if(instances[id]) {
            return instances[id];
        }

        let particlesManager: SceneParticlesManagerInterface;
        let intersectionObserver: SceneIntersectionObserverInterface;

        const scene: THREE.Scene = defineScene();

        const renderer: THREE.Renderer = defineRenderer(rendererType);

        const cameraManager = new CameraManager(
            {
                type: camera.type,
                fieldOfView: camera.fieldOfView,
                aspectRatio: window.innerWidth / window.innerHeight,
                nearPlane: camera.nearPlane,
                farPlane: camera.farPlane
            },
            {
                x: camera.position.x,
                y: camera.position.y,
                z: camera.position.z,
            },

            {x: 0, y: 0, z: 0}
        );

        if (sceneConfig.particles) {
            particlesManager = new SceneParticlesManager(sceneConfig.particlesOptions.count, sceneConfig.particlesOptions.color);
        }

        if (sceneConfig.observeIntsections) {
            intersectionObserver = new SceneIntersectionObserver(cameraManager.getCamera(), renderer);
        }

        instances[id] = new SceneManager(scene, cameraManager, renderer, autoUpdate, particlesManager, intersectionObserver);
        return instances[id];
    }
}

function defineScene(): THREE.Scene {
    let instance: THREE.Scene = new THREE.Scene();
    instance.fog = new THREE.FogExp2(sceneConfig.fog.color, sceneConfig.fog.density);

    return instance;
}

function defineRenderer(rendererType): THREE.Renderer {
    let instance: any = null;
    switch (rendererType) {
        case 'webGL':
            instance = new THREE.WebGLRenderer({alpha: true, antialias: true});
            instance.setClearColor(0x000000, 0);
    }

    instance.shadowMap.enabled = true;
    return instance;
}

export default SceneManagerFactory;
