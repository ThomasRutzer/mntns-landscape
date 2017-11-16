import SceneObjectModelInterface from './SceneObjectModelInferface';

export default class SceneObjectModel implements SceneObjectModelInterface {
    public id: String;
    public position: Object;
    public object: THREE.Object3D;

    static create(id, object, position = {}) {
        return new SceneObjectModel(id, object, position);
    }

    constructor(id, object, position) {
        this.id = id;

        this.position = ensurePosition(position);
        this.object = object;
    }
}

function ensurePosition(requestedPos): {x: Number, y: Number} {
    const position = {
        x: 0,
        y: 0,
    };

    if (requestedPos && typeof requestedPos.y === 'number') {
        position.y = requestedPos.y;
    }

    if (requestedPos && typeof requestedPos.x === 'number') {
        position.x = requestedPos.x;
    }

    return position;
}