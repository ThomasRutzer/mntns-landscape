import * as THREE from 'three';

import SceneManagerInterface from './SceneManagerInterface';
import SceneObjectModel from '../model/SceneObjectModel';

import SceneIntersectionObserver from './SceneIntersectionObserver';
import SceneIntersectionObserverInterface from './SceneIntersectionObserverInterface';

import SceneMousemoveManager from './SceneMousemoveManager';
import SceneMousemoveManagerInterface from './SceneMousemoveManagerInterface';

import SceneParticlesManager from './SceneParticlesManager';
import SceneParticlesManagerInterface from './SceneParticlesManagerInterface';

import sceneConfig from '../sceneConfig';
import CameraFactory from '../../camera/index';

export default class SceneManager implements SceneManagerInterface {
    public sceneElement: THREE.Scene;
    public camera;
    public renderer: THREE.WebGLRenderer;

    private sceneElements: SceneObjectModel[];
    private autoUpdate: boolean;
    private dimensions: { width: number, height: number };

    private mousemoveManager: SceneMousemoveManagerInterface;
    private particlesManager: SceneParticlesManagerInterface;
    private intersectionObserver: SceneIntersectionObserverInterface;

    constructor(camera: { type: string, position: { x, y, z }, fieldOfView: number, nearPlane: number, farPlane: number },
                renderer: string = sceneConfig.renderer,
                autoUpdate: boolean = true) {

        this.sceneElement = new THREE.Scene();
        this.sceneElement.fog = new THREE.FogExp2(sceneConfig.fog.color, sceneConfig.fog.density);
        this.sceneElements = [];

        this.dimensions = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.autoUpdate = autoUpdate;

        this.camera = CameraFactory.create(
            camera.type,
            camera.fieldOfView,
            this.dimensions.width / this.dimensions.height,
            camera.nearPlane,
            camera.farPlane).cameraElement;

        this.camera.position.x = camera.position && camera.position.x;
        this.camera.position.y = camera.position && camera.position.y;
        this.camera.position.z = camera.position && camera.position.z;

        this.camera.lookAt(this.sceneElement.position);

        switch (renderer) {
            case 'webGL':
                this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
                this.renderer.setClearColor(0x000000, 0);
        }

        this.renderer.setSize(this.dimensions.width, this.dimensions.height);
        this.renderer.shadowMap.enabled = true;

        if (sceneConfig.reactToMouseMove) {
            this.mousemoveManager = new SceneMousemoveManager(
                this.sceneElement,
                this.camera,
                {
                    reactiveAreaSize: sceneConfig.reactToMouseMoveOptions.reactiveArea,
                    zoomThreshold: sceneConfig.reactToMouseMoveOptions.zoomThreshold
                }
            );
        }

        if (sceneConfig.particles) {
            this.particlesManager = new SceneParticlesManager(sceneConfig.particlesOptions.count, sceneConfig.particlesOptions.color);
            this.sceneElement.add(this.particlesManager.particlesGroup);
        }

        if (sceneConfig.observeIntsections) {
            this.intersectionObserver = new SceneIntersectionObserver(this.sceneElements, this.camera, this.renderer);
        }

        if (autoUpdate) {
            this.loop();
        } else {
            this.render();
        }

        this.addListener();
    }

    /**
     * @param {SceneObjectModel} newElement
     */
    public addElement(newElement) {
        if (newElement.constructor.name !== 'SceneObjectModel') {
            throw new Error(`Element with id: ${newElement.id} is not of type SceneObjectModel`);
        }

        let isAlreadyIn = false;

        this.sceneElements.forEach((element) => {
            if (element.id === newElement.id) {
                isAlreadyIn = true;
            }
        });

        if (!isAlreadyIn) {

            newElement.object.position.x = newElement.position.x;
            newElement.object.position.y = newElement.position.y;
            newElement.object.position.z = newElement.position.z;

            this.sceneElement.add(newElement.object);
            this.sceneElements.push(newElement);
        } else {
            throw new Error(`Scene already holds element with id: ${newElement.id}`);
        }
    }

    /**
     * @param {String} id -> identifier for element, which shall be removed
     */
    public removeElement(id: string) {
        this.sceneElements.forEach((sceneElement, iterator) => {
            if (sceneElement.id === id) {
                this.sceneElements.splice(iterator, 1);
                this.sceneElement.remove(this.sceneElement.getObjectByName(id));

                return;
            }
        });
    }

    public getElements() {
        return this.sceneElements;
    }

    /**
     * adds several window ev
     * ent listener
     */
    private addListener(): void {
        window.addEventListener('resize', () => {
            this.handleResize();
        }, false);
    }

    /**
     * create a loop to render scene, based on browser RAF
     */
    private loop() {
        this.render();
        requestAnimationFrame(() => {
            this.loop();
        });
    }

    /**
     * rendering of scene
     */
    private render(): void {
        if (sceneConfig.reactToMouseMove) {
            this.mousemoveManager.onRender();
        }

        if (sceneConfig.particles) {
            this.particlesManager.onRender();
        }

        this.renderer.render(this.sceneElement, this.camera);
    }

    /**
     * resize  handler
     */
    private handleResize(): void {

        this.dimensions = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.camera.aspect = this.dimensions.width / this.dimensions.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.dimensions.width, this.dimensions.height);

        if (!this.autoUpdate) {
            this.render();
        }
    }

}