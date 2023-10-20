import {createApp} from 'vue';
import Application from './App.vue';
import ElementPlus from 'element-plus';
import IRenderer from 'i-renderer/dist/js/renderer';

import {Particle} from '../src/components/Particle/index.js';

import 'element-plus/dist/index.css';
import 'i-renderer/dist/css/index.css';

const app = createApp(Application);

const options = {
  renderers: [
    Particle
  ]
};
app.component('Particle', Particle)
app
  .use(ElementPlus)
  .use(IRenderer, options)
  .mount('.i-website-app__container');

window.vue = app;
