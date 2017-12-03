import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import GeneratorManager from './manager/GeneratorManager';
import Scene from '../scene/manager/SceneManager';

@Component({
    template: require('./GeneratorComponent.html'),
})

export class GeneratorComponent extends Vue {
    private generatorManager: GeneratorManager;

    @Prop()
    data: Object[];

    //todo test with changing data
    @Watch('data')
    async onDataChanged(val: Object[], oldVal: Object[]) {
        await this.generatorManager.clearAllMountains();
        this.data.forEach((mountainData) => {
            this.generatorManager.addMountain(mountainData);
        });
    }

    mounted() {
        const sceneElement: Scene = (<any>this.$refs.sceneComponent).scene;
        this.generatorManager = new GeneratorManager(sceneElement, this.data);
    }
}