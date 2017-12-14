import Mountain from '../../mountain/Mountain';

interface GeneratorManagerInterface {
    addMountain(data: any): void;
    clearAllMountains(): Promise<any>
    clearMountain(mountainId: string): Promise<any>;
    findMountainById(id: string): {id: number, mountain: Mountain} | null
}

export default GeneratorManagerInterface;