import Extable from './Extable.vue';

const install = (app) => {
  app.component(Extable.name, Extable);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Extable
};

export {
  Extable
}
