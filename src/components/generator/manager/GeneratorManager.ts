import LightFactory from './../../light';
import SceneObjectModel from './../../scene/model/SceneObjectModel';
import { Mountain } from './../../mountain';

export default class GeneratorManager {
    private scene;
    private mountains: SceneObjectModel[];

    // used to create unique id
    private allMountainCounter = 0;
    private globalLight;
    private shadowLight;

    constructor(scene, data: Object[] = []) {
        this.scene = scene;
        this.mountains = [];

        this.addGlobalLight();
        this.addShadowLight();

        data.forEach((mountainData) => {
            this.addMountain(mountainData);
        });
    }

    addGlobalLight() {
        this.globalLight = LightFactory.create('global', '#fff', '#fff', 0.8);
        this.scene.addElement(SceneObjectModel.create('globalLight', this.globalLight.lightElement));
    }

    addShadowLight() {
        this.shadowLight = LightFactory.create('directional', '#fff', 0.5, {castShadow: true});
        this.scene.addElement(SceneObjectModel.create('shadowLight', this.shadowLight.lightElement, {x: 100, y: 150, z: 100}));
    }

    addMountain(data) {
        const posX = this.mountains.length === 0 ? 0 : -1 * (data.thickness);
        const mountainModel = SceneObjectModel.create(`mountain-${this.allMountainCounter}`, Mountain.create(data.height, data.thickness).mesh, {y: 0, x: posX});
        this.scene.addElement(mountainModel);

        this.allMountainCounter++;
        this.mountains.push(mountainModel);

        console.log(this.mountains)
    }
}