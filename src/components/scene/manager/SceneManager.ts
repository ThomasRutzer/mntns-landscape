import * as THREE from 'THREE';
import SceneManagerInterface from './SceneManagerInterface';
import SceneObjectModel from '../model/SceneObjectModel';
import SceneConfig from './SceneConfig';

import CameraFactory from '../../camera/index';

export default class SceneManager implements SceneManagerInterface {
    public sceneElement: THREE.Scene;
    public camera;
    public renderer: THREE.WebGLRenderer;
    private sceneElements: SceneObjectModel[];
    private autoUpdate: boolean;
    private dimensions: {width: number, height: number};
    private mouseCoords: {x:number, y: number};

    public static create(camera, renderer?, autoUpdate?) {
        return new SceneManager(camera, renderer, autoUpdate);
    }

    constructor(camera: { type: string, position: { x, y, z }, fieldOfView: number, nearPlane: number, farPlane: number },
                renderer: string = SceneConfig.renderer,
                autoUpdate: boolean = true) {

        this.sceneElement = new THREE.Scene();
        this.sceneElement.fog = new THREE.FogExp2(SceneConfig.fog.color, SceneConfig.fog.density);

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

        this.camera.position.x = camera.position && camera.position.x || 0;
        this.camera.position.y = camera.position && camera.position.y || 0;
        this.camera.position.z = camera.position && camera.position.z || 0;

        this.camera.lookAt(this.sceneElement.position);
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
        window.addEventListener('resize', () => { this.handleResize(); }, false);

        if(SceneConfig.reactToMouseMove) {
            this.mouseCoords = {x: 0, y: 0};

            window.addEventListener( 'mousemove', (e) => this.onMouseMove(e), false );
        }
    }

    /**
     * @param {SceneObjectModel} newElement
     */
    addElement(newElement)  {
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
    removeElement(id: string) {
        this.sceneElements.forEach((sceneElement, iterator) => {
            if (sceneElement.id === id) {
                this.sceneElements.splice(iterator, 1);
                this.sceneElement.remove(this.sceneElement.getObjectByName(id));

                return;
            }
        });
    }

    loop() {
        this.render();
        requestAnimationFrame(() => { this.loop(); });
    }

    render() {
        if(SceneConfig.reactToMouseMove && this.mouseCoords) {
            this.camera.position.x += ( this.mouseCoords.x - this.camera.position.x ) * .0001;
            // this.camera.position.y += ( - ( this.mouseCoords.y - 200) - this.camera.position.y ) * .0008;

            this.camera.lookAt( this.sceneElement.position );
        }

        this.renderer.render(this.sceneElement, this.camera);
    }

    handleResize() {

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

    private onMouseMove(event) {
        this.mouseCoords.x = ( event.clientX - window.innerWidth / 2 );
        this.mouseCoords.y = ( event.clientY - window.innerHeight / 2 );
    }
}