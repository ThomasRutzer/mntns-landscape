import * as THREE from 'three';
import EventBus from './../../event-bus';
import sceneEvents from "../sceneEvents";
import SceneObjectModel from '../model/SceneObjectModel';

let raycaster = new THREE.Raycaster();
let unprojectedCoords = new THREE.Vector2();

class SceneIntersectionObserver {
    private sceneElements: SceneObjectModel[];
    private camera: THREE.Camera;
    private renderer: THREE.Renderer;

    constructor(sceneElements: SceneObjectModel[], camera: THREE.Camera, renderer: THREE.Renderer) {
        this.sceneElements = sceneElements;
        this.camera = camera;
        this.renderer = renderer;

        this.addListener();
    }

    private addListener(): void {

        document.addEventListener('mousemove', (e) => {
            this.findIntersections({x: e.clientX, y: e.clientY}, 'mousemove');
        },);

        document.addEventListener('mousedown', (e) => {
            this.findIntersections({x: e.clientX, y: e.clientY}, 'mousedown');
        }, false);

        document.addEventListener('touchstart', (e) => {

            let eventCoords = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };

            this.findIntersections(eventCoords, 'touchstart');
        }, false)
    }

    /**
     * callback for mousedown / touchstart events, when intersections are observed
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

            let intersectsNames = intersects.map((intersection) => {
                return intersection.object.name;
            });

            this.broadcastChanges({
                objectId: intersectsNames[0],
                event: {
                    x: coords.x,
                    y: coords.y,
                    type: eventType
                }
            });
        }
    }

    /**
     *
     * @param { object } data
     */
    private broadcastChanges(data: any): void {
        EventBus.$emit(sceneEvents.INTERSECTION, data);
    }
}

export default SceneIntersectionObserver;