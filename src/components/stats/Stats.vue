<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" xl="12" lg="12" md="12" sm="12">
                <v-card class="mx-auto">
                    <v-card-title>
                        Characters By Episode
                        <v-spacer></v-spacer>
                        <v-select
                            v-model="selectedSeason"
                            :items="seasons"
                            label="Season"
                        ></v-select>
                    </v-card-title>

                    <v-card-text class="text--primary">
                        <div>
                            <canvas id="characters-by-episode" width="900" height="240"></canvas>
                        </div>
                    </v-card-text>
                    <v-overlay :value="!getGetCharsByEpisodeReady" absolute>
                        <v-progress-circular indeterminate size="64"></v-progress-circular>
                    </v-overlay>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" xl="12" lg="12" md="12" sm="12">
                <v-card class="mx-auto">
                    <v-card-title>Top 20 Character Locations</v-card-title>

                    <v-card-text class="text--primary">
                        <div>
                            <canvas id="locations" width="900" height="240"></canvas>
                        </div>
                    </v-card-text>
                    <v-overlay :value="!getCharactersDataReady" absolute>
                        <v-progress-circular indeterminate size="64"></v-progress-circular>
                    </v-overlay>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" xl="6" lg="6" md="12" sm="12">
                <v-card class="mx-auto">
                    <v-card-title>Races</v-card-title>

                    <v-card-text class="text--primary">
                        <div>
                            <canvas id="races" width="550" height="400"></canvas>
                        </div>
                    </v-card-text>
                    <v-overlay :value="!getCharactersDataReady" absolute>
                        <v-progress-circular indeterminate size="64"></v-progress-circular>
                    </v-overlay>
                </v-card>
            </v-col>
            <v-col cols="12" xl="6" lg="6" md="12" sm="12">
                <v-card class="mx-auto">
                    <v-card-title>Genders</v-card-title>

                    <v-card-text class="text--primary">
                        <div>
                            <canvas id="genders" width="550" height="400"></canvas>
                        </div>
                    </v-card-text>
                    <v-overlay :value="!getCharactersDataReady" absolute>
                        <v-progress-circular indeterminate size="64"></v-progress-circular>
                    </v-overlay>
                </v-card>
            </v-col>
            <v-col cols="12" xl="12" lg="12" md="12" sm="12">
                <v-card class="mx-auto">
                    <v-card-title>Status</v-card-title>

                    <v-card-text class="text--primary">
                        <v-row>
                        <v-col cols="12">
                            <canvas style="display: block; height: 100px; width: 400px;" id="status"></canvas>
                        </v-col>
                        </v-row>
                    </v-card-text>
                    <v-overlay :value="!getCharactersDataReady" absolute>
                        <v-progress-circular indeterminate size="64"></v-progress-circular>
                    </v-overlay>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Chart from "chart.js";
import {mapActions, mapGetters} from 'vuex'
import { Tableau20 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.tableau';

export default {
    data: () => ({
        seasons: [
            1, 2, 3
        ],
        selectedSeason: 1,
        charsByEpisode: null,
        racesChart: null,
        genderChart: null,
        statusChart: null,
        locationsChart: null
    }),
    metaInfo() {
        return {
            title: 'Statistics'
        }
    },
    computed: {
        ...mapGetters([
            'getCharactersByEpisode',
            'getCharactersBySeason',
            'getGetCharsByEpisodeReady',
            'getCharactersDataReady',
            'getRaces',
            'getStatuses',
            'getGenders',
            'getLocations'
        ])
    },
    watch: {
        getCharactersDataReady: function (val) {
            if (val === true) {
                this.createRacesChart()
                this.createGenderChart()
                this.createStatusChart()
                this.createLocationsChart()
            }
        },
        getGetCharsByEpisodeReady: function (val) {
            if (val === true) {
                this.createCharsByEpisode()
            }
        },
        selectedSeason: function (val) {
            this.charsByEpisode.data.labels = this.getCharactersBySeason(val).labels
            this.charsByEpisode.data.datasets[0].data = this.getCharactersBySeason(val).data
            this.charsByEpisode.update();
        }
    },
    methods: {
        createLocationsChart() {
            if (this.locationsChart !== null) {
                return
            }

            let labels = this.getLocations.labels
            let data = this.getLocations.data
            this.locationsChart = new Chart('locations', {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: '# of Characters',
                            data: data,
                        }
                    ]
                },
                options: {
                    plugins: {
                        colorschemes: {
                            scheme: Tableau20
                        }
                    },
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true
                                }
                            }
                        ]
                    }
                }
            })
        },
        createRacesChart() {
            if (this.racesChart !== null) {
                return
            }

            let labels = this.getRaces.labels
            let data = this.getRaces.data
            this.racesChart = new Chart('races', {
                type: "doughnut",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Races",
                            data: data,
                            backgroundColor: Tableau20
                        }
                    ]
                }
            })
        },
        createGenderChart() {
            if (this.genderChart !== null) {
                return
            }

            let labels = this.getGenders.labels
            let data = this.getGenders.data
            this.genderChart = new Chart('genders', {
                type: "doughnut",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Genders",
                            data: data,
                            backgroundColor: Tableau20
                        }
                    ]
                }
            })
        },
        createStatusChart() {
            if (this.statusChart !== null) {
                return
            }

            let labels = this.getStatuses.labels
            let data = this.getStatuses.data
            this.statusChart = new Chart('status', {
                type: "doughnut",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Status",
                            data: data,
                            backgroundColor: Tableau20
                        }
                    ]
                }
            })
        },
        createCharsByEpisode() {
            if (this.charsByEpisode !== null) {
                return
            }

            let labels = this.getCharactersBySeason(this.selectedSeason).labels
            let data = this.getCharactersBySeason(this.selectedSeason).data
            this.charsByEpisode = new Chart('characters-by-episode', {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "# of Characters",
                            data: data,
                            
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    plugins: {
                        colorschemes: {
                            scheme: Tableau20
                        }
                    },
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true
                                }
                            }
                        ]
                    }
                }
            })
        },
        ...mapActions([
            'prepareStats'
        ])
    },
    mounted() {
        this.prepareStats()
    }
};
</script>