import './assets/main.css';
import './assets/normalize.css';
import './assets/base.css';

import { createApp } from 'vue';
// import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/themes/lara-light-blue/theme.css';

import router from '@router';
import App from './App.vue';

const app = createApp(App);

// app.use(createPinia())
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);
app.mount('#app');
