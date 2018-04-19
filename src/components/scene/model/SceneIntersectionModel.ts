import * as THREE from 'three';
import SceneIntersectionModelInterface from './SceneIntersectionModelInferface';

/**
 * model class of intersections. Passed as data of
 * corresponding events
 */
class SceneIntersectionModel implements SceneIntersectionModelInterface {
    public id: string;
    public object: THREE.Object3D;
    public object2dPosition: {x: number, y: number};
    public event: { x: number, y: number, type: string};

    static create(id: string,
                  object: THREE.Object3D,
                  object2dPosition: {x: number, y: number},
                  event: { x: number, y: number, type: string}) {
        return new SceneIntersectionModel(id, object, object2dPosition, event);
    }

    constructor(id: string,
                object: THREE.Object3D,
                object2dPosition: {x: number, y: number},
                event: { x: number, y: number, type: string}) {
        /**
         * id of intersected Object
         * @type {String}
         */
        this.id = id;

        /**
         * intersected Object
         * @note see https://threejs.org/docs/#api/core/Object3D for
         * detailed object definitions
         */
        this.object = object;

        /**
         * raycasted object position
         * @type {{x: number; y: number}}
         */
        this.object2dPosition = object2dPosition;


        /**
         * event, which triggered interception
         * @namespace
         * @property {String={mousedown, mousemove, touchstart} event.type
         * @property {number} event.x coordinate x of event trigger
         * @property {number} event.y coordinate y of event trigger
         */
        this.event = event;
    }
}

export default SceneIntersectionModel;