import Mountain from '../../mountain/Mountain';

interface GeneratorManagerInterface {
    addMountain(data: any);
    clearAllMountains();
    clearMountain(mountainId: string);
    findMountainById(id: string): Mountain | null
}

export default GeneratorManagerInterface;