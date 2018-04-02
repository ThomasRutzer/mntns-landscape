import Vue from 'vue';

import { SceneComponent } from './scene.component';
import sceneEvents from './sceneEvents';
import sceneConfig from './sceneConfig';

import SceneIntersectionModel from './model/SceneIntersectionModel';

import SceneManagerFactory from './factory/SceneManagerFactory';

Vue.component('scene', SceneComponent);

export {
    sceneEvents,
    sceneConfig,
    SceneIntersectionModel,
    SceneManagerFactory
};
