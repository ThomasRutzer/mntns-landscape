import Mountain from '../../mountain/Mountain';

interface GeneratorManagerInterface {
    addMountain(data: any): void;
    clearAllMountains(): Promise<any>
    clearMountain(mountainId: string): Promise<any>;
    findMountainById(id: string): Mountain | null
}

export default GeneratorManagerInterface;