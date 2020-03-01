<template>
    <v-container fluid>
        <v-expansion-panels :class="['mb-3']">
            <v-expansion-panel>
                <v-expansion-panel-header>Filters</v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-form ref="form">
                        <v-container>
                            <v-row>
                                <v-text-field
                                    v-model="searchName"
                                    label="Name"
                                    required
                                ></v-text-field>
                            </v-row>
                        </v-container>
                        <v-btn color="error" class="mr-4" @click="reset">
                            Reset Filters
                        </v-btn>
                    </v-form>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-row>
            <v-col
                v-for="episode in episodes"
                :key="episode.name"
                :class="['pb-4 pr-4']"
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
                        <v-btn v-on:click="goTo(episode)" text>More Info</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn icon
                               v-on:click="isFavouriteEpisode(episode.id) ? removeEpisode(episode.id) : addEpisode(episode)">
                            <v-icon :color="isFavouriteEpisode(episode.id) ? 'red' : undefined">mdi-thumb-up</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <div class="text-center">
            <v-pagination
                v-model="page"
                :length="total"
                v-on:input="loadEpisodes(page)"
            ></v-pagination>
        </div>
        <v-overlay :value="loading" absolute>
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {mapMutations} from 'vuex'
    import _ from 'lodash'

    export default {
        data: () => ({
            searchName: '',
            loading: false,
            total: 1,
            page: 1,
            episodes: [],
        }),
        watch: {
            searchName: function () {
                this.loadEpisodesDebounced(this.page)
            }
        },
        metaInfo() {
            return {
                title: 'Episodes'
            }
        },
        computed: {
            ...mapGetters([
                'isFavouriteEpisode'
            ])
        },
        created() {
            this.loadEpisodes(this.page)
            this.loadEpisodesDebounced = _.debounce(this.loadEpisodes, 500)
        },
        methods: {
            loadEpisodes(page) {
                page = page || 1
                this.loading = true
                let self = this

                this.$axios.get('episode', {
                    params: {
                        page: page,
                        name: this.searchName
                    }
                })
                    .then((response) => {
                        self.episodes = response.data.results
                        self.total = response.data.info.pages
                        self.loading = false
                        self.$vuetify.goTo(0)
                    })
                    .catch((error) => {
                        alert(error)
                        console.log(error)
                        self.loading = false
                    })
            },
            reset() {
                this.$refs.form.reset()
            },
            goTo(episode) {
                this.setPageTitle(episode.name)
                this.$router.push({name: 'episode', params: {id: episode.id}})
            },
            ...mapMutations([
                'addEpisode',
                'removeEpisode',
                'setPageTitle'
            ])
        }
    }
</script>