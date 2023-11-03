import Prize from './Prize.vue';

const install = (app) => {
  app.component(Prize.name, Prize);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Prize
};

export {
  Prize
}
