import * as THREE from 'three';
import {stub} from 'sinon';
import {expect} from 'chai';

import eventBus from '../../event-bus';
import SceneIntersectionObserver from './SceneIntersectionObserver';
import SceneObjectModel from '../model/SceneObjectModel';
import sceneEvents from '../sceneEvents';

describe('SceneIntersectionObserver', () => {
    let manager;

    before(() => {

        let renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });

        stub(renderer.domElement, 'clientWidth').value(1000);
        stub(renderer.domElement, 'clientHeight').value(1000);

        let models = [
            SceneObjectModel.create('1', new THREE.Mesh()),
            SceneObjectModel.create('2', new THREE.Mesh()),
            SceneObjectModel.create('3', new THREE.Mesh())
        ];

        manager = new SceneIntersectionObserver(new THREE.PerspectiveCamera(), renderer);
        manager.addSceneElements(models);
    });

    describe('method broadcastChanges()', () => {
        it('uses eventBus to emit intersection event', () => {
            let intersectionCount = 0;
            eventBus.$on(sceneEvents.INTERSECTION, () => {
                intersectionCount++;
            });

            <any>manager.broadcastChanges({});

            expect(intersectionCount).to.equal(1)
        });
    });
});