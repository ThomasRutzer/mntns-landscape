import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import * as THREE from 'THREE';

import GeneratorManager from './manager/GeneratorManager';
import Scene from '../scene/manager/SceneManager';

@Component({
    template: require('./GeneratorComponent.html'),
})

export class GeneratorComponent extends Vue {
    private generatorManager;

    @Prop()
    data: Object[];

    mounted() {
        const sceneElement: Scene = (<any>this.$refs.sceneComponent).scene;
        this.generatorManager = new GeneratorManager(sceneElement, this.data);
    }
}