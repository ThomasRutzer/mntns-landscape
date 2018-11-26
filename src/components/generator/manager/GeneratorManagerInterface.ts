import Mountain from '../../mountain/Mountain';
import SceneObjectModel from '../../scene/model/SceneObjectModel';

interface GeneratorManagerInterface {
	createMountains(): { sceneObjects: SceneObjectModel[] }
    addMountain(data: any): { sceneObject: SceneObjectModel };
    clearAllMountains();
    clearMountain(mountainId: string);
    findMountainById(id: string): Mountain | null,
    setCamera(position: string)
}

export default GeneratorManagerInterface;