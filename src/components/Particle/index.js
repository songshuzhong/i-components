import Particle from './Particle.vue';

const install = (app) => {
  app.component(Particle.name, Particle);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Particle
};

export {
  Particle
}
