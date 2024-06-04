import Weather from './Weather.vue';

const install = (app) => {
  app.component(Weather.name, Weather);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Weather
};

export {
  Weather
}
