import * as THREE from 'THREE';
import LightFactoryInterface from './LightFactoryInterface';

export default class GlobalLightFactory implements LightFactoryInterface {
    public lightElement: THREE.Light;

    public static create(skyColor, groundColor, intensity) {
        return new GlobalLightFactory(skyColor, groundColor, intensity);
    }

    constructor(skyColor, groundColor, intensity) {
        this.lightElement = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    }
}