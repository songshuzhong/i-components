import Issues from './Issues.vue';

const install = (app) => {
    app.component(Issues.name, Issues);
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    install,
    Issues
};

export {
    Issues
}
