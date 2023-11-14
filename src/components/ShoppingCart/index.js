import ShoppingCart from './ShoppingCart.vue';

const install = (app) => {
  app.component(ShoppingCart.name, ShoppingCart);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  ShoppingCart
};

export {
  ShoppingCart
}
