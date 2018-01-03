import Vue from 'vue';

import GeneratorManager from './manager/GeneratorManager';

import { GeneratorComponent } from './GeneratorComponent';
Vue.component('generator', GeneratorComponent);

export {
    GeneratorComponent,
    GeneratorManager
};
