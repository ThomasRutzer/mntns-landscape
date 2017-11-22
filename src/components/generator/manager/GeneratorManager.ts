import LightFactory from './../../light';
import SceneObjectModel from './../../scene/model/SceneObjectModel';
import { Mountain } from './../../mountain';

export default class GeneratorManager {
    private scene;
    private mountain;
    private globalLight;
    private shadowLight;

    constructor(scene) {
        this.scene = scene;

        this.addGlobalLight();
        this.addShadowLight();

        this.addMountain();
    }

    addGlobalLight() {
        this.globalLight = LightFactory.create('global', '#fff', '#fff', 0.8);
        this.scene.addElement(SceneObjectModel.create('globalLight', this.globalLight.lightElement));
    }

    addShadowLight() {
        this.shadowLight = LightFactory.create('directional', '#fff', 0.5, {castShadow: true});
        this.scene.addElement(SceneObjectModel.create('shadowLight', this.shadowLight.lightElement, {x: 100, y: 150, z: 100}));
    }

    addMountain() {
        this.mountain = SceneObjectModel.create('mountain', Mountain.create(30, 15).mesh, {y: 0, x:0});
        this.scene.addElement(this.mountain);
    }
}