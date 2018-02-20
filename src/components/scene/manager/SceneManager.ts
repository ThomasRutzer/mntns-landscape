import * as THREE from 'three';
import {Subject} from 'rxjs/Subject';

import SceneManagerInterface from './SceneManagerInterface';
import SceneObjectModel from '../model/SceneObjectModel';
import SceneConfig from './SceneConfig';
import SceneChangeObservables from './SceneChangeObservables';
import CameraFactory from '../../camera/index';

let raycaster = new THREE.Raycaster();
let unprojectedCoords = new THREE.Vector2();

export default class SceneManager implements SceneManagerInterface {
    public sceneElement: THREE.Scene;
    public camera;
    public renderer: THREE.WebGLRenderer;

    private sceneElements: SceneObjectModel[];
    private autoUpdate: boolean;
    private dimensions: {width: number, height: number};
    private mouseCoords: {x:number, y: number};
    private mouseIsMoving: boolean = false;
    private changeObservable = new Subject<Object>();

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

        //@todo make this parametrical
        this.camera.position.x =  -400;
        this.camera.position.y = 200;
        this.camera.position.z = 250;



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

        this.addListener();
    }

    /**
     * public Observable, other components can subscribe
     * @returns {Subject<Object>}
     */
    public registerForChanges(): Subject<Object> {
        return this.changeObservable;
    }

    /**
     * @param {SceneObjectModel} newElement
     */
    public addElement(newElement)  {
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

    /**
     * adds several window event listener
     */
    private addListener(): void {
        window.addEventListener('resize', () => { this.handleResize(); }, false);

        if(SceneConfig.reactToMouseMove) {
            this.mouseCoords = {x: 0, y: 0};

            window.addEventListener( 'mousemove', (e) => this.onMouseMove(e), false );
        }

        if(SceneConfig.observeIntsections) {
            document.addEventListener('mousedown', (e) => {
                this.findIntersections({x: e.clientX, y: e.clientY});
            }, false);

            document.addEventListener('touchstart', (e) => {

                let eventCoords = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                };

                this.findIntersections( eventCoords );
            }, false)
        }
    }

    /**
     * callback for mousedown / touchstart events, when intersections are observed
     * @param { Object } coords
     */
    private findIntersections(coords: {x: number, y: number}): void {

        unprojectedCoords.x = ( coords.x / this.renderer.domElement.clientWidth ) * 2 - 1;
        unprojectedCoords.y = - ( coords.y / this.renderer.domElement.clientHeight ) * 2 + 1;

        raycaster.setFromCamera( unprojectedCoords, this.camera );

        let objects: THREE.Object3D[] = [];

        this.sceneElements.map((elem) => {
            if( elem.object.type === 'Mesh') {
                objects.push(elem.object);
           }
        });

        let intersects = raycaster.intersectObjects( objects );

        if ( intersects.length > 0 ) {

            let intersectsNames = intersects.map((intersection) => {
               return intersection.object.name;
            });

            this.broadcastChanges(SceneChangeObservables.INTERSECTIONS, intersectsNames);
        }
    }

    /**
     *
     * @param {string} type -> type identifier of broadcast
     * @param data
     */
    private broadcastChanges(type: string, data: any): void {
        this.changeObservable.next({
            type: type,
            data: data
        });
    }

    /**
     * create a loop to render scene, based on browser RAF
     */
    private loop() {
        this.render();
        requestAnimationFrame(() => { this.loop(); });
    }

    /**
     * rendering of scene
     */
    private render(): void {
        if(SceneConfig.reactToMouseMove && this.mouseIsMoving) {
            this.camera.position.x += ( this.mouseCoords.x - this.camera.position.x ) * .001;

            this.camera.lookAt( this.sceneElement.position );

            this.mouseIsMoving = false;
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

    /**
     * store mouse coords on each move
     * @param {Event} event -> mouse event
     */
    private onMouseMove(event) {
        this.mouseCoords.x = ( event.clientX - window.innerWidth / 2 );
        this.mouseCoords.y = ( event.clientY - window.innerHeight / 2 );

        this.mouseIsMoving = true;
    }
}