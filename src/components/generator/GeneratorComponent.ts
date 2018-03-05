import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch, Emit } from 'vue-property-decorator';

import { mutationTypes } from './../../store';

import GeneratorManager from './manager/GeneratorManager';
import Scene from '../scene/manager/SceneManager';
import { sceneEvents } from './../scene';

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
        if(!this.activated) {
            this.$store.commit(mutationTypes.DEACTIVATE_SCENE);
        } else {
            this.$store.commit(mutationTypes.ACTIVATE_SCENE);
        }
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
        this.emitIntersections(data);
    }
}