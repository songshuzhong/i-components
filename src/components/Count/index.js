import Count from './Count.vue';

const install = (app) => {
  app.component(Count.name, Count);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Count
};

export {
  Count
}
