import Vue from 'vue';
import VueRouter from 'vue-router';

import './sass/main.scss';

import './components/scene';
import './components/generator';
import './components/mountain';
import { ShowComponent } from './components/show';
import { CreateComponent } from './components/create';


// register the plugin
Vue.use(VueRouter);

let router = new VueRouter({
  routes: [
    { path: '/show', component: ShowComponent },
    { path: '/create', component: CreateComponent },
  ]
});

let app = new Vue({
  el: '#app-main',
  router: router,
});
