import {createApp} from 'vue';
import Application from './App.vue';

const app = createApp(Application);

app.mount('.i-website-app__container');

window.vue = app;
