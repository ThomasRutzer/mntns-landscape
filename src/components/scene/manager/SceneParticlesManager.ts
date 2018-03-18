import * as THREE from 'three';
import SceneParticlesManagerInterface from "./SceneParticlesManagerInterface";
import * as mathUtils from './../../math-utils';

class SceneParticlesManager implements SceneParticlesManagerInterface {
    public particlesGroup: THREE.Group;

    constructor(count, color) {
        this.particlesGroup = new THREE.Group();
        this.createParticles(count, color);
    }

    public onRender() {
        this.particlesGroup.rotation.x += 0.0004;
        this.particlesGroup.rotation.y += 0.0002;
    }

    private createParticles(count, color) {
        for (let i = 0; i < count; i++) {
            let geometry = new THREE.SphereBufferGeometry(mathUtils.rangeRandom(0.5,1));

            let material = new THREE.MeshBasicMaterial({
                color: color,
            });

            let particle = new THREE.Mesh(geometry, material);

            particle.position.x = mathUtils.rangeRandomInt(-window.innerWidth, window.innerWidth);
            particle.position.y = mathUtils.rangeRandomInt(-window.innerHeight, window.innerHeight);
            particle.position.z = mathUtils.rangeRandomInt(-300, 300);

            this.particlesGroup.add(particle);
        }
    }
}

export default SceneParticlesManager;