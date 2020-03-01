<template>
    <v-app>
        <v-navigation-drawer
            v-model="drawer"
            :clipped="$vuetify.breakpoint.lgAndUp"
            app
        >
            <v-list dense>
                <template v-for="item in menuItems">
                    <v-list-item
                        :key="item.text"
                        :to="item.path"
                        link
                    >
                        <v-list-item-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ item.text }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
            :clipped-left="$vuetify.breakpoint.lgAndUp"
            app
            color="blue darken-3"
            dark
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title
                style="width: 300px"
                class="ml-0 pl-4"
            >
                <span class="hidden-sm-and-down">Rick and Morty KB!</span>
            </v-toolbar-title>
            <v-text-field
                flat
                solo-inverted
                hide-details
                prepend-inner-icon="mdi-magnify"
                label="Search"
                class="hidden-sm-and-down"
            />
            <v-spacer/>
            <v-btn
                icon
                large
                href="https://github.com/LyubovTazetdinova/rmkb"
                target="_blank"
            >
                <v-avatar
                    size="32px"
                    item
                >
                    <v-img
                        :src="require('./assets/github.svg')"
                        alt="Vuetify"
                    />
                </v-avatar>
            </v-btn>
        </v-app-bar>

        <v-content v-scroll="onScroll">
            <v-container fluid>
                <div v-if="breadcrumbs.length > 0">
                    <v-breadcrumbs :items="breadcrumbs">
                        <template v-slot:divider>
                            <v-icon>mdi-chevron-right</v-icon>
                        </template>
                        <template v-slot:item="{ item }">
                            <v-breadcrumbs-item
                                v-on:click.stop.prevent="goTo(item.href)"
                                :href="item.href"
                            >
                                {{ item.text.replace('%title%', getPageTitle) }}
                            </v-breadcrumbs-item>
                        </template>
                    </v-breadcrumbs>
                </div>
                <router-view></router-view>
            </v-container>
            <v-scale-transition>
                <v-btn v-on:click="scrollToTop" v-if="offsetTop > 100" color="primary" class="to-top" fab large dark>
                    <v-icon>mdi-chevron-up</v-icon>
                </v-btn>
            </v-scale-transition>
        </v-content>
    </v-app>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'App',

        watch: {
            '$route'() {
                this.breadcrumbs = this.$route.meta.breadcrumbs
            }
        },

        computed: {
            ...mapGetters([
                'getPageTitle'
            ])
        },

        data: () => ({
            offsetTop: 0,
            drawer: null,
            breadcrumbs: [],
            menuItems: [
                {icon: 'mdi-home', text: 'Home', path: "/"},
                {icon: 'mdi-monitor', text: 'Episodes', path: "/episodes"},
                {icon: 'mdi-account-group', text: 'Characters', path: "/characters"},
                {icon: 'mdi-map-marker-multiple', text: 'Locations', path: "/locations"},
                {icon: 'mdi-heart-multiple', text: 'Favorite', path: "/fav"},
                {icon: 'mdi-chart-line', text: 'Statistics', path: "/stats"},
                {icon: 'mdi-help', text: 'Guess Who', path: "/guess"},
            ],
        }),

        methods: {
            onScroll() {
                this.offsetTop = window.pageYOffset
            },
            scrollToTop() {
                this.$vuetify.goTo(0)
            },
            goTo(link) {
                if (link) {
                    this.$router.push({path: link})
                }
            }
        }
    }
</script>

<style scoped>
    .to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
    }
</style>
