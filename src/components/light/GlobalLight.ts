import * as THREE from 'THREE';
import LightFactoryInterface from './factory/LightFactoryInterface';

export default class GlobalLight implements LightFactoryInterface {
    public lightElement: THREE.Light;

    public static create(skyColor, groundColor, intensity) {
        return new GlobalLight(skyColor, groundColor, intensity);
    }

    constructor(skyColor: string, groundColor: string, intensity: number) {
        this.lightElement = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    }
}