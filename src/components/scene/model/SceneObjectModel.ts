import * as THREE from 'three';
import SceneObjectModelInterface from './SceneObjectModelInferface';

export default class SceneObjectModel implements SceneObjectModelInterface {
    public id: String;
    public position: {x: number, y: number, z: number};
    public screenPosition?: {x: number, y: number} = {
        x: null, y: null
    };
    public object: THREE.Object3D;

    /**
     * @todo: move to own Factory Class
     * @param id
     * @param object
     * @param {{}} position
     * @return {SceneObjectModel}
     */
    static create(id, object, position = {}) {
        return new SceneObjectModel(id, object, position);
    }

    /**
     *
     * @param {String} id
     * @param {THREE.Object3D} object
     * @param {Object} position
     */
    constructor(id, object, position) {
        this.id = id;

        this.position = ensurePosition(position);
        this.object = object;
        this.object.name = id;
    }
}

function ensurePosition(requestedPos): {x: number, y: number, z: number} {
    const position = {
        x: 0,
        y: 0,
        z: 0,
    };

    if (requestedPos && typeof requestedPos.y === 'number') {
        position.y = requestedPos.y;
    }

    if (requestedPos && typeof requestedPos.x === 'number') {
        position.x = requestedPos.x;
    }

    if (requestedPos && typeof requestedPos.z === 'number') {
        position.z = requestedPos.z;
    }

    return position;
}