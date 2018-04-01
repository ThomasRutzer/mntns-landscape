import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch, Emit } from 'vue-property-decorator';
import GeneratorManager from './manager/GeneratorManager';
import Scene from '../scene/manager/SceneManager';
import { sceneEvents, SceneIntersectionModel } from './../scene';

@Component({
    template: require('./GeneratorComponent.html'),
})

export class GeneratorComponent extends Vue {
    private generatorManager: GeneratorManager;

    @Emit(sceneEvents.INTERSECTION)
    emitIntersections(data: SceneIntersectionModel): SceneIntersectionModel {
        return data;
    }

    @Prop()
    data: Object[];

    @Watch('data')
    async onDataChanged(val: Object[], oldVal: Object[]) {
        await this.generatorManager.clearAllMountains();
        this.data.forEach((mountainData) => {
            this.generatorManager.addMountain(mountainData);
        });
    }

    mounted() {
        const sceneElement: Scene = (<any>this.$refs.sceneComponent).sceneManager;
        this.generatorManager = new GeneratorManager(sceneElement, this.data);
    }

    /**
     * callback for intersection event
     * @param { Object } data
     */
    onIntersection(data: SceneIntersectionModel) {
        this.emitIntersections(data);
    }
}