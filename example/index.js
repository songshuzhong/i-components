import {createApp} from 'vue';
import Application from './App.vue';
import ElementPlus from 'element-plus';
import IRenderer from 'i-renderer/dist/js/renderer';

/*import {Richtxt} from '../src/components/Richtxt/index.js';
import {Workflow} from '../src/components/Workflow/index.js';
import {Qrcode} from '../src/components/Qrcode/index.js';
import {Driver} from '../src/components/Driver/index.js';
import {Watermark} from '../src/components/Watermark/index.js';
import {Extable} from '../src/components/Extable/index.js';
import {Player} from '../src/components/Player/index.js';
import {Chart} from '../src/components/Chart/index.js';
import {Count} from '../src/components/Count/index.js';
import {Particle} from '../src/components/Particle/index.js';
import {Todo} from '../src/components/Todo/index.js';
import {Intro} from '../src/components/Intro/index.js';*/
import {Issues} from '../src/components/Issues/index.js';

import 'element-plus/dist/index.css';
import 'i-renderer/dist/css/index.css';

const app = createApp(Application);

const options = {
  renderers: [
    /*Count,
    Workflow,
    Richtxt,
    Qrcode,
    Driver,
    Watermark,
    Extable,
    Player,
    Chart,
    Particle,
    Todo,
    Intro*/
    Issues
  ]
};

app
  .use(ElementPlus)
  .use(IRenderer, options)
  .mount('.i-website-app__container');

window.vue = app;
