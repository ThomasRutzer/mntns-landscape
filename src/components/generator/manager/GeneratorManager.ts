import { inBetween } from './../../math-utils';
import LightFactory from './../../light';
import SceneObjectModel from './../../scene/model/SceneObjectModel';
import SceneManager from '../../scene/manager/SceneManager';
import { MountainFactory, Mountain } from './../../mountain';
import generatorManagerConfig from '../generatorManagerConfig';
import CustomMesh from './../../custom-mesh';
import { rangeRandom } from './../../math-utils';
import GeneratorManagerInterface from "./GeneratorManagerInterface";

class GeneratorManager implements GeneratorManagerInterface {
    private sceneManager: SceneManager;
    private mountainsData;
    private mountains:Mountain[];
    private positioning:{leftOffset: number, rightOffset: number};

    private globalLight;
    private shadowLight;

    constructor(sceneManager:SceneManager, mountainsData:Object[] = []) {
        this.sceneManager = sceneManager;
        this.mountainsData = mountainsData;
        this.mountains = [];

        this.resetPositioning();
        this.addGlobalLight();
        this.addShadowLight();
        this.addFloor();
        this.createMountains();
    }

    /**
     * @param data -> data to construct Mountain with
     */
    public addMountain(data: any): void {
        const mountain = MountainFactory.create(data.id, data.height, data.thickness);
        const pos = {
            x: inBetween(data.x, generatorManagerConfig.layout.position.x.min, generatorManagerConfig.layout.position.x.max),
            z: inBetween(data.z, generatorManagerConfig.layout.position.z.min, generatorManagerConfig.layout.position.z.max)
        };

        this.sceneManager.addElement(SceneObjectModel.create(
            data.id,
            mountain.mesh,
           {
                x: pos.x,
                z: pos.z,
                y: 0
            }
        ));

        this.mountains.push(mountain);
    }

    /**
     * @returns {Promise<T>}
     */
    public clearAllMountains(): Promise<any> {
        let returnPromiseResolve = new Function();
        const returnPromise = new Promise((res) => {
            returnPromiseResolve = res;
        });
        const allPromises = [];

        this.mountains.forEach((mountainElement, index) => {

            allPromises.push(mountainElement.shrink(true));
            this.sceneManager.removeElement(mountainElement.id);

        });

        Promise.all(allPromises).then(() => {
            this.mountains = [];
            this.resetPositioning();
            returnPromiseResolve();
        });

        return returnPromise;
    }

    /**
     * @param mountainId
     * @returns {Promise<T>}
     */
    public clearMountain(mountainId: string): Promise<any> {
        let returnPromiseResolve = new Function();
        const returnPromise = new Promise((res) => {
            returnPromiseResolve = res;
        });
        const allPromises = [];
        let index = null;

        this.mountains.forEach( (mountainElement, i) => {
            if (mountainElement.id === mountainId) {
                allPromises.push(mountainElement.shrink(true));
                index = i;
            }
        });

        Promise.all(allPromises).then(() => {
            this.sceneManager.removeElement(mountainId);
            this.mountains.splice(index, 1);
            returnPromiseResolve();
        });

        return returnPromise;
    }

    /**
     * @param {string} id -> search predict
     * @returns {{id: number, mountain: Mountain} | null}
     */
    public findMountainById(id: string): Mountain | null {
        let foundMnt = null;

        this.mountains.forEach((mnt) => {
            if (mnt.id === id) {
                foundMnt = mnt;
            }
        });

        return foundMnt;
    }

    private addFloor(): void {
        const mesh =  CustomMesh.planeMesh(
            generatorManagerConfig.floor.dimensions.width,
            generatorManagerConfig.floor.dimensions.height,
            generatorManagerConfig.floor.dimensions.depth,
            generatorManagerConfig.floor.color);
        const geom: any = mesh.geometry;

        const vertices =  geom.vertices;

        for (let i=0; i < vertices.length; i++){
            let v = vertices[i];
            v.x += rangeRandom(-generatorManagerConfig.floor.randomShift,generatorManagerConfig.floor.randomShift);
            v.y += rangeRandom(-generatorManagerConfig.floor.randomShift,generatorManagerConfig.floor.randomShift);
            v.z += rangeRandom(-generatorManagerConfig.floor.randomShift,generatorManagerConfig.floor.randomShift);
        }

        geom.computeFaceNormals();
        geom.verticesNeedUpdate = true;
        geom.colorsNeedUpdate = true;

        mesh.rotation.x = -Math.PI / 2;
        this.sceneManager.addElement(SceneObjectModel.create('floor', mesh));
    }

    private addGlobalLight(): void {
        this.globalLight = LightFactory.create(generatorManagerConfig.globalLight.type, generatorManagerConfig.globalLight.primaryColor, generatorManagerConfig.globalLight.secondaryColor, generatorManagerConfig.globalLight.density);
        this.sceneManager.addElement(SceneObjectModel.create('globalLight', this.globalLight.lightElement));
    }


    private addShadowLight(): void {
        this.shadowLight = LightFactory.create(generatorManagerConfig.shadowLight.type, generatorManagerConfig.shadowLight.color, generatorManagerConfig.shadowLight.density, {castShadow: true});
        this.sceneManager.addElement(SceneObjectModel.create('shadowLight', this.shadowLight.lightElement, {
            x: generatorManagerConfig.shadowLight.position.x,
            y: generatorManagerConfig.shadowLight.position.y,
            z: generatorManagerConfig.shadowLight.position.z
        }));
    }

    /**
     * creates mountains from Array
     */
    private createMountains(): void {
        this.mountainsData.forEach((mountainData) => {
            this.addMountain(mountainData);
        });
    }

    /**
     * handles placement of mountains to each other
     * @type {number}leftOffset ->  stores thickness of all mountains on the left side
     * @type {number}rightOffset -> stores thickness of all mountains on the right side
     */
    private resetPositioning() {
        this.positioning = {
            leftOffset: 0,
            rightOffset: 0
        };
    }
}

export default GeneratorManager;