import Mountain from './Mountain';

class MountainFactory {
    static create(id: string, height: number, thickness: number) {
        return new Mountain(id, height, thickness);
    }
}

export default MountainFactory;