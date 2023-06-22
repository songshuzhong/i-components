import Cascader from './index.vue';

const install = (app) => {
  app.component(Cascader.name, Cascader);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Cascader
};

export {
  Cascader
}
