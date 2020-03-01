<template>
    <v-container>
        <v-layout row wrap>
            <v-responsive
                width="100%"
                class="mx-auto"
            >
                <v-skeleton-loader
                    :loading="loading"
                    transition="scale-transition"
                    width="100%"
                    type="image"
                    class="mx-auto"
                    elevation="5"
                >
                    <v-hover>
                        <template v-slot:default="{ hover }">
                            <v-carousel
                                cycle
                                height="400px"
                                hide-delimiter-background
                                show-arrows-on-hover
                            >
                                <v-carousel-item
                                    v-for="(slide,i) in slides"
                                    :key="i"
                                    :src="slide.image"
                                    :class="['mr-2 ml-2']"
                                >
                                    <v-fade-transition>
                                        <v-overlay
                                            v-if="hover"
                                            absolute
                                            color="#036358"
                                        >
                                            <v-btn :to="'/characters/' + slide.id">{{ slide.name }}</v-btn>
                                        </v-overlay>
                                    </v-fade-transition>
                                </v-carousel-item>
                            </v-carousel>
                        </template>
                    </v-hover>
                </v-skeleton-loader>
            </v-responsive>
            <v-container fluid>
                <h2>
                    Here are some carefully hand-picked quality random episodes for you to watch! &lt;3
                </h2>
                <v-row>
                    <v-col
                        v-for="episode in episodes"
                        :key="episode.name"
                        class="pb-4 pr-4"
                        cols="12"
                        xl="3"
                        lg="4"
                        md="6"
                        sm="12"
                    >
                        <v-card
                            class="mx-auto "
                            max-width="400"
                        >
                            <v-card-title>{{ episode.name }}</v-card-title>
                            <v-card-subtitle class="pb-0">{{ episode.episode }}</v-card-subtitle>
                            <v-card-text class="text--primary">
                                <div>Release Date: {{ episode.air_date }}</div>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn :to="'/episodes/' + episode.id" text>More Info</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn icon
                                       v-on:click="isFavouriteEpisode(episode.id) ? removeEpisode(episode.id) : addEpisode(episode)">
                                    <v-icon :color="isFavouriteEpisode(episode.id) ? 'red' : undefined">mdi-thumb-up
                                    </v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-layout>
    </v-container>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: 'Home',

        data: () => ({
            loadingEpisodes: true,
            loading: true,
            slides: [],
            episodes: []
        }),

        computed: {
            ...mapGetters([
                'isFavouriteEpisode'
            ])
        },

        created() {
            this.loadSlides()
            this.loadEpisodes()
        },

        metaInfo() {
            return {
                title: 'Rick and Morty knowledgebase, bitches!'
            }
        },

        methods: {
            getRandomIds(n, max) {
                return Array.from({length: n}, () => Math.floor(Math.random() * (max - 1) + 1));
            },

            loadSlides() {
                this.loading = true
                let self = this
                let ids = this.getRandomIds(5, 400).join(',')

                this.$axios.get(`character/[${ids}]`, { crossDomain: true })
                    .then((response) => {
                        self.slides = response.data
                        self.loading = false
                    })
                    .catch((error) => {
                        alert(error)
                        console.log(error)
                    })
            },

            loadEpisodes() {
                this.loadingEpisodes = true
                let self = this
                let ids = this.getRandomIds(6, 31).join(',')

                this.$axios.get(`episode/[${ids}]`)
                    .then((response) => {
                        self.episodes = response.data
                        this.loadingEpisodes = false
                    })
                    .catch((error) => {
                        alert(error)
                        console.log(error)
                    })
            },

            ...mapMutations([
                'addEpisode',
                'removeEpisode'
            ])
        }
    }
</script>
