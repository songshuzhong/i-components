import Richtxt from './Richtxt.vue';

const install = (app) => {
  app.component(Richtxt.name, Richtxt);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Richtxt
};

export {
  Richtxt
}
