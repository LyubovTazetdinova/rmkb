import Vue from 'vue'
import Meta from 'vue-meta'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Episode from '../components/episodes/Episode.vue'
import Episodes from '../components/episodes/Episodes.vue'
import Characters from '../components/characters/Characters.vue'
import Favourite from '../components/favourite/Favourite.vue'
import Locations from '../components/locations/Locations'
//import Location from '../components/locations/Location'

Vue.use(Router)
Vue.use(Meta)

export default new Router({
    mode: 'history',
    base: 'rmkb',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                breadcrumbs: []
            }
        },
        {
            path: '/episodes',
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
            path: "/episodes/:id",
            name: "episode",
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
        },
        {
            path: '/characters',
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
            path: '/locations',
            name: 'locations',
            component: Locations,
            meta: {
                breadcrumbs: [
                    {
                        text: 'Home',
                        href: '/'
                    },
                    {
                        text: 'Locations'
                    }
                ]
            }
        },
        {
            path: '/fav',
            name: 'fav',
            component: Favourite,
            meta: {
                breadcrumbs: [
                    {
                        text: 'Home',
                        href: '/'
                    },
                    {
                        text: 'Favorite'
                    }
                ]
            }
        }
    ]
})