import Chart from './Chart.vue';

const install = (app) => {
  app.component(Chart.name, Chart);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Chart
};

export {
  Chart
}
