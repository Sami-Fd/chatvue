import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {},
        userDisc: [],
        receiver: "",
    },
    mutations: {
        setUserDisc(state, newvalue) {
            state.userDisc = newvalue;
        },
        setUser(state, newvalue) {
            state.user = newvalue;
        },
        setReceiver(state, newvalue) {
            state.receiver = newvalue;
        },
    },
    getters: {
        getUserDisc(state) {
            return state.userDisc;
        },
        getUser(state) {
            return state.user;
        },
        getReceiver(state) {
            return state.receiver;
        },
    },
});