import Verify from './Verify.vue';

const install = (app) => {
  app.component(Verify.name, Verify);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Verify
};

export {
  Verify
}
