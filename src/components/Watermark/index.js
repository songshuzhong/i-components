import Watermark from './Watermark.vue';

const install = (app) => {
  app.component(Watermark.name, Watermark);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Watermark
};

export {
  Watermark
}
