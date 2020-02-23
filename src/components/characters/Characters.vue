<template>
    <v-container fluid>
        <v-expansion-panels :class="['mb-3']">
            <v-expansion-panel>
                <v-expansion-panel-header>Filters</v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-form ref="form">
                        <v-container>
                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-text-field
                                        v-model="search.name"
                                        label="Name"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-select
                                        v-on:change="loadCharacters()"
                                        v-model="search.gender"
                                        :items="genders"
                                        label="Gender"
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-select
                                        v-on:change="loadCharacters()"
                                        v-model="search.status"
                                        :items="statuses"
                                        label="Status"
                                    ></v-select>
                                </v-col>
                            </v-row>
                            <v-btn color="error" class="mr-4" @click="reset">
                                Reset Filters
                            </v-btn>
                        </v-container>
                    </v-form>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-row dense>
            <v-col
                v-for="char in characters"
                :key="char.id"
                cols="12"
                :class="['pb-4 pr-4']"
                xl="3"
                lg="4"
                md="6"
                sm="12"
            >
                <v-card
                    class="mx-auto"
                    max-width="400"
                >
                    <v-img
                        class="white--text align-end"
                        height="200px"
                        :src="char.image"
                    >
                        <v-card-title>
                            <div class="grey darken-2 text-center">
                                <span class="white--text pl-3 pr-3">{{ char.name }}</span>
                            </div>
                        </v-card-title>
                    </v-img>
                    <v-card-subtitle class="pb-0">{{ char.species }}</v-card-subtitle>

                    <v-card-text class="text--primary">
                        <div>Status: {{ char.status }}</div>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn text>More Info</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn icon
                               v-on:click="isFavouriteCharacter(char.id) ? removeCharacter(char.id) : addCharacter(char)">
                            <v-icon :color="isFavouriteCharacter(char.id) ? 'red' : undefined">mdi-thumb-up</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <div class="text-center">
            <v-pagination
                v-model="page"
                :length="total"
                :total-visible="10"
                v-on:input="loadCharacters(page)"
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
            search: {
                name: '',
                gender: '',
                status: ''
            },
            genders: [
                'female',
                'male',
                'genderless',
                'unknown'
            ],
            statuses: [
                'alive',
                'dead',
                'unknown'
            ],
            loading: false,
            total: 1,
            page: 1,
            characters: [],
        }),
        watch: {
            'search.name': {
                handler: function () {
                    this.loadCharactersDebounced(this.page)
                },
                deep: true
            }
        },
        metaInfo() {
            return {
                title: 'Characters'
            }
        },
        created() {
            this.loadCharacters(this.page)
            this.loadCharactersDebounced = _.debounce(this.loadCharacters, 500)
        },
        computed: {
            ...mapGetters([
                'isFavouriteCharacter'
            ])
        },
        methods: {
            loadCharacters(page) {
                page = page || 1
                this.loading = true
                let self = this

                this.$axios.get('character', {
                    params: {
                        page: page,
                        name: this.search.name,
                        status: this.search.status,
                        gender: this.search.gender
                    }
                })
                    .then((response) => {
                        self.characters = response.data.results
                        self.total = response.data.info.pages
                        this.loading = false
                        this.$vuetify.goTo(0)
                    })
                    .catch((error) => {
                        alert(error)
                        console.log(error)
                        this.loading = false
                    })
            },
            reset() {
                this.$refs.form.reset()
            },
            ...mapMutations([
                'addCharacter',
                'removeCharacter'
            ])
        },
    }
</script>