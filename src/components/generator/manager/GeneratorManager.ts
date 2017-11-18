import GlobalLight from './../../light/factory/GlobalLightFactory';
import SceneObjectModel from './../../scene/model/SceneObjectModel';
import { Mountain } from './../../mountain';

export default class GeneratorManager {
    private scene;
    private mountain;
    private globalLight;

    constructor(scene) {
        this.scene = scene;
        this.addGlobalLight();

        this.addMountain();
    }

    addGlobalLight() {
        this.globalLight = new GlobalLight('#fff', '#fff', 0.8);
        this.scene.addElement(SceneObjectModel.create('globalLight', this.globalLight.lightElement));
    }

    addMountain() {
        this.mountain = SceneObjectModel.create('mountain', Mountain.create(30, 15).mesh, {y: 0, x:0});
        this.scene.addElement(this.mountain);
    }
}