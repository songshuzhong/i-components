import Player from './Player.vue';

import 'video.js/dist/video-js.min.css';

const install = (app) => {
  app.component(Player.name, Player);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Player
};

export {
  Player
}
