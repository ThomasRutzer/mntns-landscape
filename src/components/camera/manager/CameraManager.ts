import * as THREE from 'three';
import CameraFactory from './../factory/CameraFactory';
import TweenMax from 'gsap';
import CameraManagerInterface from "./CameraManagerInteface";

class CameraManager implements CameraManagerInterface {
    private camera;
    private startPosition: {x: number, y: number, z: number};
    private lookAtPos: THREE.Vector3;

    constructor(cameraOptions: {type: string, fieldOfView: number, aspectRatio: number, nearPlane: number, farPlane: number},
                position: { x: number, y: number, z: number },
                lookAtPos:  THREE.Vector3
                ) {

        this.camera = CameraFactory.create(
            cameraOptions.type,
            cameraOptions.fieldOfView,
            cameraOptions.aspectRatio,
            cameraOptions.nearPlane,
            cameraOptions.farPlane
        ).cameraElement;

        this.setPosition(position, lookAtPos, false);
        this.startPosition = position;
        this.lookAtPos = lookAtPos;

        window.addEventListener('resize', () => {
            this.handleResize();
        }, false);
    }

    public setToStart(): Promise<any> {
        return this.setPosition(this.startPosition, this.lookAtPos, true);
    }

    public setPosition(position: {x: number, y: number, z: number}, lookAt?: THREE.Vector3, tween?: boolean): Promise<any>|null {
        const lookAtPos = lookAt || this.lookAtPos;

        if(!tween) {
            this.camera.position.x = position.x;
            this.camera.position.y = position.y;
            this.camera.position.z = position.z;
            this.camera.lookAt(lookAtPos);
            return null;
        }

        let returnPromiseResolve = new Function();
        const returnPromise = new Promise((res) => {
            returnPromiseResolve = res;
        });

        TweenMax.to(this.camera.position, 1, {
            x: position.x,
            y: position.y,
            z: position.z,
            onComplete: () => {
                this.camera.lookAt(lookAtPos);
                returnPromiseResolve();
            }
        });

        return returnPromise;
    }

    public getStartPosition(): {x: number, y: number, z: number} {
        return this.startPosition;
    }

    public getPosition():  {x: number, y: number, z: number} {
        return this.camera.position;
    }

    public getCamera(): THREE.Camera {
        return this.camera;
    }

    private handleResize(): void {

        const dimensions = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        if (<THREE.PerspectiveCamera>this.camera) {
            this.camera.aspect = dimensions.width / dimensions.height;
            this.camera.updateProjectionMatrix();
        }
    }
}

export default CameraManager;