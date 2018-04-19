import * as THREE from 'three';
import EventBus from '../../event-bus';
import { toScreenPosition } from './../../3d-utils';
import sceneEvents from '../sceneEvents';
import SceneObjectModel from '../model/SceneObjectModel';
import SceneIntersectionModel from '../model/SceneIntersectionModel';

let raycaster = new THREE.Raycaster();
let unprojectedCoords = new THREE.Vector2();

/**
 * intersects mouse or touch events with existing 3D Objects at
 * given Scene.
 *
 * Uses eventBus, where event data matches
 * SceneIntersectionModel, to emit first intersected object
 */
class SceneIntersectionObserver {
    private sceneElements: SceneObjectModel[];
    private camera: THREE.Camera;
    private renderer: THREE.Renderer;

    constructor(camera: THREE.Camera, renderer: THREE.Renderer) {
        this.camera = camera;
        this.renderer = renderer;

        this.addListener();
    }

    public addSceneElements(sceneElements: SceneObjectModel[]) {
        this.sceneElements = sceneElements;
    }

    private addListener(): void {
        
        document.addEventListener('mousemove', (e) => {
            this.findIntersections({x: e.clientX, y: e.clientY}, 'mousemove');
        }, false);

        document.addEventListener('mousedown', (e) => {
            this.findIntersections({x: e.clientX, y: e.clientY}, 'mousedown');
        }, false);

        document.addEventListener('touchstart', (e) => {

            let eventCoords = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };

            this.findIntersections(eventCoords, 'touchstart');
        }, false);
    }

    /**
     * Where intersections are observed.
     * callback for mousedown / touchstart events
     * @param { Object } coords
     * @param { String } eventType
     */
    private findIntersections(coords: { x: number, y: number }, eventType: string): void {
        unprojectedCoords.x = ( coords.x / this.renderer.domElement.clientWidth ) * 2 - 1;
        unprojectedCoords.y = -( coords.y / this.renderer.domElement.clientHeight ) * 2 + 1;

        raycaster.setFromCamera(unprojectedCoords, this.camera);

        let objects: THREE.Object3D[] = [];

        this.sceneElements.map((elem) => {
            if (elem.object.type === 'Mesh') {
                objects.push(elem.object);
            }
        });

        let intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            this.broadcastChanges(SceneIntersectionModel.create(
                intersects[0].object.name.toString(),
                intersects[0].object,
                toScreenPosition(intersects[0].object, this.camera, this.renderer),
                {
                    x: coords.x,
                    y: coords.y,
                    type: eventType
                }
            ));
        }
    }

    /**
     *
     * @param { object } data
     */
    private broadcastChanges(data: SceneIntersectionModel): void {
        EventBus.$emit(sceneEvents.INTERSECTION, data);
    }
}

export default SceneIntersectionObserver;