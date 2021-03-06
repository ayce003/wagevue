import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: '',
        worker: {}
    },
    getters:{
        getToken(state){
            if(!state.token&&!sessionStorage.getItem('token')){
                return null;
            }
            if(!state.token){
                state.token=sessionStorage.getItem('token');
            }
            return state.token;
        },
        getWorker(state) {
            if (!state.worker.id && !sessionStorage.getItem('worker')) {
                return null;
            }
            if (!state.worker.id) {
                state.worker = JSON.parse(sessionStorage.getItem('worker'));
            }
            return state.worker;
        }

    },
    mutations: {
        setToken(state,token){
            state.token=token;
            sessionStorage.setItem('token',token);
        },
        setWorker(state, worker) {
            state.worker = worker;
            sessionStorage.setItem('worker', JSON.stringify(worker));
        },

        clearStore(state){
            state.token='';
            state.worker={};
            sessionStorage.clear();
        }
    },
    actions: {
        setToken({commit},token){
            commit('setToken',token);
        },
        setWorker({commit}, worker) {
            commit('setWorker', worker);
        },
        clearStore({commit}) {
            commit('clearStore');
        }
    }
})
