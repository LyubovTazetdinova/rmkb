import axios from 'axios'

const state = {
    allEpisodes: [],
    allCharacters: [],
    caractersByEpisodeData: {},
    charsByEpisodeReady: false,
    racesData: {},
    genderData: {},
    statusData: {},
    locationsData: {},
    charactersDataReady: false
}

const mutations = {
    setCharactersDataReady(state, val) {
        state.charactersDataReady = val
    },
    setCharsByEpisodeReady(state, val) {
        state.charsByEpisodeReady = val
    },
    setAllEpisodes(state, episodes) {
        episodes.forEach(episode => {
            state.allEpisodes[episode.id - 1] = episode
        });
    },
    setAllCharacters(state, chars) {
        chars.forEach(char => {
            state.allCharacters[char.id - 1] = char
        });
    },
    setCharactersByEpisode(state, payload) {
        state.caractersByEpisodeData = payload
    },
    setRaces(state, payload) {
        state.racesData = payload
    },
    setGenders(state, payload) {
        state.genderData = payload
    },
    setStatuses(state, payload) {
        state.statusData = payload
    },
    setLocations(state, payload) {
        state.locationsData = payload
    },
}

const getters = {
    getCharactersBySeason: state => season => state.caractersByEpisodeData[season],
    getCharactersByEpisode: state => state.caractersByEpisodeData,
    getRaces: state => state.racesData,
    getGenders: state => state.genderData,
    getLocations: state => state.locationsData,
    getStatuses: state => state.statusData,
    getGetCharsByEpisodeReady: state => state.charsByEpisodeReady,
    getCharactersDataReady: state => state.charactersDataReady
}

const actions = {
    prepareStats({commit, dispatch, state}) {
        commit('setCharsByEpisodeReady', false)
        commit('setCharactersDataReady', false)

        if (state.allEpisodes.length === 0) {
            dispatch('getAllEpisodes', { page: 1 })
        } else {
            // instant commit call doesn't trigger the watch property of the component for some reason ¯\_(ツ)_/¯
            setTimeout(function() {
                commit('setCharsByEpisodeReady', true)
            }, 100)
        }

        if (state.allCharacters.length === 0) {
            dispatch('getAllCharacters', { page: 1 })
        } else {
            setTimeout(function() {
                commit('setCharactersDataReady', true)
            }, 100)
        }
    },
    getAllEpisodes({commit, dispatch}, payload) {
        axios.get('episode/', {
            params: {
                page: payload.page
            }
        })
        .then((response) => {
            commit('setAllEpisodes', response.data.results)

            if (response.data.info.next !== '') {
                payload.page++
                dispatch('getAllEpisodes', payload)
            } else {
                dispatch('prepareCharactersByEpisodeData')
            }
        })
    },
    getAllCharacters({commit, dispatch}, payload) {
        axios.get('character/', {
            params: {
                page: payload.page
            }
        })
        .then((response) => {
            commit('setAllCharacters', response.data.results)

            if (response.data.info.next !== '') {
                payload.page++
                dispatch('getAllCharacters', payload)
            } else {
                dispatch('prepareRacesData')
            }
        })
    },
    prepareRacesData({commit, state}) {
        let racesMap = new Map();
        let genderMap = new Map();
        let statusMap = new Map();
        let locationMap = new Map();
        let allChars = state.allCharacters
        let locationMapTop20

        allChars.forEach(char => {
            let val = racesMap.get(char.species)
            
            if (val === undefined) {
                racesMap.set(char.species, 1)
            } else {
                racesMap.set(char.species, ++val)
            }

            let sval = statusMap.get(char.status)
            
            if (sval === undefined) {
                statusMap.set(char.status, 1)
            } else {
                statusMap.set(char.status, ++sval)
            }

            let gval = genderMap.get(char.gender)
            
            if (gval === undefined) {
                genderMap.set(char.gender, 1)
            } else {
                genderMap.set(char.gender, ++gval)
            }

            let lval = locationMap.get(char.location.name)
            
            if (lval === undefined) {
                locationMap.set(char.location.name, 1)
            } else {
                locationMap.set(char.location.name, ++lval)
            }

            locationMapTop20 = new Map([...locationMap].sort((kv1, kv2) => {
                return kv1[1] > kv2[1] ? -1 : 1
            }).slice(0, 20))
        });

        commit('setRaces', {
            labels: Array.from(racesMap.keys()),
            data: Array.from(racesMap.values())
        })
        commit('setGenders', {
            labels: Array.from(genderMap.keys()),
            data: Array.from(genderMap.values())
        })
        commit('setStatuses', {
            labels: Array.from(statusMap.keys()),
            data: Array.from(statusMap.values())
        })
        commit('setLocations', {
            labels: Array.from(locationMapTop20.keys()),
            data: Array.from(locationMapTop20.values())
        })
        commit('setCharactersDataReady', true)
    },
    prepareCharactersByEpisodeData({commit, state}) {
        let allEpisodes = state.allEpisodes
        let charsByEpisode = {
            1: { labels: [], data: [] },
            2: { labels: [], data: [] },
            3: { labels: [], data: [] }
        }

        allEpisodes.forEach(episode => {
            let re = /S(\d+)E(\d+)/g
            let matches = [...episode.episode.matchAll(re)]
            let season = parseInt(matches[0][1], 10)

            charsByEpisode[season].labels.push(episode.name)
            charsByEpisode[season].data.push(episode.characters.length)
        });

        commit('setCharactersByEpisode', charsByEpisode)
        commit('setCharsByEpisodeReady', true)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
