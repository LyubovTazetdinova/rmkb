import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router/router'
import axios from "axios"
import store from "./store"
import { sync } from 'vuex-router-sync'

Vue.prototype.$axios = axios
Vue.config.productionTip = false

sync(store, router)
axios.defaults.baseURL = "https://rickandmortyapi.com/api/"

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
