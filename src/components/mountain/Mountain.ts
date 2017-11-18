import * as THREE from 'THREE';
import MountainInterface from './MountainInterface';
import { mathUtils } from '../../generics/utils';
import { CustomMesh } from './../custom-mesh';

class Mountain implements MountainInterface {
    public vectorPoints: THREE.Vector3[];

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

    public mesh: THREE.Object3D;

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
            this.vectorPoints.push(new THREE.Vector3(tx, ty, tz));
            ty += this.segHeight;
        }

        this.vectorPoints.push(new THREE.Vector3(0, ty, 0));
        this.mesh = new THREE.Object3D();

        this.mesh = CustomMesh.lathe(this.vectorPoints, this.radiusSegments, this.color);
    }
}

export default Mountain;
