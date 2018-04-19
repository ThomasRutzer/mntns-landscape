import * as THREE from  'three';
import {expect} from 'chai';
import toScreenPosition from './to-screen-postion';

describe('toScreenPosition', () => {

   it('converts vector data as expected', () => {
       const object3D = new THREE.Object3D();

       const camera = new THREE.Camera();
       const renderer = new THREE.WebGLRenderer();

       renderer.context.canvas.width = 1000;
       renderer.context.canvas.height = 1000;

       const data2D = toScreenPosition(object3D, camera, renderer);
       expect(data2D).to.equal({x: 500, y: 500});
   })
});