import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import 'vuetify/dist/vuetify.min.css'
import { createVuetify } from 'vuetify'
import { VDateInput } from 'vuetify/labs/VDateInput'
import * as vuetifyComponents from 'vuetify/components'
import * as vuetifyDirectives from 'vuetify/directives'

import App from './App.vue'

const vuetify = createVuetify({
    directives: vuetifyDirectives,
    components: {
        VDateInput,
        components1: vuetifyComponents
    }
})

const app = createApp(App);

app.use(vuetify);
app.use(createPinia());

app.mount('#app');