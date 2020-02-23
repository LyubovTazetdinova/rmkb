import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import favourite from './modules/favourite'
import breadcrumbs from './modules/breadcrumbs'

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState()],
    modules: {
        favourite,
        breadcrumbs
    }
})
