import * as THREE from 'THREE';

interface MountainFactoryInterface {
    thickness: Number,
    height: Number,
    vectorPoints: THREE.Vector[],
    mesh: THREE.Object3D
}

export default MountainFactoryInterface;