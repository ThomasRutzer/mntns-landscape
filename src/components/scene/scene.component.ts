import Vue from 'vue';
import Component from 'vue-class-component';

import SceneManager from './manager/SceneManager';
import sceneEvents from './sceneEvents';
import {Prop, Emit} from "vue-property-decorator";

@Component({
    template: require('./scene.component.html'),
})

export class SceneComponent extends Vue {

    @Emit(sceneEvents.INTERSECTION)
    intersections(data){
        return data;
    }

    @Prop({ required: true})
    camera: { type: string, position: Object, fieldOfView: number, nearPlane: number, farPlane: number };

    private scene;

    created() {
        this.scene =  SceneManager.create(this.camera);
    }

    mounted() {
        const container: HTMLElement = document.getElementById('scene');
        const parent = container.parentNode;

        parent.replaceChild(this.scene.renderer.domElement, container);

        this.registerForSceneChanges();
    }

    registerForSceneChanges(): void {
        this.scene.registerForChanges().subscribe(({type, data}) => {
            this.intersections(data);
        });
    }
}


