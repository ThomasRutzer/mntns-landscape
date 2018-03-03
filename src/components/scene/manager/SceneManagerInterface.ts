interface SceneFactoryInterface {
    sceneElement: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.Renderer;
    addElement(element: any,
               position: {x: Number, y: Number})
        : void
    removeElement(id: string): void
}

export default SceneFactoryInterface;

