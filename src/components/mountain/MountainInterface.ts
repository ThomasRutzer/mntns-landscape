import * as THREE from 'three';

interface MountainFactoryInterface {
    mesh: THREE.Mesh
    shrink: Function,
    grow: Function,
}

export default MountainFactoryInterface;