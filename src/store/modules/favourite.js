import Vue from 'vue'

const state = {
    characters: {},
    ratings: {},
    episodes: {}
}

const mutations = {
    addCharacter(state, char) {
        Vue.set(state.characters, char.id, {...char})
    },
    removeCharacter(state, id) {
        Vue.delete(state.characters, id)
    },
    addEpisode(state, ep) {
        Vue.set(state.episodes, ep.id, {...ep})
    },
    removeEpisode(state, id) {
        Vue.delete(state.episodes, id)
    },
    setRating(state, payload) {
        Vue.set(state.ratings, payload.id, payload.rating)
    },
}

const getters = {
    getRating: state => id => state.ratings[id] || 0,
    getCharacters: state => state.characters,
    getEpisodes: state => state.episodes,
    isFavouriteEpisode: state => id => Object.prototype.hasOwnProperty.call(state.episodes, id),
    isFavouriteCharacter: state => id => Object.prototype.hasOwnProperty.call(state.characters, id)
}

const actions = {
}

export default {
    state,
    getters,
    actions,
    mutations
}
