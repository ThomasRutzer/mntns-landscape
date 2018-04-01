import * as THREE from 'three';
import CameraFactoryInterface from './CameraFactoryInterface';
import CameraFactoryTypes from './CameraFactoryTypes';

class CameraFactory implements CameraFactoryInterface {
    public cameraElement: THREE.Camera | THREE.PerspectiveCamera;

    static create(type, fieldOfView, aspectRatio, nearPlane, farPlane) {
        return new CameraFactory(type, fieldOfView, aspectRatio, nearPlane, farPlane);
    }

    constructor(type: string, fieldOfView: number, aspectRatio: number, nearPlane: number, farPlane: number) {
        switch (type) {
            case CameraFactoryTypes.PERSPECTIVE:
                this.cameraElement = new THREE.PerspectiveCamera(
                    fieldOfView,
                    aspectRatio,
                    nearPlane,
                    farPlane
                );
                break;

            default:
                this.cameraElement = new THREE.Camera();
        }
    }
}

export default CameraFactory;
