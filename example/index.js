import {createApp} from 'vue';
import Application from './App.vue';
import ElementPlus from 'element-plus';
import IRenderer from 'i-renderer/dist/js/renderer';

import 'i-renderer/dist/css/index.css';

const app = createApp(Application);

app
  .use(ElementPlus)
  .use(IRenderer)
  .mount('.i-website-app__container');

window.vue = app;
