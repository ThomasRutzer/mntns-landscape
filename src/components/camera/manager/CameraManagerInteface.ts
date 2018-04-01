import * as THREE from 'three';

interface CameraManagerInterface {
    setToStart(): Promise<any>|null,
    setPosition(position: {x: number, y: number, z: number}, lookAt?: THREE.Vector3, tween?: boolean): Promise<any>|null,
    getCamera(),
    getStartPosition(): {x: number, y: number, z: number},
    getPosition():  {x: number, y: number, z: number}
}

export default CameraManagerInterface;