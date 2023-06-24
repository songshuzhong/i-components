import Katex from './Katex.vue';

const install = (app) => {
  app.component(Katex.name, Katex);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Katex
};

export {
  Katex
}
