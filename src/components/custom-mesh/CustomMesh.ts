import * as THREE from 'THREE';

class CustomMesh {
    static flatshadeGeometry(geom): THREE.BufferGeometry {
        geom.computeFaceNormals();
        geom.faces.forEach((face) => {
            face.vertexNormals = [];
        });

        return new THREE.BufferGeometry().fromGeometry( geom );
    }

    static lathe(points,segments, color){
        // change the axis from z to y;
        let rotPoints = [];

        points.forEach((point) => {
            rotPoints.push( new THREE.Vector3( point.x, point.z, point.y ) );
        });

        let geom = new THREE.LatheGeometry( rotPoints, segments );
        geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

        var mat = new THREE.MeshLambertMaterial({
            color: color
        });
        CustomMesh.flatshadeGeometry(geom);
        return new THREE.Mesh(geom, mat);
    }
};

export default CustomMesh;