<template>
    <v-card
        class="mx-auto ml-3 mr-3"
    >
        <v-row class="fill-height">
            <v-col
                class="text-center"
                cols="12"
                xl="4"
                lg="4"
                md="4"
                sm="12"
            >
                <v-avatar
                    class="profile mt-4"
                    color="grey"
                    size="300"
                    tile
                >
                    <v-img :src="character.image"></v-img>
                </v-avatar>
            </v-col>
            <v-col
                cols="12"
                xl="8"
                lg="8"
                md="8"
                sm="12"
            >
                <v-list-item-content>
                    <v-list-item-title class="headline">
                        <v-row>
                            <v-col cols="10" class="py-0">
                                <div class="pl-1">
                                    {{ character.name }}
                                </div>
                            </v-col>
                            <v-col cols="2" class="py-0">
                                <v-row>
                                    <v-spacer></v-spacer>
                                    <v-btn class="mr-6" icon v-on:click="isFavouriteCharacter(character.id) ? removeCharacter(character.id) : addCharacter(character)">
                                        <v-icon :color="isFavouriteCharacter(character.id) ? 'red' : undefined">mdi-heart</v-icon>
                                    </v-btn>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <v-icon>mdi-map-marker</v-icon>
                        {{ character.location.name }}
                    </v-list-item-subtitle>
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
                <v-row>
                    <v-col class="pl-0" cols="12">
                        <v-simple-table>
                            <template v-slot:default>
                                <tbody>
                                    <tr>
                                        <td width="20%">Status:</td>
                                        <td>{{ character.status }}</td>
                                    </tr>
                                    <tr>
                                        <td>Race:</td>
                                        <td>{{ character.species }}</td>
                                    </tr>
                                    <tr>
                                        <td>Gender:</td>
                                        <td>{{ character.gender }}</td>
                                    </tr>
                                    <tr>
                                        <td>Origin:</td>
                                        <td>{{ character.origin.name }}</td>
                                    </tr>
                                    <tr>
                                        <td>Current Location:</td>
                                        <td>{{ character.location.name }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-overlay :value="loading" absolute>
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </v-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
    props: [
        'id'
    ],
    data: () => ({
        rating: 0,
        loading: true,
        character: {
            location: {},
            origin: {}
        }
    }),
    metaInfo() {
        return {
            title: this.character.name + ' - Rick and Morty character!'
        }
    },
    watch: {
        rating: function (val) {
            this.setCharacterRating({ id: this.character.id, rating: val })
        },
        id: function() {
            this.loadChar()
        }
    },
    computed: {
        ...mapGetters([
            'getCharacterRating',
            'isFavouriteCharacter'
        ])
    },
    created () {
        this.loadChar()
    },
    methods: {
        loadChar () {
            this.loading = true
            let self = this

            this.$axios.get('character/' + this.id)
                .then((response) => {
                    self.character = response.data
                    self.setPageTitle(self.character.name)
                    self.rating = self.getCharacterRating(self.character.id)
                    self.loading = false
                })
                .catch((error) => {
                    self.loading = false
                    alert(error)
                    console.log(error)
                })
        },
        ...mapMutations([
            'setPageTitle',
            'setCharacterRating',
            'addCharacter',
            'removeCharacter'
        ])
    }
}
</script>