const state = {
    title: 'Rmkb'
}

const mutations = {
    setPageTitle(state, title) {
        state.title = title
    }
}

const getters = {
    getPageTitle: state => state.title
}

const actions = {
}

export default {
    state,
    getters,
    actions,
    mutations
}
