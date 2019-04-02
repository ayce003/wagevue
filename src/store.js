import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: '',
        perms:[]
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
        }

    },
    mutations: {
        setToken(state,token){
            state.token=token;
            sessionStorage.setItem('token',token);
        },

        clearStore(state){
            state.token='';
            sessionStorage.clear();
        }
    },
    actions: {
        setToken({commit},token){
            commit('setToken',token);
            sessionStorage.setItem('token',token);
        }
    }
})
