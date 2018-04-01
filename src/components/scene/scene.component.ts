import Vue from 'vue';
import Component from 'vue-class-component';

import EventBus from './../event-bus';

import sceneEvents from './sceneEvents';
import SceneIntersectionModel from './model/SceneIntersectionModel';
import {Prop, Emit} from 'vue-property-decorator';
import { SceneManagerFactory } from './';

@Component({
    template: require('./scene.component.html'),
})

export class SceneComponent extends Vue {

    @Emit(sceneEvents.INTERSECTION)
    intersections(data: SceneIntersectionModel): SceneIntersectionModel {
        return data;
    }

    @Prop({ required: true})
    camera: { type: string, position: {x: number, y: number, z: number}, fieldOfView: number, nearPlane: number, farPlane: number };

    private sceneManager;

    created() {
        this.sceneManager = SceneManagerFactory.create("main", this.camera);
    }

    mounted() {
        const container: HTMLElement = document.getElementById('scene');
        const parent = container.parentNode;

        parent.replaceChild(this.sceneManager.renderer.domElement, container);

        EventBus.$on(sceneEvents.INTERSECTION, (data: SceneIntersectionModel) => {
            this.intersections(data);
        });
    }
}


