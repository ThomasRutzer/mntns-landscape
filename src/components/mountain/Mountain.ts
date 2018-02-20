import * as THREE from 'three';
import TweenMax from 'gsap';

import clone from 'lodash.clonedeep';
import MountainInterface from './MountainInterface';
import MountainDataModel from './MountainDataModel';
import MountainConfig from './MountainConfig';
import * as mathUtils from './../math-utils';
import { CustomMesh } from './../custom-mesh';

class Mountain implements MountainInterface {
    private vectorPoints: THREE.Vector3[];
    private data: {
        geometryData: any,
        parameters: MountainDataModel,
    };
    private states: {
        isShrunk: boolean;
    };

    private height: number;
    private thickness: number;
    private color: string;

    private radiusSegments: number;
    private verticalSegments: number;
    private shapeAngleStart: number;
    private shapeAngle: number;
    private shapeAmplitude: number;
    private freq: number;
    private segHeight: number;

    private link: string;

    public mesh: THREE.Mesh;

    static create(height: number, thickness: number, link?: string) {
        return new Mountain(height, thickness, link);
    }

    constructor(height: number, thickness: number, link?: string) {
        this.vectorPoints = [];

        // store class states
        this.states = {
            isShrunk: false
        };

        this.link = link || null;

        // create internal object for all data
        this.data = {
            parameters: null,
            geometryData: null,
        };
        this.data.parameters = MountainDataModel.create(thickness, height);

        // this could all be parameters
        this.height = this.data.parameters.height;
        this.thickness = this.data.parameters.thickness;
        this.color = MountainConfig.appearance.color;
        this.verticalSegments = MountainConfig.parameters.verticalSegments.default;
        this.radiusSegments = mathUtils.rangeRandomInt(MountainConfig.parameters.radiusSegments.min, MountainConfig.parameters.radiusSegments.max);
        this.shapeAngleStart = MountainConfig.parameters.shapeAngleStart.default;
        this.shapeAmplitude = MountainConfig.parameters.shapeAmplitude.default;
        this.shapeAngle = Math.PI - this.shapeAngleStart;
        this.freq = this.shapeAngle / this.verticalSegments;
        this.segHeight = (this.height / this.verticalSegments);

        this.vectorPoints.push(new THREE.Vector3(0, 0, 0));
        let ty, tx, tz, i;
        ty = 0;
        for (i = 0; i < this.verticalSegments; i++) {
            tx = 30 - i * 3;
            tz = mathUtils.rangeRandom(0, 2);
            this.vectorPoints.push( new THREE.Vector3(tx, ty, tz) );
            ty += this.segHeight;
        }
        this.vectorPoints.push(new THREE.Vector3(0, ty, 0));

        this.mesh = new THREE.Mesh();
        this.mesh = CustomMesh.lathe(this.vectorPoints, this.radiusSegments);

        let geom: any = this.mesh.geometry;
        geom.uvsNeedUpdate = true;

        // store clone of initial geometry data
        this.data.geometryData = clone(this.mesh.geometry);

        this.grow();
    }

