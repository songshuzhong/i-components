import Bridge from './Bridge.vue';

const install = (app) => {
  app.component(Bridge.name, Bridge);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Bridge
};

export {
  Bridge
}
