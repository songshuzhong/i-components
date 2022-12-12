import Driver from './Driver.vue';

import 'driver.js/dist/driver.min.css';

const install = (app) => {
  app.component(Driver.name, Driver);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Driver
};

export {
  Driver
}
