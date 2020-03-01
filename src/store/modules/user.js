import firebase from 'firebase/app';
import 'firebase/auth';

const state = {
    user: {
        id: '',
        authenticated: false,
        name: '',
        email: ''
    },
    loading: false,
    error: null
}

const mutations = {
    setUser(state, user) {
        state.user = user
    },
    setLoading(state, loading) {
        state.loading = loading
    },
    setError(state, error) {
        state.error = error
    }
}

const getters = {
    getUser: state => state.user,
    isAuthenticated: state => state.user.authenticated,
    isUserLoading: state => state.loading,
    userError: state => state.error
}

const actions = {
    signUp({commit}, payload) {
        commit('setLoading', true)
        commit('setError', null)

        firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(user => {
                let usr = firebase.auth().currentUser

                usr.updateProfile({
                    displayName: payload.name
                })

                const newUser = {
                    id: user.localId,
                    authenticated: true,
                    email: payload.email,
                    name: payload.name
                }
                commit('setLoading', false)
                commit('setUser', newUser)
            })
            .catch(error => {
                commit('setLoading', false)
                commit('setError', error.message)
            })
    },
    signIn({commit}, payload) {
        commit('setLoading', true)
        commit('setError', null)

        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then(user => {
                const newUser = {
                    id: user.user.uid,
                    authenticated: true,
                    email: user.user.email,
                    name: user.user.displayName
                }
                commit('setLoading', false)
                commit('setUser', newUser)
            })
            .catch(error => {
                commit('setLoading', false)
                commit('setError', error.message)
            })
    },
    signOut({commit}) {
        firebase.auth().signOut()
            .then(() => {
                const emptyUser = {
                    id: '',
                    authenticated: false,
                    email: '',
                    name: ''
                }

                commit('setUser', emptyUser)
            })
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
