import * as THREE from 'three';

interface SceneObjectModelInferface {
    id: String,
    object: THREE.Object3D
    position:  {x: number, y: number, z: number },
	screenPosition?: { x: number, y: number }
}

export default SceneObjectModelInferface;
