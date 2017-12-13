import * as THREE from 'THREE';

interface MountainFactoryInterface {
    mesh: THREE.Mesh
    shrink: Function,
    grow: Function,
}

export default MountainFactoryInterface;