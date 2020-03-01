<template>
    <v-app>
        <v-content>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="8" md="4">
                        <v-card class="elevation-12">
                            <v-tabs
                                v-model="tab"
                                background-color="blue darken-2"
                                centered
                                dark
                                icons-and-text
                            >
                                <v-tabs-slider></v-tabs-slider>

                                <v-tab href="#tab-login">
                                    Login
                                    <v-icon>mdi-login-variant</v-icon>
                                </v-tab>

                                <v-tab href="#tab-register">
                                    Register
                                    <v-icon>mdi-account-plus-outline</v-icon>
                                </v-tab>
                            </v-tabs>
                            <v-alert
                                :value="userError != null"
                                tile
                                transition="scale-transition"
                                type="error"
                                dismissible
                                class="mb-0"
                                v-on:input="onAlertToggle"
                            >
                             {{ userError }}
                            </v-alert>
                            <v-tabs-items v-model="tab">
                                <v-tab-item value="tab-login">
                                    <v-card>
                                        <v-card-text>
                                            <v-form @submit.prevent>
                                                <v-text-field
                                                    label="Email"
                                                    name="login"
                                                    prepend-icon="email"
                                                    type="text"
                                                    v-model="loginForm.email"
                                                    :rules="[required]"
                                                    v-on:keyup.enter="login"
                                                />

                                                <v-text-field
                                                    id="password"
                                                    label="Password"
                                                    name="password"
                                                    prepend-icon="lock"
                                                    type="password"
                                                    v-model="loginForm.password"
                                                    :rules="[required]"
                                                    v-on:keyup.enter="login"
                                                />
                                            </v-form>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer />
                                            <v-btn class="mr-2" color="primary" @click="login">Login</v-btn>
                                        </v-card-actions>
                                        <v-footer>
                                            <v-col class="text-center pb-0 pt-0" cols="12">
                                                Need an account? <a @click.prevent="tab='tab-register'">Register!</a>
                                            </v-col>
                                        </v-footer>
                                    </v-card>
                                </v-tab-item>
                                <v-tab-item value="tab-register">
                                    <v-card>
                                        <v-card-text>
                                            <v-form @submit.prevent="register">
                                                <v-text-field
                                                    label="Name"
                                                    name="name"
                                                    prepend-icon="person"
                                                    type="text"
                                                    v-model="registerForm.name"
                                                    :rules="[required]"
                                                    v-on:keyup.enter="register"
                                                />
                                                <v-text-field
                                                    label="Email"
                                                    name="email"
                                                    prepend-icon="email"
                                                    type="text"
                                                    v-model="registerForm.email"
                                                    :rules="[required]"
                                                    v-on:keyup.enter="register"
                                                />
                                                <v-text-field
                                                    id="password"
                                                    label="Password"
                                                    name="password"
                                                    prepend-icon="lock"
                                                    type="password"
                                                    v-model="registerForm.password"
                                                    :rules="[required]"
                                                    v-on:keyup.enter="register"
                                                />
                                                <v-text-field
                                                    id="confirmPassword"
                                                    label="Confirm Password"
                                                    name="confirmPassword"
                                                    prepend-icon="lock"
                                                    type="password"
                                                    v-model="registerForm.confirmPassword"
                                                    :rules="[validatePassword]"
                                                    v-on:keyup.enter="register"
                                                />
                                            </v-form>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer />
                                            <v-btn class="mr-2" color="success" @click="register">Register</v-btn>
                                        </v-card-actions>
                                        <v-footer>
                                            <v-col class="text-center pb-0 pt-0" cols="12">
                                                Have an account? <a @click.prevent="tab='tab-login'">Login!</a>
                                            </v-col>
                                        </v-footer>
                                    </v-card>
                                </v-tab-item>
                            </v-tabs-items>
                            <v-overlay :value="isUserLoading" absolute>
                                <v-progress-circular indeterminate size="64"></v-progress-circular>
                            </v-overlay>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
    computed: {
        ...mapGetters([
            'getUser',
            'userError',
            'isUserLoading'
        ])
    },
    metaInfo() {
        return {
            title: 'Login/Register'
        }
    },
    watch: {
        getUser(value) {
            if (value.authenticated) {
                this.$router.push('/home')
            }
        },
        tab() {
            this.setError(null)
        }
    },
    data: () => ({
        tab: 'tab-login',
        registerForm: {
            email: '',
            name: '',
            password: '',
            confirmPassword: ''
        },
        loginForm: {
            email: '',
            password: ''
        }
    }),
    created() {
        this.setLoading(false)
    },
    methods: {
        required: value => !!value || 'This field is required.',
        validatePassword() {
            return this.registerForm.password === this.registerForm.confirmPassword ? '' : 'Passwords do not match'
        },
        login() {
            this.signIn(this.loginForm)
        },
        register() {
            this.signUp(this.registerForm)
        },
        onAlertToggle(val) {
            let dismissed = val === false

            if (dismissed) {
                this.setError(null)
            }
        },
        ...mapActions([
            'signUp',
            'signIn',
            'setError'
        ]),
        ...mapMutations([
            'setLoading',
            'setError'
        ])
    }
};
</script>