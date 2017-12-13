import Vue from 'vue';

import { SceneComponent } from './scene.component';
import sceneEvents from './sceneEvents';

Vue.component('scene', SceneComponent);

export {
    sceneEvents,
    SceneComponent
};
