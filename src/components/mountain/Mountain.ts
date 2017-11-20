import * as THREE from 'THREE';
import TweenMax from "gsap";

import clone from 'lodash.clonedeep';
import MountainInterface from './MountainInterface';
import { mathUtils } from '../../generics/utils';
import { CustomMesh } from './../custom-mesh';

class Mountain implements MountainInterface {
    public vectorPoints: THREE.Vector3[];
    private data: {
        geometryData: any
    };
    private states : {
        isShrunk: boolean;
    };

    public height: number;
    public thickness: number;
    public color: string;

    public radiusSegments: number;
    public verticalSegments: number;
    public shapeAngleStart: number;
    public shapeAngle: number;
    public shapeAmplitude: number;
    public freq: number;
    public segHeight: number;

    public mesh: THREE.Mesh;

    static create(height, thickness) {
        return new Mountain(height, thickness)
    }

    constructor(height: number, thickness:number) {
        this.vectorPoints = [];

        this.height = height;
        this.thickness = thickness;
        this.color = '#ccc';
        this.verticalSegments = 10;
        this.radiusSegments = 8;
        this.shapeAngleStart = 0.9;
        this.shapeAmplitude = 45;
        this.shapeAngle = Math.PI - this.shapeAngleStart;
        this.freq = this.shapeAngle / this.verticalSegments;
        this.segHeight = (this.height / this.verticalSegments);

        this.vectorPoints.push(new THREE.Vector3(0, 0, 0));
        let ty, tx, tz, i;
        ty = 0;
        for (i = 0; i < this.verticalSegments; i++) {
            tx = 30 - i * 3;
            tz = mathUtils.rangeRandom(0, 2);
            this.vectorPoints.push(new THREE.Vector3(tx,ty, tz));
            ty += this.segHeight;
        }

        this.vectorPoints.push(new THREE.Vector3(0, ty, 0));
        this.mesh = new THREE.Mesh();
        this.mesh = CustomMesh.lathe(this.vectorPoints, this.radiusSegments, this.color);

        let geom: any = this.mesh.geometry;
        geom.verticesNeedUpdate = true;

        this.data = {
            geometryData: clone(this.mesh.geometry)
        };

        this.states = {
            isShrunk: false
        };

        this.grow();
    }

    /**
     * @param {boolean} animation -> whether animate or grow instantly
     * @returns {Promise<T>}
     */
    grow(animation: boolean = true): Promise<any> {
        //create promise with resolve Callback
        // as method return
        let returnPromiseResolve = new Function();
        const returnPromise = new Promise((res) => {
            returnPromiseResolve = res;
        });

        // here will store actual
        // method implementation
        let progressGrow = null;

        // let´s check if we need
        // shrink first
        if (!this.states.isShrunk) {
            this.shrink().then(() => {
                progressGrow();
            })
        } else {
            progressGrow();
        }

        progressGrow = () => {
            if (!animation) {
                const geom: any = this.mesh.geometry;

                geom.vertices.forEach((vector, iterator) => {
                    vector.x = this.data.geometryData.vertices[iterator].x;
                    vector.y = this.data.geometryData.vertices[iterator].y;
                    vector.z = this.data.geometryData.vertices[iterator].z;
                });

                this.states.isShrunk = true;
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
                const yAnimationPromise = new Promise((res) =>{
                    yAnimationCompleteClb = res;
                });

                let xzAnimationCompleteClb = new Function();
                const xzAnimationPromise = new Promise((res) =>{
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

        return returnPromise;
    }

    /**
     * @param {boolean} animation -> whether animate or shrink instantly
     * @returns {Promise<T>}
     */
    shrink(animation: boolean = false): Promise<any> {
        //create promise with resolve Callback
        // as method return
        let returnPromiseResolve = new Function();
        const returnPromise = new Promise((res) => {
            returnPromiseResolve = res;
        });

        if (!animation) {
            const geom: any = this.mesh.geometry;

            geom.vertices.forEach((vector, iterator) => {
                vector.x = 0;
                vector.y = 0;
                vector.z = 0;
            });

            this.states.isShrunk = true;
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
            const yAnimationPromise = new Promise((res) =>{
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
            returnPromiseResolve();
        });


        return returnPromise;
    }
}
export default Mountain;
