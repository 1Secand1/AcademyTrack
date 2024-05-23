import '@assets/main.css';

import { createApp } from 'vue';
// import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/saga-blue/theme.css';

import router from '@router';
import App from './App.vue';

const app = createApp(App);
//app.component('InputText', InputText);

// app.use(createPinia())
app.use(router);
app.use(PrimeVue);
app.mount('#app');
