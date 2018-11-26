import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch, Emit } from 'vue-property-decorator';
import { GeneratorManager, GeneratorManagerFactory } from './';
import { sceneEvents, SceneIntersectionModel } from './../scene';
import SceneObjectModel from '../scene/model/SceneObjectModel';
import generatorEvents from './generatorEvents';

@Component({
    template: require('./GeneratorComponent.html'),
})

export class GeneratorComponent extends Vue {
    private generatorManager: GeneratorManager;
    private isMounted: boolean = false;
    private mountainsSceneObjects: SceneObjectModel[] = [];

    @Emit(sceneEvents.INTERSECTION)
    emitIntersections(data: SceneIntersectionModel): SceneIntersectionModel {
        return data;
    }

    @Emit(generatorEvents.CREATED)
    emitCreated() {
        return this.mountainsSceneObjects;
    }

    @Prop({required: true})
    generatorId: string;

    @Prop()
    data: Object[];

    @Prop()
    disabled: boolean;

    @Watch('data')
    async onDataChanged() {
        if (!this.isMounted) {
            return Promise.resolve();
        }

        return this.createFromData();
    }

    mounted() {
        this.generatorManager = GeneratorManagerFactory.create(this.generatorId, this.data);
        this.createFromData();
        this.isMounted = true;
    }

    async destroyed() {
        await this.generatorManager.clearAllMountains();
    }

    private async createFromData() {
        await this.generatorManager.clearAllMountains();
        this.mountainsSceneObjects = [];
		this.mountainsSceneObjects = this.generatorManager.createMountains(this.data).sceneObjects;
        this.emitCreated();
    }

    /**
     * callback for intersection event
     * @param { Object } data
     */
    private onIntersection(data: SceneIntersectionModel) {
        this.emitIntersections(data);
    }
}
