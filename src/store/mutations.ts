import * as types from './mutation-types';

const mutations = {
    [types.SAVE_INTERSECTED_OBJECT](state, payload) {
        state.scene.intersectedObject = payload;
    },

    [types.DELETE_INTERSECTED_OBJECT](state) {
        state.scene.intersectedObject = null;
    },

    [types.ACTIVATE_SCENE](state) {
        state.scene.activated = true;
    },

    [types.DEACTIVATE_SCENE](state) {
        state.scene.activated = false;
    }
};

export default mutations;