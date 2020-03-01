import Vue from 'vue'
import Main from './Main.vue'
import vuetify from './plugins/vuetify'
import router from './router/router'
import axios from 'axios'
import store from './store'
import { initializeApp } from 'firebase/app'
import 'chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.prototype.$axios = axios
Vue.config.productionTip = false

// axios config
axios.defaults.baseURL = 'http://rmkbapi.ddns.net/api/'

// router auth interceptor
router.beforeEach((to, from, next) => {
    if (to.meta && to.meta.public === true || store.state.user.user.authenticated) {
        if (store.state.user.user.authenticated && to.path == '/') {
            next('/home')
            return
        }

        next()
    } else {
        next('/')
    }
})

new Vue({
    router,
    store,
    vuetify,
    render: h => h(Main),
    created() {
        initializeApp({
            apiKey: process.env.VUE_APP_FB_API_KEY,
            authDomain: process.env.VUE_APP_FB_AUTH_DOMAIN,
            databaseURL: process.env.VUE_APP_FB_DB_URL,
            projectId: process.env.VUE_APP_FB_PROJECT_ID,
            storageBucket: process.env.VUE_APP_FB_STORAGE_BUCKET,
            messagingSenderId: process.env.VUE_APP_FB_MESSAGING_SENDER_ID,
            appId: process.env.VUE_APP_FB_APP_ID
        })
    }
}).$mount('#app')
