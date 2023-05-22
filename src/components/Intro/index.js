import Intro from './Intro.vue';

import 'intro.js/introjs.css';

const install = (app) => {
    app.component(Intro.name, Intro);
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    install,
    Intro
};

export {
    Intro
}
