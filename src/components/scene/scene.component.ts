import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import SceneFactory from './manager/SceneManager';

@Component({
    template: require('./scene.component.html'),
})

export class SceneComponent extends Vue {

    @Prop( { default:  () => { return {width: window.innerWidth, height: window.innerHeight} }})
    size: {width: Number, height: Number};

    @Prop({ required: true})
    camera: { type: string, position: Object, fieldOfView: number, nearPlane: number, farPlane: number };

    private scene;

    created() {
        this.scene =  SceneFactory.create(this.size.width, this.size.height, this.camera);
    }

    mounted() {
        const container: HTMLElement = document.getElementById('scene');
         container.appendChild(this.scene.renderer.domElement);
    }
}


