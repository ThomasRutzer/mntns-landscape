import Vue from 'vue';
import store from './store'

import './components/scene';
import './components/generator';
import './components/mountain';

let app = new Vue({
    el: '#app-main',
    store
});
