<template>
  <canvas ref="canvas" :class="classname" />
</template>
<script>
import {defineComponent, getCurrentInstance, onMounted, nextTick} from 'vue';
import {box} from './box';

export default defineComponent({
  name: 'Particle',
  props: {
    r: {
      type: [String, Number],
      required: false,
      default: 10
    },
    width: {
      type: [Number, String],
      required: false
    },
    height: {
      type: [Number, String],
      required: false
    },
    classname: {
      type: String,
      required: false
    },
    action: {
      type: Function,
      required: false
    }
  },
  setup(props) {
    const {proxy} = getCurrentInstance();
    const WIDTH = props.width || document.documentElement.clientWidth;
    const HEIGHT = props.height || document.documentElement.clientHeight;
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
        round[i] = new box(i, Math.random() * WIDTH, Math.random() * HEIGHT, {content, height: HEIGHT, radius: props.r});
        round[i].draw();
      }
      animate();
    };
    onMounted(() => {
      ctx = proxy.$.refs.canvas;
      content = ctx.getContext('2d');
      ctx.width = WIDTH;
      ctx.height = HEIGHT;
      nextTick(() => {
        init();
      });
    });
  }
});
</script>
