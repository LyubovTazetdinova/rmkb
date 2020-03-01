<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <v-list dense>
                <template v-for="item in menuItems">
                    <v-list-item :key="item.text" :to="item.path" link>
                        <v-list-item-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.text }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
                <span class="hidden-sm-and-down">Rick and Morty KB!</span>
            </v-toolbar-title>
            <v-menu
                tile
                v-model="searchActive"
                :close-on-content-click="false"
                :nudge-width="300"
                offset-y
                max-width="630"
            >
                <template v-slot:activator="{ on }">
                    <v-text-field
                        flat
                        solo-inverted
                        hide-details
                        prepend-inner-icon="mdi-magnify"
                        label="Search"
                        class="hidden-sm-and-down"
                        v-on="on"
                        v-on:click="searchActive = true"
                        v-model="searchValue"
                    />
                </template>
                <v-card tile>
                    <v-list v-if="episodes.length > 0" dense>
                        <v-subheader>Episodes</v-subheader>
                        <v-list-item-group color="primary">
                            <v-list-item v-for="(episode, i) in episodes" :key="i" :to="'/episodes/' + episode.id">
                                <v-list-item-content>
                                    <v-list-item-title v-text="episode.name"></v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                    <v-divider v-if="chars.length > 0"></v-divider>
                    <v-list v-if="chars.length > 0" dense>
                        <v-subheader>Characters</v-subheader>
                        <v-list-item-group color="primary">
                            <v-list-item v-for="(char, i) in chars" :key="i" :to="'/characters/' + char.id">
                                <v-list-item-content>
                                    <v-list-item-title v-text="char.name"></v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                    <v-card-text v-if="chars.length == 0 && episodes.length == 0">
                        No Results
                    </v-card-text>
                    <v-overlay :value="loading" absolute>
                        <v-progress-circular indeterminate size="64"></v-progress-circular>
                    </v-overlay>
                </v-card>
            </v-menu>
            <v-spacer />
            <v-menu
                v-model="accountInfo"
                :close-on-content-click="false"
                :nudge-width="300"
                offset-y
            >
                <template v-slot:activator="{ on }">
                    <v-btn icon large v-on="on">
                        <v-avatar size="32px" item>
                            <v-img
                                :src="'https://www.gravatar.com/avatar/' + emailHash"
                            />
                        </v-avatar>
                    </v-btn>
                </template>
                <v-card>
                    <v-list>
                        <v-list-item>
                            <v-list-item-avatar>
                                <img
                                    :src="'https://www.gravatar.com/avatar/' + emailHash"
                                />
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>{{ getUser.name || 'User Name' }}</v-list-item-title>
                                <v-list-item-subtitle>{{ getUser.email }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="logout">Logout</v-btn>
                    </v-card-actions>
                </v-card>
            </v-menu>
        </v-app-bar>
        <v-content v-scroll="onScroll">
            <v-container fluid class="mb-60">
                <div v-if="breadcrumbs.length > 0">
                    <v-breadcrumbs :items="breadcrumbs">
                        <template v-slot:divider>
                            <v-icon>mdi-chevron-right</v-icon>
                        </template>
                        <template v-slot:item="{ item }">
                            <v-breadcrumbs-item
                                v-on:click.stop.prevent="goTo(item.href)"
                                :href="item.href"
                            >{{ item.text.replace('%title%', getPageTitle) }}</v-breadcrumbs-item>
                        </template>
                    </v-breadcrumbs>
                </div>
                <router-view></router-view>
            </v-container>
            <v-footer fixed absolute class="font-weight-medium">
                <v-col class="text-center pb-0 pt-0" cols="12">
                    <v-btn
                        icon
                        large
                        href="https://github.com/LyubovTazetdinova/rmkb"
                        target="_blank"
                    >
                        <v-avatar size="32px" item>
                            <v-img :src="require('../../assets/github.svg')" alt="Github" />
                        </v-avatar>
                    </v-btn>
                </v-col>
            </v-footer>
            <v-scale-transition>
                <v-btn
                    v-on:click="scrollToTop"
                    v-if="offsetTop > 100"
                    color="primary"
                    class="to-top"
                    fab
                    large
                    dark
                >
                    <v-icon>mdi-chevron-up</v-icon>
                </v-btn>
            </v-scale-transition>
        </v-content>
    </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import md5 from 'md5';
import _ from 'lodash'

export default {
    name: 'Layout',
    watch: {
        $route() {
            this.breadcrumbs = this.$route.meta.breadcrumbs
            this.searchActive = false
        },
        getUser(value) {
            if (!value.authenticated) {
                this.goTo('/');
            }
        },
        searchValue: function (val) {
            this.searchDebounced(val)
        }
    },
    computed: {
        emailHash() {
            return md5(this.getUser.email || '')
        },
        loading() {
            return this.charsLoading || this.episodesLoading
        },
        ...mapGetters(['getPageTitle', 'getUser'])
    },
    data: () => ({
        accountInfo: false,
        searchActive: false,
        searchValue: '',
        episodesLoading: false,
        charsLoading: false,
        offsetTop: 0,
        drawer: null,
        breadcrumbs: [],
        chars: [],
        episodes: [],
        menuItems: [
            { icon: 'mdi-home', text: 'Home', path: '/home' },
            { icon: 'mdi-monitor', text: 'Episodes', path: '/episodes' },
            {
                icon: 'mdi-account-group',
                text: 'Characters',
                path: '/characters'
            },
            // {
            //     icon: 'mdi-map-marker-multiple',
            //     text: 'Locations',
            //     path: '/locations'
            // },
            // { icon: 'mdi-heart-multiple', text: 'Favorite', path: '/fav' },
            { icon: 'mdi-chart-line', text: 'Statistics', path: '/stats' },
            // { icon: 'mdi-help', text: 'Guess Who', path: '/guess' }
        ]
    }),
    created() {
        this.searchDebounced = _.debounce(this.search, 500)
    },
    methods: {
        search() {
            this.searchActive = true

            this.loadEpisodes()
            this.loadCharacters()
        },
        loadEpisodes() {
            if (!this.searchValue) {
                self.episodes = []
                return
            }

            this.episodesLoading = true
            let self = this
            this.$axios.get('episode', {
                params: {
                    name: this.searchValue
                }
            })
            .then((response) => {
                self.episodes = response.data.results.slice(0, 5)
                self.episodesLoading = false
            })
            .catch((error) => {
                self.episodesLoading = false
                self.episodes = []
                console.log(error)
            })
        },
        loadCharacters() {
            if (!this.searchValue) {
                self.chars = []
                return
            }

            this.charsLoading = true
            let self = this
            this.$axios.get('character', {
                params: {
                    name: this.searchValue
                }
            })
            .then((response) => {
                self.chars = response.data.results.slice(0, 5)
                self.charsLoading = false
            })
            .catch((error) => {
                self.charsLoading = false
                self.chars = []
                console.log(error)
            })
        },
        onScroll() {
            this.offsetTop = window.pageYOffset;
        },
        scrollToTop() {
            this.$vuetify.goTo(0);
        },
        goTo(link) {
            if (link) {
                this.$router.push({ path: link });
            }
        },
        logout() {
            this.signOut();
        },
        ...mapActions(['signOut'])
    }
};
</script>

<style scoped>
.to-top {
    z-index: 10;
    position: fixed;
    bottom: 30px;
    right: 30px;
}
.mb-60 {
    margin-bottom: 60px;
}
</style>
