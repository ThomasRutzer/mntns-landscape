import * as THREE from 'three';

export default function toScreenPosition(obj, camera, renderer) {
    const vector = new THREE.Vector3();

    const widthHalf = 0.5 * renderer.context.canvas.width;
    const heightHalf = 0.5 * renderer.context.canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return {
        x: Math.round(vector.x),
        y: Math.round(vector.y)
    };
}
