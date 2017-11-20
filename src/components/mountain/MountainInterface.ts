import * as THREE from 'THREE';

interface MountainFactoryInterface {
    thickness: Number,
    height: Number,
    vectorPoints: THREE.Vector[],
    mesh: THREE.Mesh
    shrink: Function,
    grow: Function,
}

export default MountainFactoryInterface;