    /**
     * @param {boolean} animation -> whether animate or grow instantly
     * @returns {Promise<T>}
     */
    grow(animation: boolean = true): Promise<any> {
        // create promise with resolve Callback
        // as method return
        let returnPromiseResolve = new Function();
        const returnPromise = new Promise((res) => {
            returnPromiseResolve = res;
        });

        // here will store actual
        // method implementation
        let progressGrow = () => {
                if (!animation) {
                    const geom: any = this.mesh.geometry;

                    geom.vertices.forEach((vector, iterator) => {
                        vector.x = this.data.geometryData.vertices[iterator].x;
                        vector.y = this.data.geometryData.vertices[iterator].y;
                        vector.z = this.data.geometryData.vertices[iterator].z;
                    });

                    this.states.isShrunk = false;
                    returnPromiseResolve();
                }

                // here will store Callback of each tween
                // to have a neatly reminder,
                // when all Tweens have finished
                const allPromises: Promise<any> | any = [];

                // each tweens update callback
                const updateClb = () => {
                    let geom: any = this.mesh.geometry;
                    geom.verticesNeedUpdate = true;
                };

                const geom: any = this.mesh.geometry;

                geom.vertices.forEach((vertice, iterator) => {
                    // workaround for current native Promise,
                    // to resolve it later
                    let yAnimationCompleteClb = new Function();
                    const yAnimationPromise = new Promise( (res) => {
                        yAnimationCompleteClb = res;
                    });

                    let xzAnimationCompleteClb = new Function();
                    const xzAnimationPromise = new Promise( (res) => {
                        xzAnimationCompleteClb = res;
                    });

                    allPromises.push(yAnimationPromise);
                    allPromises.push(xzAnimationPromise);

                    TweenMax.to(vertice, 4, {
                        x:  this.data.geometryData.vertices[iterator].x,
                        z:  this.data.geometryData.vertices[iterator].z,
                        onUpdate: updateClb,
                        onComplete: xzAnimationCompleteClb});
                    TweenMax.to(vertice, 6, {
                        y: this.data.geometryData.vertices[iterator].y,
                        onComplete: yAnimationCompleteClb});
                });

                Promise.all(allPromises).then(() => {
                    this.states.isShrunk = false;
                    returnPromiseResolve();
                });
            };

        // let´s check if we need
        // shrink first
        if (!this.states.isShrunk) {
            this.shrink().then(() => {
                progressGrow();
            });
        } else {
            progressGrow();
        }

        return returnPromise;
    }

    /**
     * @param {boolean} animation -> whether animate or shrink instantly
     * @param {boolean} invisible -> if true, will set material invisible (transparant / opacity 0) and reverts this when complete
     * @returns {Promise<T>}
     */
    shrink(animation: boolean = true, invisible: boolean = true): Promise<any> {
        // create promise with resolve Callback
        // as method return
        let returnPromiseResolve = new Function();
        const returnPromise = new Promise((res) => {
            returnPromiseResolve = res;
        });

        const revertVisibility = () => {
            if (!invisible) {
                return;
            }

            let material: any = this.mesh.material;
            material.transparent = false;
            material.opacity = 1;
        };

        // bug fix! invisible but animated shrink
        // otherwise raycaster does not intersect object
        if (invisible) {
            let material: any = this.mesh.material;
            material.transparent = true;
            material.opacity = 0;
        }

        if (!animation) {
            const geom: any = this.mesh.geometry;

            geom.vertices.forEach((vector) => {
                vector.x = 0;
                vector.y = 0;
                vector.z = 0;

                geom.verticesNeedUpdate = true;
            });

            this.states.isShrunk = true;
            revertVisibility();
            returnPromiseResolve();
        }

        // here will store Callback of each tween
        // to have a neatly reminder,
        // when all Tweens have finished
        const allPromises: Promise<any> | any = [];

        // each tweens update callback
        const updateClb = () => {
            let geom: any = this.mesh.geometry;
            geom.verticesNeedUpdate = true;
        };

        const geom: any = this.mesh.geometry;

        geom.vertices.forEach((vertice) => {
            // workaround for current native Promise,
            // to resolve it later
            let yAnimationCompleteClb = new Function();
            const yAnimationPromise = new Promise( (res) => {
                yAnimationCompleteClb = res;
            });

            allPromises.push(yAnimationPromise);

            TweenMax.to(vertice, 0.8, {
                x:  0,
                y:  0,
                z:  0,
                onUpdate: updateClb,
                onComplete: yAnimationCompleteClb
            });
        });

        Promise.all(allPromises).then(() => {
            this.states.isShrunk = true;
            revertVisibility();
            returnPromiseResolve();
        });

        return returnPromise;
    }

    public clicked() {
        if (this.link) {
            window.open(this.link);
        }
    }
}
export default Mountain;
