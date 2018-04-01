import Vue from 'vue';

import { SceneComponent } from './scene.component';
import sceneEvents from './sceneEvents';

import SceneIntersectionModel from './model/SceneIntersectionModel';

import SceneManagerFactory from './manager/SceneManagerFactory';

Vue.component('scene', SceneComponent);

export {
    sceneEvents,
    SceneIntersectionModel,
    SceneManagerFactory
};
