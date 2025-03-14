import { createStore } from 'vuex'
import {getStorage, delStorage, setStorage} from "@/utils/localStorage";

const user = getStorage('user')

export default createStore({
    state: {
        userInfo: user || Object.create(null),
    },
    getters: {
        token: (state) => state.userInfo.token,
        isLogin: (state) => Boolean(state.userInfo.token),
        userInfo: (state) => state.userInfo,
    },
    mutations: {
        SET_USER_INFO: (state, data) => (state.userInfo = data),
    },
    actions: {
        setUserInfo({ commit }, data) {
            setStorage('user', data)
            commit('SET_USER_INFO', data)
        },
        clearUserInfo({ commit }) {
            delStorage('user')
            commit('SET_USER_INFO', Object.create(null))
        },
    },
    modules: {
    }
})
