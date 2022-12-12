import Workflow from './Workflow.vue';

const install = (app) => {
  app.component(Workflow.name, Workflow);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Workflow
};

export {
  Workflow
}
