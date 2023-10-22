import {createApp} from 'vue';
import Application from './App.vue';
import ElementPlus from 'element-plus';
import IRenderer from 'i-renderer/dist/js/renderer';

import {Verify} from '../src/components/Verify/index.js';

import 'element-plus/dist/index.css';
import 'i-renderer/dist/css/index.css';

const app = createApp(Application);

const options = {
  renderers: [
    Verify
  ]
};
app.component('Verify', Verify)
app
  .use(ElementPlus)
  .use(IRenderer, options)
  .mount('.i-website-app__container');

window.vue = app;
