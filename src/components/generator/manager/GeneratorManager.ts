import LightFactory from './../../light';
import SceneObjectModel from './../../scene/model/SceneObjectModel';
import Scene from '../../scene/manager/SceneManager';
import {Mountain} from './../../mountain';
import GeneratorManagerConfig from './GeneratorManagerConfig';
import { rangeRandomInt } from './../../math-utils';
import TextureProvider from './../../texture-provider/';
import CustomMesh from './../../custom-mesh';
import { rangeRandom } from './../../math-utils';

class GeneratorManager {
    private config: any = GeneratorManagerConfig;
    private scene:Scene;
    private mountainsData;
    private mountains:{id:string, mountain:Mountain}[];
    private positioning:{side:string, leftOffset:number, rightOffset:number};

    // used to create unique id
    private allMountainCounter = 0;

    private globalLight;
    private shadowLight;
    private texture: THREE.Texture;

    constructor(scene:Scene, mountainsData:Object[] = []) {
        this.scene = scene;
        this.mountainsData = mountainsData;
        this.mountains = [];

        this.resetPositioning();
        this.addGlobalLight();
        this.addShadowLight();
        this.addFloor();
        this.createMountains();
    }

    addFloor(): void {
        const mesh =  CustomMesh.planeMesh(1600,1600,12, GeneratorManagerConfig.floor.color);
        const geom: any = mesh.geometry;

        const vertices =  geom.vertices;
        for (let i=0; i < vertices.length; i++){
            let v = vertices[i];
            v.x += rangeRandom(-10,10);
            v.y += rangeRandom(-10,10);
            v.z += rangeRandom(-10,10);
        }

        geom.computeFaceNormals();
        geom.verticesNeedUpdate = true;
        geom.colorsNeedUpdate = true;

        mesh.rotation.x = -Math.PI / 2;
        this.scene.addElement(SceneObjectModel.create('floor', mesh));
    }

    addGlobalLight(): void {
        this.globalLight = LightFactory.create(this.config.globalLight.type, this.config.globalLight.primaryColor, this.config.globalLight.secondaryColor, this.config.globalLight.density);
        this.scene.addElement(SceneObjectModel.create('globalLight', this.globalLight.lightElement));
    }

    addShadowLight(): void {
        this.shadowLight = LightFactory.create(this.config.shadowLight.type, this.config.shadowLight.color, this.config.shadowLight.density, {castShadow: true});
        this.scene.addElement(SceneObjectModel.create('shadowLight', this.shadowLight.lightElement, {
            x: this.config.shadowLight.x,
            y: this.config.shadowLight.y,
            z: this.config.shadowLight.z
        }));
    }

    createMountains(): void {
        this.getTexture().then(() => {
            this.mountainsData.forEach((mountainData) => {
                this.addMountain(mountainData);
            });
        });
    }

    addMountain(data): void {
        let posX = this.determinePosition(data.thickness);

        const mountain = Mountain.create(data.height, data.thickness, this.texture);

        this.scene.addElement(SceneObjectModel.create(`mountain-${this.allMountainCounter}`,
            mountain.mesh, {y: 0, x: posX, z: rangeRandomInt(GeneratorManagerConfig.shiftX[0], GeneratorManagerConfig.shiftX[1])}));

        this.allMountainCounter++;
        this.mountains.push({
            id: `mountain-${this.allMountainCounter}`,
            mountain: mountain
        });
    }

    clearMountain(mountainId): Promise<any> {
        let returnPromiseResolve = new Function();
        const returnPromise = new Promise((res) => {
            returnPromiseResolve = res;
        });
        const allPromises = [];
        let index = null;

        this.mountains.forEach( (mountainElement, i) => {
            if (mountainElement.id === mountainId) {
                allPromises.push(mountainElement.mountain.shrink(true));
                index = i;
            }
        });

        Promise.all(allPromises).then(() => {
            this.scene.removeElement(mountainId);
            this.mountains.splice(index, 1);
            returnPromiseResolve();
        });

        return returnPromise;
    }

    clearAllMountains(): Promise<any> {
        let returnPromiseResolve = new Function();
        const returnPromise = new Promise((res) => {
            returnPromiseResolve = res;
        });
        const allPromises = [];

        this.mountains.forEach((mountainElement, index) => {

            allPromises.push(mountainElement.mountain.shrink(true));
            this.scene.removeElement(mountainElement.id);

        });

        Promise.all(allPromises).then(() => {
            this.mountains = [];
            this.resetPositioning();
            returnPromiseResolve();
        });

        return returnPromise;
    }

    private determinePosition(offset): number {
        let posX = 0;

        if (this.mountains.length === 0) {
            this.positioning.leftOffset += (offset - GeneratorManagerConfig.overlapping);
            this.positioning.rightOffset += (offset - GeneratorManagerConfig.overlapping);

            return posX;
        }

        if ( this.positioning.side === 'left' ) {
            posX = this.positioning.leftOffset * -1;
            this.positioning.leftOffset += (offset - GeneratorManagerConfig.overlapping);
            this.positioning.side = 'right';
        } else {
            posX = this.positioning.rightOffset;
            this.positioning.rightOffset += (offset - GeneratorManagerConfig.overlapping);
            this.positioning.side = 'left';
        }

        return posX;
    }

    /**
     * loads texture for all mountain objects. TextureProvider caches
     * already loaded files.
     *
     * @returns {Promise<T>}
     */
    private getTexture(): Promise<any> {
        let returnPromiseResolve = new Function();
        const returnPromise = new Promise((res) => {
            returnPromiseResolve = res;
        });

        TextureProvider.loadByUrl(GeneratorManagerConfig.textureUrl).then((tex) => {
            this.texture = tex;
            returnPromiseResolve();
        });

        return returnPromise;
    }

    /**
     * handles placement of mountains to each other
     * @type {number}side -> handles if mountain shall be placed left or right from x=0
     * @type {number}leftOffset ->  stores thickness of all mountains on the left side
     * @type {number}rightOffset -> stores thickness of all mountains on the right side
     */
    private resetPositioning() {
        this.positioning = {
            side: GeneratorManagerConfig.initialSide,
            leftOffset: 0,
            rightOffset: 0
        };
    }
}

export default GeneratorManager;