import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from './modules/user'
import favourite from './modules/favourite'
import breadcrumbs from './modules/breadcrumbs'
import stats from './modules/stats'

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState()],
    modules: {
        user,
        favourite,
        breadcrumbs,
        stats
    }
})
