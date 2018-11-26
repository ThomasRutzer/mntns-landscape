import * as THREE from 'three';
import SceneObjectModelInterface from '../model/SceneObjectModelInferface';

interface SceneManagerInterface {
    sceneElement: THREE.Scene;
    renderer: THREE.Renderer;
	addElement(newElement: SceneObjectModelInterface): void,
    removeElement(id: string): void;
    getElements(),
    setCameraToStart(): Promise<any>
}

export default SceneManagerInterface;

