import Vue from 'vue'
import Vuex from 'vuex'
import state from './state';
import getters from './getters';
import mutations from './mutations';
import * as mutationTypes from './mutation-types';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    state,
    mutations,
    getters,
    strict: debug,
})

export {
    mutations,
    mutationTypes,
}