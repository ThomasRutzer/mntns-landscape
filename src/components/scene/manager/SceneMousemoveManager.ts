import * as THREE from 'three';
import clone from 'lodash.clonedeep';

import SceneMousemoveManagerInterface from "./SceneMousemoveManagerInterface";

class SceneMousemoveManager implements SceneMousemoveManagerInterface {
    private mouseCoords: { x: number, y: number } = {x: 0, y: 0};
    private camera: THREE.Camera;
    private scene: THREE.Scene;
    private reactiveAreaSize: { top: number, bottom: number, left: number, right: number };
    private options;

    constructor(scene: THREE.Scene,
                camera: THREE.Camera,
                options: { reactiveAreaSize: number, zoomThreshold: number }) {
        this.scene = scene;
        this.camera = camera;

        this.options = {
            ...options,
            cameraInitialPos: clone(camera.position)
        };

        this.reactiveAreaSize = this.calcReactiveAreaSize(options.reactiveAreaSize);
        this.addListener();
    }

    public onRender() {

        this.camera.position.x = this.checkCameraHorizontal();
        this.camera.position.z = this.checkCameraVertical();

        this.camera.lookAt(this.scene.position);
    }

    private addListener() {
        window.addEventListener('resize', () => this.calcReactiveAreaSize(this.options.reactiveAreaSize), false);

        document.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
        document.addEventListener('touchstart', (e) => this.onDocumentTouchStart(e), false);
        document.addEventListener('touchmove', (e) => this.onDocumentTouchMove(e), false);
    }

    private checkCameraHorizontal(): number {
        if (this.mouseCoords.y > this.reactiveAreaSize.top && this.mouseCoords.y < this.reactiveAreaSize.bottom) {
            return this.camera.position.x;
        }
        const direction = this.mouseCoords.y > 0 ? -1 : 1;

        const noTween = direction == -1
            ? this.camera.position.x < this.options.cameraInitialPos.x - this.options.zoomThreshold
            : this.camera.position.x > this.options.cameraInitialPos.x + this.options.zoomThreshold;

        if (!noTween) {
            return this.camera.position.x + direction * 1.2;
        } else {
            return this.camera.position.x;
        }
    }

    private checkCameraVertical(): number {
        if (this.mouseCoords.x > this.reactiveAreaSize.left && this.mouseCoords.x < this.reactiveAreaSize.right) {
            return this.camera.position.z;
        }

        const direction = this.mouseCoords.x > 0 ? 1 : -1;

        const noTween = direction == -1
            ? this.camera.position.z < this.options.cameraInitialPos.z - this.options.zoomThreshold
            : this.camera.position.z > this.options.cameraInitialPos.z + this.options.zoomThreshold;

        if (!noTween) {
            return this.camera.position.z + direction * 1.2;
        } else {
            return this.camera.position.z;
        }
    }

    /**
     * store mouse coords on each move
     * @param {Event} event -> mouse event
     */
    private onMouseMove(event) {
        this.mouseCoords.x = ( event.clientX - window.innerWidth / 2 );
        this.mouseCoords.y = ( event.clientY - window.innerHeight / 2 );
    }

    private onDocumentTouchStart(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            this.mouseCoords.x = event.touches[0].pageX - window.innerWidth / 2;
            this.mouseCoords.y = event.touches[0].pageY - window.innerHeight / 2;
        }
    }

    private onDocumentTouchMove(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            this.mouseCoords.x = event.touches[0].pageX - window.innerWidth / 2;
            this.mouseCoords.y = event.touches[0].pageY - window.innerHeight / 2;
        }
    }

    private calcReactiveAreaSize(size: number): {
        top: number,
        bottom: number,
        left: number,
        right: number
    } {
        const horizontal = Math.round(window.innerHeight / 2 - (window.innerHeight) * (size / 100));
        const vertical = Math.round(window.innerWidth / 2 - (window.innerWidth) * (size / 100));

        return {
            top: -horizontal,
            bottom: horizontal,
            left: -vertical,
            right: vertical
        }
    }
}

export default SceneMousemoveManager;