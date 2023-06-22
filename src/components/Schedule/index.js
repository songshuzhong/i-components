import Schedule from './Schedule.vue';

const install = (app) => {
  app.component(Schedule.name, Schedule);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Schedule
};

export {
  Schedule
}
