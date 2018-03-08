import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch, Emit } from 'vue-property-decorator';
import GeneratorManager from './manager/GeneratorManager';
import generatorEvents from './generatorEvents';
import Scene from '../scene/manager/SceneManager';
import { sceneEvents } from './../scene';

import EventBus from './../event-bus';

@Component({
    template: require('./GeneratorComponent.html'),
})

export class GeneratorComponent extends Vue {
    private generatorManager: GeneratorManager;

    @Emit(sceneEvents.INTERSECTION)
    emitIntersections(data){
        return data;
    }

    @Prop()
    data: Object[];

    @Prop({default: true})
    activated: boolean;

    // todo test with changing data
    @Watch('data')
    async onDataChanged(val: Object[], oldVal: Object[]) {
        await this.generatorManager.clearAllMountains();
        this.data.forEach((mountainData) => {
            this.generatorManager.addMountain(mountainData);
        });
    }

    @Watch('activated')
    updateActivation() {
        EventBus.$emit(generatorEvents.ACTIVATED, this.activated);
    }

    mounted() {
        const sceneElement: Scene = (<any>this.$refs.sceneComponent).sceneManager;
        this.generatorManager = new GeneratorManager(sceneElement, this.data);

        this.updateActivation();
    }

    /**
     * callback for intersection event
     * @param { Object } data
     */
    onIntersection(data) {
        if (!this.activated) return;

        console.log(data);

        this.emitIntersections(data);
    }
}