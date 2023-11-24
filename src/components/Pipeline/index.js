import Pipeline from './Pipeline.vue';

const install = (app) => {
    app.component(Pipeline.name, Pipeline);
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    install,
    Pipeline
};

export {
    Pipeline
}
