import Vue from 'vue';
import TweenLite from 'gsap';
import * as ColorPropsPlugin from 'gsap/ColorPropsPlugin.js';
import * as EasePlugin from 'gsap/EasePack.js';

// register all GSAP plugins globally
// @ts-ignore
TweenPlugin.activate([ColorPropsPlugin, EasePlugin]);

import './components/scene';
import './components/generator';
import './components/mountain';

let app = new Vue({
    el: '#app-main',
});
