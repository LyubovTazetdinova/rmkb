<template>
    <v-card
        class="mx-auto ml-3 mr-3"
        max-width="1440"
    >
        <v-list-item three-line>
            <v-row>
                <v-col cols="10">
                    <v-list-item-content>
                        <v-list-item-title class="headline">
                            {{ episode.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ seasonAndEpisode }}</v-list-item-subtitle>
                        <v-row align="center" class="mx-0">
                            <v-rating
                                v-model="rating"
                                color="amber"
                                dense
                                half-increments
                                size="30"
                            ></v-rating>
                            <div class="grey--text ml-4">{{ rating }}</div>
                        </v-row>
                    </v-list-item-content>
                </v-col>
                <v-col cols="2">
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-btn class="mr-2" icon v-on:click="isFavouriteEpisode(episode.id) ? removeEpisode(episode.id) : addEpisode(episode)">
                            <v-icon :color="isFavouriteEpisode(episode.id) ? 'red' : undefined">mdi-heart</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
            </v-row>
        </v-list-item>
        <v-divider class="mx-4"></v-divider>
        <v-card-text>
            <div class="my-4 subtitle-1">
                Release Date: {{ episode.air_date }}
            </div>
            <p class="title text--primary">
                Characters
            </p>
            <v-row dense>
                <v-col
                    v-for="url in episode.characters"
                    :key="url"
                    cols="12"
                    :class="['pb-4 pr-4']"
                    xl="3"
                    lg="4"
                    md="6"
                    sm="12"
                >
                    <v-skeleton-loader
                        class="mx-auto"
                        max-width="300"
                        type="card"
                        :loading="characters[url].loading"
                        transition="scale-transition"
                    >
                        <v-card
                            class="mx-auto"
                            max-width="400"
                        >
                            <v-img
                                class="white--text align-end"
                                height="200px"
                                :src="characters[url].image"
                            >
                                <v-card-title>
                                    <div class="grey darken-2 text-center">
                                        <span class="white--text pl-3 pr-3">{{ characters[url].name }}</span>
                                    </div>
                                </v-card-title>
                            </v-img>
                            <v-card-subtitle class="pb-0">{{ characters[url].species }}</v-card-subtitle>

                            <v-card-text class="text--primary">
                                <div>Status: {{ characters[url].status }}</div>
                            </v-card-text>

                            <v-card-actions>
                                <v-btn text>More Info</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn icon v-on:click="isFavouriteCharacter(characters[url].id) ? removeCharacter(characters[url].id) : addCharacter(characters[url])">
                                    <v-icon :color="isFavouriteCharacter(characters[url].id) ? 'red' : undefined">mdi-thumb-up</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-skeleton-loader>
                </v-col>
            </v-row>
        </v-card-text>

        <v-overlay :value="loading" absolute>
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'
import Vue from 'vue'

export default {
    props: [
        'id'
    ],
    data: () => ({
        rating: 0,
        loading: true,
        episode: {},
        characters: {}
    }),
    metaInfo() {
        return {
            title: this.episode.name + ' - Rick and Morty episode!'
        }
    },
    watch: {
        rating: function (val) {
            this.setRating({ id: this.episode.id, rating: val })
        }
    },
    computed: {
        seasonAndEpisode: function () {
            if (!this.episode.episode) {
                return '';
            }
            let re = /S(\d+)E(\d+)/g
            let matches = [...this.episode.episode.matchAll(re)]

            return `Season ${parseInt(matches[0][1], 10)}, Episode ${parseInt(matches[0][2], 10)}`
        },
        ...mapGetters([
            'isFavouriteEpisode',
            'getRating',
            'isFavouriteCharacter'
        ])
    },
    created () {
        this.loadEpisode()
    },
    beforeDestroy() {
        this.setPageTitle('')
    },
    methods: {
        loadEpisode () {
            this.loading = true
            let self = this

            this.$axios.get('episode/' + this.id)
            .then((response) => {
                self.episode = response.data
                self.setPageTitle(self.episode.name)
                self.rating = self.getRating(self.episode.id)
                self.loading = false
                self.episode.characters.forEach(url => self.loadCharacter(url));
            })
            .catch((error) => {
                self.loading = false
                alert(error)
                console.log(error)
            })
        },
        loadCharacter(url) {
            Vue.set(this.characters, url, { loading: true })
            let self = this

            this.$axios.get(url)
                .then((response) => {
                    Vue.set(self.characters, url, response.data)
                })
                .catch((error) => {
                    alert(error)
                    console.log(error)
                })
        },
        ...mapMutations([
            'addEpisode',
            'removeEpisode',
            'setPageTitle',
            'setRating',
            'addCharacter',
            'removeCharacter'
        ])
    }
  }
</script>