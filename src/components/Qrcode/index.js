import Qrcode from './Qrcode.vue';

const install = (app) => {
  app.component(Qrcode.name, Qrcode);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Qrcode
};

export {
  Qrcode
}
