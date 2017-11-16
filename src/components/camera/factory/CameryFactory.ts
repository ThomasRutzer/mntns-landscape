import * as THREE from 'THREE';
import CameraFactoryInterface from './CameraFactoryInterface';

class CameraFactory implements CameraFactoryInterface {
    public cameraElement: THREE.Camera;

    static create(type, fieldOfView, aspectRatio, nearPlane, farPlane) {
        return new CameraFactory(type, fieldOfView, aspectRatio, nearPlane, farPlane);
    }

    constructor(type, fieldOfView, aspectRatio, nearPlane, farPlane) {
        switch (type) {
            case 'perspective':
                this.cameraElement = new THREE.PerspectiveCamera(
                    fieldOfView,
                    aspectRatio,
                    nearPlane,
                    farPlane
            );
        }
    }
}

export default CameraFactory;
