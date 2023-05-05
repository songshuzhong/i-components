import Todo from './Todo.vue';

const install = (app) => {
  app.component(Todo.name, Todo);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Todo
};

export {
  Todo
}
