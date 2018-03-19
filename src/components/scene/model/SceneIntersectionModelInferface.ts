interface SceneIntersectionModelInterface {
    id: string;
    object: THREE.Object3D;
    event: { x: number, y: number, type: string};
}

export default SceneIntersectionModelInterface;
