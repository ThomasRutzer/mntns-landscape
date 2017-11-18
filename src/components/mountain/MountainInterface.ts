import * as THREE from 'THREE';

interface MountainFactoryInterface {
    thickness: Number,
    height: Number,
    points: THREE.Vector[],
    mountainElement: THREE.Object3D
}

export default MountainFactoryInterface;