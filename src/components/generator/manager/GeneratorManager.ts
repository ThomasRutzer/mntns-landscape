import { inBetween, rangeRandom } from './../../math-utils';
import LightFactory from './../../light';
import SceneObjectModel from './../../scene/model/SceneObjectModel';
import { MountainFactory, Mountain } from './../../mountain';
import generatorManagerConfig from '../generatorManagerConfig';
import CustomMesh from './../../custom-mesh';
import GeneratorManagerInterface from './GeneratorManagerInterface';
import SceneManagerInterface from '../../scene/manager/SceneManagerInterface';

class GeneratorManager implements GeneratorManagerInterface {
    private sceneManager: SceneManagerInterface;
    private mountainsData;
    private mountains: Mountain[];

    private globalLight;
    private shadowLight;

    constructor(sceneManager: SceneManagerInterface, mountainsData: Object[] = []) {
        this.sceneManager = sceneManager;
        this.mountainsData = mountainsData;
        this.mountains = [];

        this.addGlobalLight();
        this.addShadowLight();
        this.addFloor();
    }

    /**
     * @param data -> data to construct Mountain with
     */
    public addMountain(data: any): { sceneObject: SceneObjectModel } {
        const mountain = MountainFactory.create(data.id, data.height, data.thickness);
        const pos = {
            x: inBetween(data.x, generatorManagerConfig.layout.position.x.min, generatorManagerConfig.layout.position.x.max),
            z: inBetween(data.z, generatorManagerConfig.layout.position.z.min, generatorManagerConfig.layout.position.z.max)
        };

        const object = SceneObjectModel.create(
            data.id,
            mountain.mesh,
            {
                x: pos.x,
                z: pos.z,
                y: 0
            }
        );

        this.sceneManager.addElement(object);
        this.mountains.push(mountain);

        return {
            sceneObject: object
        };
    }

    /**
     * @param {boolean} animation whether shrink animation or not
     * @returns {Promise<T>}
     */
    public async clearAllMountains(animation: boolean = true) {
        this.mountains.forEach(async (mountainElement, index) => {
            animation ? await mountainElement.shrink(true, false) : Promise.resolve();
            this.sceneManager.removeElement(mountainElement.id);
        });

        this.mountains = [];
    }

    /**
     * @param {string} mountainId
     * @param {boolean} animation whether shrink animation or not
     */
    public async clearMountain(mountainId: string, animation: boolean = false) {
        this.mountains.map( async (mountainElement, i) => {
            if (mountainElement.id === mountainId) {
                animation ? await mountainElement.shrink(true, false) : Promise.resolve();

                this.mountains.splice(i, 1);
                this.sceneManager.removeElement(mountainId);
            }
        });
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

    /**
     * sets scene manager camera to requested position.
     * Currently, only string literals like "start" work,
     * @todo make position object {x,y,z} work as well
     * @param {string=start} position
     */
    public async setCamera(position: string| {x: number, y: number, z: number}) {
        if (position === 'start') {
            await this.sceneManager.setCameraToStart();
        }
    }

    /**
	* creates mountains from Array
	*/
    public createMountains(): { sceneObjects: SceneObjectModel[] }  {
        let mountainSceneObjects: SceneObjectModel[] = [];

        this.mountainsData.forEach((mountainData) => {
            mountainSceneObjects.push(this.addMountain(mountainData).sceneObject);
        });

        return {
            sceneObjects: mountainSceneObjects
        };
    }

    private addFloor(): void {
        const mesh =  CustomMesh.planeMesh(
            generatorManagerConfig.floor.dimensions.width,
            generatorManagerConfig.floor.dimensions.height,
            generatorManagerConfig.floor.dimensions.depth,
            generatorManagerConfig.floor.color);
        const geom: any = mesh.geometry;

        const vertices =  geom.vertices;

        for (let i = 0; i < vertices.length; i++) {
            let v = vertices[i];
            v.x += rangeRandom(-generatorManagerConfig.floor.randomShift, generatorManagerConfig.floor.randomShift);
            v.y += rangeRandom(-generatorManagerConfig.floor.randomShift, generatorManagerConfig.floor.randomShift);
            v.z += rangeRandom(-generatorManagerConfig.floor.randomShift, generatorManagerConfig.floor.randomShift);
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
}


export default GeneratorManager;
