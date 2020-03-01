import Vue from 'vue'
import Meta from 'vue-meta'
import Router from 'vue-router'
import Layout from '../components/layout/Layout'
import Home from '../components/Home.vue'
import Episode from '../components/episodes/Episode.vue'
import Episodes from '../components/episodes/Episodes.vue'
import Characters from '../components/characters/Characters.vue'
import Character from '../components/characters/Character.vue'
import Login from '../components/user/Login'
import Stats from '../components/stats/Stats'

Vue.use(Router)
Vue.use(Meta)

export default new Router({
    mode: 'history',
    base: '/',
    routes: [
        {
            path: '/',
            component: Login,
            meta: {
                public: true
            }
        },
        {
            path: '/home',
            component: Layout,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: Home,
                    meta: {
                        breadcrumbs: []
                    }
                }
            ]
        },
        {
            path: '/episodes',
            component: Layout,
            children: [
                {
                    path: '',
                    name: 'episodes',
                    component: Episodes,
                    meta: {
                        breadcrumbs: [
                            {
                                text: 'Home',
                                href: '/'
                            },
                            {
                                text: 'Episodes'
                            }
                        ]
                    }
                },
                {
                    path: ':id',
                    name: 'episode',
                    component: Episode,
                    props: true,
                    meta: {
                        breadcrumbs: [
                            {
                                text: 'Home',
                                href: '/'
                            },
                            {
                                text: 'Episodes',
                                href: '/episodes'
                            },
                            {
                                text: '%title%'
                            }
                        ]
                    }
                }
            ]
        },
        {
            path: '/characters',
            component: Layout,
            children: [
                {
                    path: '',
                    name: 'characters',
                    component: Characters,
                    meta: {
                        breadcrumbs: [
                            {
                                text: 'Home',
                                href: '/'
                            },
                            {
                                text: 'Characters'
                            }
                        ]
                    }
                },
                {
                    path: ':id',
                    name: 'character',
                    component: Character,
                    props: true,
                    meta: {
                        breadcrumbs: [
                            {
                                text: 'Home',
                                href: '/'
                            },
                            {
                                text: 'Characters',
                                href: '/characters'
                            },
                            {
                                text: '%title%'
                            }
                        ]
                    }
                }
            ]
        },
        {
            path: '/stats',
            component: Layout,
            children: [
                {
                    path: '',
                    name: 'stats',
                    component: Stats,
                    meta: {
                        breadcrumbs: [
                            {
                                text: 'Home',
                                href: '/'
                            },
                            {
                                text: 'Statistics'
                            }
                        ]
                    }
                }
            ]
        }
    ]
})