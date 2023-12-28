import Joint from './Joint.vue';
import './font/iconfont.css';

const install = (app) => {
  app.component(Joint.name, Joint);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Joint
};

export {
  Joint
}
