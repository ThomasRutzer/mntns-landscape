import * as THREE from 'three';
import clone from 'lodash.clonedeep';

import SceneMousemoveManagerInterface from './SceneMousemoveManagerInterface';
import CameraManager from '../../camera';
import CameraManagerInterface from "../../camera/manager/CameraManagerInteface";

import eventBus from './../../event-bus';
import sceneEvents from './../sceneEvents';

/**
 * Manager to control camera to current mouse move
 * Param reactiveAreaSize sets size of reactive area on each side
 * in percentage of current viewport width.
 *
 *
 * Viewport:
 *                      + reactive area: top    +
 *                      -------------------------
 *                      |                       |
 *                      |                       |
 * reactive area: left  |                       | reactive area: right
 *                      |                       |
 *                      |                       |
 *                      |                       |
 *                      -------------------------
 *                      + reactive area: bottom +
 *
 */
class SceneMousemoveManager implements SceneMousemoveManagerInterface {
    private mouseCoords: { x: number, y: number } = {x: 0, y: 0};
    private cameraManager: CameraManagerInterface;
    private scene: THREE.Scene;
    private reactiveAreaSize: { top: number, bottom: number, left: number, right: number };
    private options;

    private activated: boolean = true;

    /**
     * @param {THREE.Scene} scene
     * @param {CameraManagerInterface} cameraManager
     * @param {object} options
     * @namespace
     * @param {number} options.reactiveAreaSize
     * @param {number} options.zoomThreshold is max zoom of camera concerning
     * its initial position
     */
    constructor(scene: THREE.Scene,
                cameraManager: CameraManagerInterface,
                options: { reactiveAreaSize: number, zoomThreshold: number }) {
        this.scene = scene;
        this.cameraManager = cameraManager;

        this.options = {
            ...options,
            cameraInitialPos: clone(this.cameraManager.getStartPosition())
        };

        this.reactiveAreaSize = this.calcReactiveAreaSize(options.reactiveAreaSize);
        this.addListener();
    }

    public onRender() {
        const x = this.checkCameraHorizontal();
        const z = this.checkCameraVertical();

        this.cameraManager.setPosition({x, y: this.options.cameraInitialPos.y, z})
    }

    private onDeactivate() {
        this.activated = false;
    }

    /**
     * when activated, listen once for matching
     * event before capture movement again
     */
    private onActivate() {
        const listener = () => {
            this.activated = true;
            document.removeEventListener('touchstart', listener);
            document.removeEventListener('mousemove', listener);
        };

        document.addEventListener('touchstart', listener);
        document.addEventListener('mousemove', listener);
    }

    private addListener() {
        window.addEventListener('resize', () => this.calcReactiveAreaSize(this.options.reactiveAreaSize), false);
        eventBus.$on(sceneEvents.DEACTIVATED, this.onDeactivate.bind(this));
        eventBus.$on(sceneEvents.ACTIVATED, this.onActivate.bind(this));

        document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        document.addEventListener('touchstart', this.onDocumentTouchStart.bind(this), false);
        document.addEventListener('touchmove', this.onDocumentTouchMove.bind(this), false);
    }

    private checkCameraHorizontal(): number {
        if (!this.activated) {
            return this.cameraManager.getPosition().x;
        }

        if (this.mouseCoords.y > this.reactiveAreaSize.top && this.mouseCoords.y < this.reactiveAreaSize.bottom) {
            return this.cameraManager.getPosition().x;
        }

        const direction = this.mouseCoords.y > 0 ? -1 : 1;

        const noCameraMove = direction === -1
            ? this.cameraManager.getPosition().x < this.options.cameraInitialPos.x - this.options.zoomThreshold
            : this.cameraManager.getPosition().x > this.options.cameraInitialPos.x + this.options.zoomThreshold;

        if (!noCameraMove) {
            return this.cameraManager.getPosition().x + direction * 1.2;
        } else {
            return this.cameraManager.getPosition().x;
        }
    }

    private checkCameraVertical(): number {
        if (!this.activated) {
            return this.cameraManager.getPosition().z;
        }

        if (this.mouseCoords.x > this.reactiveAreaSize.left && this.mouseCoords.x < this.reactiveAreaSize.right) {
            return this.cameraManager.getPosition().z;
        }

        const direction = this.mouseCoords.x > 0 ? 1 : -1;

        const noCameraMove = direction === -1
            ? this.cameraManager.getPosition().z < this.options.cameraInitialPos.z - this.options.zoomThreshold
            : this.cameraManager.getPosition().z > this.options.cameraInitialPos.z + this.options.zoomThreshold;

        if (!noCameraMove) {
            return this.cameraManager.getPosition().z + direction * 1.2;
        } else {
            return this.cameraManager.getPosition().z;
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
        };
    }
}

export default SceneMousemoveManager;