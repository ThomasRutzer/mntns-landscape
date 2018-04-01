import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch, Emit } from 'vue-property-decorator';
import { GeneratorManager, GeneratorManagerFactory } from './';
import { sceneEvents, SceneIntersectionModel } from './../scene';

@Component({
    template: require('./GeneratorComponent.html'),
})

export class GeneratorComponent extends Vue {
    private generatorManager: GeneratorManager;
    private sceneId: string = 'main';

    @Emit(sceneEvents.INTERSECTION)
    emitIntersections(data: SceneIntersectionModel): SceneIntersectionModel {
        return data;
    }

    @Prop()
    data: Object[];

    @Watch('data')
    async onDataChanged() {
        await this.generatorManager.clearAllMountains();
        this.data.forEach((mountainData) => {
            this.generatorManager.addMountain(mountainData);
        });
    }

    mounted() {
        this.generatorManager = GeneratorManagerFactory.create(this.sceneId, this.data);
    }

    /**
     * callback for intersection event
     * @param { Object } data
     */
    onIntersection(data: SceneIntersectionModel) {
        this.emitIntersections(data);
    }
}