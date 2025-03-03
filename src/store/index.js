import { createStore } from 'vuex'
import {getStorage, setStorage} from "@/utils/localStorage";

const user = getStorage('user')

export default createStore({
    state: {
        userInfo: user || Object.create(null),
    },
    getters: {
        isLogin: (state) => Boolean(state.userInfo.token),
    },
    mutations: {
    },
    actions: {
        setUserInfo({ commit }, data) {
            setStorage('user', data)
            commit('SET_USER_INFO', data)
        },
    },
    modules: {
    }
})
