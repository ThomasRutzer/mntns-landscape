import * as THREE from 'three';

interface SceneManagerInterface {
    sceneElement: THREE.Scene;
    renderer: THREE.Renderer;
    addElement(element: any,
               position: {x: Number, y: Number})
        : void
    removeElement(id: string): void;
    getElements(),
    setCameraToStart(): Promise<any>
}

export default SceneManagerInterface;

