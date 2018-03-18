/**
 * model class of intersections. Passed as data of
 * corresponding events
 */
class SceneIntersectionModel {
    private id: string;
    private position: {x: number, y: number, z: number};
    private event: { x: number, y: number, type: string};

    static create(id: string,
                  position: { x: number, y: number, z: number},
                  event: { x: number, y: number, type: string}) {
        return new SceneIntersectionModel(id, position, event);
    }

    constructor(id: string,
                position: { x: number, y: number, z: number},
                event: { x: number, y: number, type: string}) {
        /**
         * id of intersected Object
         * @type {String}
         */
        this.id = id;

        /**
         * position of intersected Object
         * @namespace
         * @property {number} x coordinate x of object at Scene
         * @property {number} x coordinate y of object at Scene
         * @property {number} x coordinate z of object at Scene
         */
        this.position = position;

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