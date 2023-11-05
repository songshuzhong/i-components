import Prize2 from './Prize2.vue';

const install = (app) => {
  app.component(Prize2.name, Prize2);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Prize2
};

export {
  Prize2
}
