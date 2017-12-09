import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import SceneManager from './manager/SceneManager';

@Component({
    template: require('./scene.component.html'),
})

export class SceneComponent extends Vue {
    @Prop({ required: true})
    camera: { type: string, position: Object, fieldOfView: number, nearPlane: number, farPlane: number };

    private scene;

    created() {
        this.scene =  SceneManager.create(this.camera);
    }

    mounted() {
        const container: HTMLElement = document.getElementById('scene');
         container.appendChild(this.scene.renderer.domElement);
    }
}


