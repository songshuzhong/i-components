<template>
  <canvas ref="canvas" :width="width" :height="height" />
</template>
<script>
import {defineComponent, getCurrentInstance, onMounted} from 'vue';
import {box} from './box';

export default defineComponent({
  name: 'Particle',
  props: {
    width: {
      type: [Number, String],
      required: false,
      default: '100%'
    },
    height: {
      type: [Number, String],
      required: false,
      default: '100%'
    }
  },
  setup() {
    const {proxy} = getCurrentInstance();
    const WIDTH = document.documentElement.clientWidth;
    const HEIGHT = document.documentElement.clientHeight;
    const round = [];
    const initRoundPopulation = 80;
    let ctx;
    let content;

    const animate = () => {
      content.clearRect(0, 0, WIDTH, HEIGHT);
      for (const i in round) {
        round[i].move();
      }
      requestAnimationFrame(animate);
    };
    const init = () => {
      for (let i = 0; i < initRoundPopulation; i++) {
        round[i] = new box(i, Math.random() * WIDTH, Math.random() * HEIGHT, {content, height: HEIGHT});
        round[i].draw();
      }
      animate();
    };
    onMounted(() => {
      ctx = proxy.$.refs.canvas;
      content = ctx.getContext('2d');
      ctx.width = WIDTH;
      ctx.height = HEIGHT;
      init();
    });
  }
});
</script>
