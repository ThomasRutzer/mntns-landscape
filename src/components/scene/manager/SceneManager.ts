import * as THREE from 'THREE';
import SceneManagerInterface from './SceneManagerInterface';
import SceneObjectModel from '../model/SceneObjectModel';

import CameraFactory from '../../camera/index';

export default class SceneManager implements SceneManagerInterface {
    public sceneElement: THREE.Scene;
    public camera;
    public renderer: THREE.WebGLRenderer;
    private sceneElements: SceneObjectModel[];
    private autoUpdate: boolean;
    private dimensions: {width: number, height: number};

    public static create(width, height, camera, renderer?, autoUpdate?) {
        return new SceneManager(width, height, camera, renderer, autoUpdate);
    }

    constructor(width: number,
                height: number,
                camera: { type: string, position: { x,y,z }, fieldOfView: number, nearPlane: number, farPlane: number },
                renderer: string = 'webGL',
                autoUpdate: boolean = true) {

        this.sceneElement = new THREE.Scene();
        this.sceneElement.fog = new THREE.Fog(0xcefaeb, 300, 1000);

        this.dimensions = {
            width: width,
            height: height
        };

        this.autoUpdate = autoUpdate;

        this.camera = CameraFactory.create(
            camera.type,
            camera.fieldOfView,
            width / height,
            camera.nearPlane,
            camera.farPlane).cameraElement;

        this.camera.position.x = camera.position && camera.position.x || 0;
        this.camera.position.y = camera.position && camera.position.y || 0;
        this.camera.position.z = camera.position && camera.position.z || 0;

        this.camera.lookAt(this.sceneElement.position)
        switch (renderer) {
            case 'webGL':
                this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
                this.renderer.setClearColor( 0x000000, 0 );
        }

        this.renderer.setSize(this.dimensions.width, this.dimensions.height);
        this.renderer.shadowMap.enabled = true;

        if (autoUpdate) {
            this.loop();
        } else {
            this.render();
        }

        this.sceneElements = [];
        window.addEventListener('resize', () => { this.handleResize() }, false);
    }

    /**
     * @param {SceneObjectModel} newElement
     */
    addElement(newElement)  {
        if (newElement.constructor.name != 'SceneObjectModel') {
            throw new Error(`Element with id: ${newElement.id} is not of type SceneObjectModel`);
        }

        let isAlreadyIn = false;

        this.sceneElements.forEach((element) => {
            if (element.id == newElement.id) {
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
    removeElement(id: string) {
        this.sceneElements.forEach((sceneElement, iterator) => {
            if(sceneElement.id === id) {
                this.sceneElements.splice(iterator, 1);
                this.sceneElement.remove(this.sceneElement.getObjectByName(id));

                return;
            }
        });
    }

    loop() {
        this.render();
        requestAnimationFrame(() => {this.loop()});
    }

    render() {
        this.renderer.render(this.sceneElement, this.camera);
    }

    handleResize() {
        const width = window.innerWidth >= this.dimensions.width
            ? window.innerWidth
            : this.dimensions.width;

        const height = window.innerWidth >= this.dimensions.height
            ? window.innerWidth
            : this.dimensions.height;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);

        if (!this.autoUpdate) {
            this.render();
        }
    }
}