import * as THREE from 'three';
import TweenLite from 'gsap';
import clone from 'lodash.clonedeep';
import MountainInterface from './MountainInterface';
import MountainDataModel from './MountainDataModel';
import MountainConfig from './mountainConfig';
import * as mathUtils from './../math-utils';
import {CustomMesh} from './../custom-mesh';
import SceneEvents from '../scene/sceneEvents';
import EventBus from '../event-bus';

class Mountain implements MountainInterface {
    public id: string;
    public mesh: THREE.Mesh;

    private vectorPoints: THREE.Vector3[];
    private data: {
        geometryData: any,
        parameters: MountainDataModel,
    };

    private states: {
        isShrunk: boolean;
    };

    private materialTween: TweenLite.Tween;

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

    constructor(id: string, height: number, thickness: number) {
        this.id = id;
        this.vectorPoints = [];

        // store class states
        this.states = {
            isShrunk: false
        };

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
            this.vectorPoints.push(new THREE.Vector3(tx, ty, tz));
            ty += this.segHeight;
        }
        this.vectorPoints.push(new THREE.Vector3(0, ty, 0));

        this.mesh = new THREE.Mesh();
        this.mesh = CustomMesh.lathe(this.vectorPoints, this.radiusSegments, MountainConfig.appearance.color);

        let geom: any = this.mesh.geometry;
        geom.uvsNeedUpdate = true;

        // store clone of initial geometry data
        this.data.geometryData = clone(this.mesh.geometry);

        this.grow();

        EventBus.$on(SceneEvents.INTERSECTION, (e) => this.onIntersection(e));
    }

    /**
     * @param {boolean} animation -> whether animate or grow instantly
     * @returns {Promise<T>}
     */
    async grow(animation: boolean = true): Promise<any> {
        // create promise with resolve Callback
        // as method return
        let returnPromiseResolve = new Function();
        const returnPromise = new Promise((res) => {
            returnPromiseResolve = res;
        });

        // store actual grow method
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
                const yAnimationPromise = new Promise((res) => {
                    yAnimationCompleteClb = res;
                });

                let xzAnimationCompleteClb = new Function();
                const xzAnimationPromise = new Promise((res) => {
                    xzAnimationCompleteClb = res;
                });

                allPromises.push(yAnimationPromise);
                allPromises.push(xzAnimationPromise);

                TweenLite.to(vertice, 4, {
                    x: this.data.geometryData.vertices[iterator].x,
                    z: this.data.geometryData.vertices[iterator].z,
                    onUpdate: updateClb,
                    onComplete: xzAnimationCompleteClb,
                    // @ts-ignore Cannot find name 'Power2'.
                    ease: Power2.easeInOut
                });
                TweenLite.to(vertice, 6, {
                    y: this.data.geometryData.vertices[iterator].y,
                    onComplete: yAnimationCompleteClb,
                    // @ts-ignore Cannot find name 'Power2'.
                    ease: Power2.easeInOut,
                });
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
     * (otherwise, intersection on animated THREE objects is buggy)
     * @returns {Promise<T>}
     */
    async shrink(animation: boolean = true, invisible: boolean = true): Promise<any> {
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
            const yAnimationPromise = new Promise((res) => {
                yAnimationCompleteClb = res;
            });

            allPromises.push(yAnimationPromise);

            TweenLite.to(vertice, 0.8, {
                x: 0,
                y: 0,
                z: 0,
                onUpdate: updateClb,
                onComplete: yAnimationCompleteClb,
                // @ts-ignore Cannot find name 'Power2'.
                ease: Power2.easeInOut
            });
        });

        Promise.all(allPromises).then(() => {
            this.states.isShrunk = true;
            revertVisibility();
            returnPromiseResolve();
        });

        return returnPromise;
    }

    private onIntersection(eventData) {
        if (this.id === eventData.id) {
            if (this.materialTween) {
                return;
            } else {
                let o = {color: MountainConfig.appearance.color};
                this.materialTween = TweenLite.to(
                    o,
                    1,
                    {
                        colorProps: {color: MountainConfig.appearance.focusColor},
                        onUpdate: () => {
                            // @ts-ignore
                            this.mesh.material.color.set(o.color);
                        },
                        onReverseComplete: () => {
                            this.materialTween.kill();
                            this.materialTween = null;
                        }
                    }
                );
            }
        }
        else {
            if (this.materialTween) {
                this.materialTween.reverse();
            } else {
                return;
            }
        }
    }
}

export default Mountain;
