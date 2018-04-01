import Vue from 'vue';

import GeneratorManager from './manager/GeneratorManager';
import GeneratorManagerFactory from './manager/GeneratorManagerFactory';

import { GeneratorComponent } from './GeneratorComponent';
Vue.component('generator', GeneratorComponent);

export {
    GeneratorComponent,
    GeneratorManager,
    GeneratorManagerFactory
};
