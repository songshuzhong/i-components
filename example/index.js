import {createApp} from 'vue';
import Application from './App.vue';
import ElementPlus from 'element-plus';
import IRenderer from 'i-renderer/dist/js/renderer';

import {Schedule} from '../src/components/Schedule/index.js';

import 'element-plus/dist/index.css';
import 'i-renderer/dist/css/index.css';

const app = createApp(Application);

const options = {
  renderers: [
    Schedule
  ]
};
app.component('Schedule', Schedule)
app
  .use(ElementPlus)
  .use(IRenderer, options)
  .mount('.i-website-app__container');

window.vue = app;
