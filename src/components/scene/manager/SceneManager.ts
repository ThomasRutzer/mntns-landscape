import * as THREE from 'three';

import SceneManagerInterface from './SceneManagerInterface';
import SceneObjectModel from '../model/SceneObjectModel';

import SceneIntersectionObserverInterface from '../intersection-observer/SceneIntersectionObserverInterface';

import SceneMousemoveManager from '../mousemove-manager/SceneMousemoveManager';
import SceneMousemoveManagerInterface from '../mousemove-manager/SceneMousemoveManagerInterface';

import SceneParticlesManagerInterface from '../particles-manager/SceneParticlesManagerInterface';

import { CameraManagerInterface } from './../../camera';

import sceneConfig from '../sceneConfig';
import sceneEvents from '../sceneEvents';

import eventBus from './../../event-bus';

export default class SceneManager implements SceneManagerInterface {
    public sceneElement: THREE.Scene;
    public renderer: THREE.Renderer|THREE.WebGLRenderer;

    private sceneElements: SceneObjectModel[];
    private autoUpdate: boolean;
    private dimensions: { width: number, height: number };

    private cameraManager: CameraManagerInterface;

    private mousemoveManager: SceneMousemoveManagerInterface;
    private particlesManager: SceneParticlesManagerInterface;
    private intersectionObserver: SceneIntersectionObserverInterface;

    constructor(sceneElement: THREE.Scene,
                cameraManager: CameraManagerInterface,
                renderer: THREE.Renderer,
                autoUpdate: boolean = true,
                particlesManager?: SceneParticlesManagerInterface,
                sceneIntersectionObserver?: SceneIntersectionObserverInterface
    ) {

        this.sceneElement = sceneElement;
        this.sceneElements = [];

        this.dimensions = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.autoUpdate = autoUpdate;

        this.cameraManager = cameraManager;

        this.renderer = renderer;
        this.renderer.setSize(this.dimensions.width, this.dimensions.height);

        if (sceneConfig.reactToMouseMove) {
            this.mousemoveManager = new SceneMousemoveManager(
                this.sceneElement,
                this.cameraManager,
                {
                    reactiveAreaSize: sceneConfig.reactToMouseMoveOptions.reactiveArea,
                    zoomThreshold: sceneConfig.reactToMouseMoveOptions.zoomThreshold
                }
            );
        }

        if (particlesManager) {
            this.particlesManager = particlesManager;
            this.sceneElement.add(this.particlesManager.particlesGroup);
        }

        if (sceneIntersectionObserver) {
            this.intersectionObserver = sceneIntersectionObserver;
            this.intersectionObserver.addSceneElements(this.sceneElements);
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
     * tweens Camera back to start position.
     * Scene is deactivated while tweening
     * @return {Promise<any>}
     */
    public async setCameraToStart(): Promise<any> {
        eventBus.$emit(sceneEvents.DEACTIVATED);
        await this.cameraManager.setToStart();
        eventBus.$emit(sceneEvents.ACTIVATED);
        return Promise.resolve();
    }

    /**
     * adds several window event listener
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
        if (this.mousemoveManager) {
            this.mousemoveManager.onRender();
        }

        if (this.particlesManager) {
            this.particlesManager.onRender();
        }

        this.renderer.render(this.sceneElement, this.cameraManager.getCamera());
    }

    /**
     * resize  handler
     */
    private handleResize(): void {

        this.dimensions = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.renderer.setSize(this.dimensions.width, this.dimensions.height);

        if (!this.autoUpdate) {
            this.render();
        }
    }

}