import * as THREE from 'THREE';
import LightFactoryInterface from './factory/LightFactoryInterface';

export default class DirectionalLight implements LightFactoryInterface {
    public lightElement: THREE.Light;

    public static create(color: string, insity: number, options: Object) {
        return new DirectionalLight(color, insity, options);
    }

    constructor(color: string,
                intensity: number,
                options: any = {}) {
        this.lightElement = new THREE.DirectionalLight(color, intensity);
        this.lightElement.castShadow = options.castShadow ? options.castShadow : false;
    }
}