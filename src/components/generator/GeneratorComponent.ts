import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import * as THREE from 'THREE';

import GeneratorManager from './manager/GeneratorManager';

@Component({
    template: require('./GeneratorComponent.html'),
})

export class GeneratorComponent extends Vue {
    private generatorManager;

    mounted() {
        const sceneElement: THREE.Scene =  (<any>this.$refs.sceneComponent).scene;
        this.generatorManager = new GeneratorManager(sceneElement);
    }
}