import HelloWorld from './HelloWorld.vue';

const install = (app) => {
  app.component(HelloWorld.name, HelloWorld);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  HelloWorld
};

export {
  HelloWorld
}
