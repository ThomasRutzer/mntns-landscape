import {expect} from 'chai';
import SceneParticlesManager from './SceneParticlesManager';

describe('Scene Particles Manager', () => {
    let manager;

    before(() => {
        manager = new SceneParticlesManager(100, '#ffffff')
    });

    describe('constructor()', () => {
        it('holds the exact amount of particles as requested by param count', () => {
            expect(manager.particlesGroup.children.length).to.equal(100);
        });

        it('holds particles consisting of MeshBasicMaterials', () => {
          expect(manager.particlesGroup.children[0].material.type).to.equal('MeshBasicMaterial')
        });
    });

    describe('method onRender()', () => {
       it('rotates particlesGroup by fixed amount', () => {
           manager.onRender();

           expect(manager.particlesGroup.rotation.x).to.equal(0.0004);
           expect(manager.particlesGroup.rotation.y).to.equal(0.0002);
       })
    });
});