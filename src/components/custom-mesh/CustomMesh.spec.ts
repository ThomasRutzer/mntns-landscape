import {expect, should} from 'chai';
import CustomMesh from './CustomMesh';
import * as THREE from 'three';
import {BufferGeometry} from "three";

describe('Custom Mesh', () => {
    describe('static method flatshadeGeometry()', () => {
        it('returns THREE Buffergeom', () => {
            let mesh = CustomMesh.flatshadeGeometry(new THREE.Geometry());

            expect(mesh.type).to.equal('BufferGeometry');
        })
    });

    describe('static method lathe()', () => {
        it('returns THREE Mesh', () => {
            let mesh = CustomMesh.lathe([new THREE.Vector3(1, 1, 1)], 2, '#000');

            expect(mesh.type).to.equal('Mesh');
        });
    });

    describe('static method planeMesh()', () => {
        it('returns THREE Mesh', () => {
            let mesh = CustomMesh.planeMesh(1,1,1, '#FFF');

            expect(mesh.type).to.equal('Mesh');
        });

        it('turns z prop of given points into negative number to change axis from z to y', () => {
            let zCoord1, zCoord2:number;
            let geom:any;
            let mesh = CustomMesh.lathe([new THREE.Vector3(1, 8, 1), new THREE.Vector3(1, 8, 5)], 1,'#000');

            geom = mesh.geometry;
            zCoord1 = Math.round(geom.vertices[0].z);
            zCoord2 = Math.round(geom.vertices[1].z);

            expect(zCoord1).to.equal(-1);
            expect(zCoord2).to.equal(-5);
        });

        it('multiplies each given point by number of given segments', () => {
            let geom:any;
            let mesh = CustomMesh.lathe([new THREE.Vector3(1, 8, 1), new THREE.Vector3(1, 8, 5)], 4, '#000');

            geom = mesh.geometry;

            expect(geom.vertices.length).to.equal(8);
        });
    });
});