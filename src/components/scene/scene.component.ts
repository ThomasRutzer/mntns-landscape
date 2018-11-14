import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop, Emit, Watch} from 'vue-property-decorator';

import EventBus from './../event-bus';

import sceneEvents from './sceneEvents';
import SceneIntersectionModel from './model/SceneIntersectionModel';
import { SceneManagerFactory } from './';

@Component({
    template: require('./scene.component.html'),
})

export class SceneComponent extends Vue {

    @Emit(sceneEvents.INTERSECTION)
    intersections(data: SceneIntersectionModel): SceneIntersectionModel {
        return data;
    }

    @Prop()
    sceneId: string;

    @Prop()
    disabled: boolean;

    @Prop({ required: true})
    camera: { type: string, position: {x: number, y: number, z: number}, fieldOfView: number, nearPlane: number, farPlane: number };

    private sceneManager;

    @Watch('disabled')
    onDisabledUpdate(val, oldVal) {
        if (val === true) {
            EventBus.$emit(sceneEvents.DISABLED);
        } else {
            EventBus.$emit(sceneEvents.ENABLED);
        }
    }

    created() {
        this.sceneManager = SceneManagerFactory.create(this.sceneId, this.camera);
    }

    mounted() {
        const container: HTMLElement = document.getElementById('scene');
        const parent = container.parentNode;

        parent.replaceChild(this.sceneManager.renderer.domElement, container);

        EventBus.$on(sceneEvents.INTERSECTION, (data: SceneIntersectionModel) => {
            this.intersections(data);
        });

        this.onDisabledUpdate(this.disabled, null);
    }
}


