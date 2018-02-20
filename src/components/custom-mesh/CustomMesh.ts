import * as THREE from 'three';

class CustomMesh {
    static flatshadeGeometry(geom) {
        geom.computeFaceNormals();
        geom.faces.forEach((face) => {
            face.vertexNormals = [];
        });

        return new THREE.BufferGeometry().fromGeometry( geom );
    }

    static lathe(points: THREE.Vector3[], segments: number, color?: string): THREE.Mesh {
        // change the axis from z to y;
        let rotPoints = [];

        points.forEach((point) => {
            rotPoints.push( new THREE.Vector3( point.x, point.z, point.y ) );
        });

        let geom = new THREE.LatheGeometry( rotPoints, segments );
        geom.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2));

        const mat = new THREE.MeshPhongMaterial({
            color: color, vertexColors: THREE.VertexColors });
        CustomMesh.flatshadeGeometry(geom);

        return new THREE.Mesh(geom, mat);
    }

    static planeMesh(w,d,s,color): THREE.Mesh {
        let mat = new THREE.MeshLambertMaterial({
            color: color
        });

        let geom = new THREE.PlaneGeometry( w, d, s, s );
        CustomMesh.flatshadeGeometry(geom);
        return  new THREE.Mesh(geom, mat);
    }
}

export default CustomMesh;