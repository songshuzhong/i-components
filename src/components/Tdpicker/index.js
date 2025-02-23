import Tdpicker from './Tdpicker.vue';

const install = (app) => {
  app.component(Tdpicker.name, Tdpicker);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Tdpicker
};

export {
  Tdpicker
}
