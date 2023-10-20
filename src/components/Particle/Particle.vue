<template>
  <canvas ref="canvas" :class="classname" />
</template>
<script>
import {defineComponent, getCurrentInstance, onMounted, onBeforeUnmount, ref, nextTick} from 'vue';
import {box} from './box.js';

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
    const width = ref(props.width || document.documentElement.clientWidth);
    const HEIGHT = props.height || document.documentElement.clientHeight;
    const round = [];
    const initRoundPopulation = 80;
    let ctx;
    let content;
    let resizeObserver;
    const animate = () => {
      content.clearRect(0, 0, width.value, HEIGHT);
      for (const i in round) {
        round[i].move();
      }
      requestAnimationFrame(animate);
    };
    const init = () => {
      for (let i = 0; i < initRoundPopulation; i++) {
        round[i] = new box(i, Math.random() * width.value, Math.random() * HEIGHT, {content, height: HEIGHT, radius: props.r});
        round[i].draw();
      }
      animate();
    };
    const debounce = (fn, wait = 200) => {
      let timer;
      return function() {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fn.call(this);
        }, wait);
      }
    };
    const resize = debounce(() => {
      width.value = proxy.$.refs.canvas.parentNode.offsetWidth;
      ctx.width = width.value;
      init();
    });
    onMounted(() => {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(proxy.$.refs.canvas.parentNode);
      width.value = proxy.$.refs.canvas.parentNode.offsetWidth;
      ctx = proxy.$.refs.canvas;
      content = ctx.getContext('2d');
      ctx.width = width.value;
      ctx.height = HEIGHT;
      nextTick(() => {
        init();
      });
    });
    onBeforeUnmount(() => {
      resizeObserver.unobserve(proxy.$.refs.canvas.parentNode);
    });
  }
});
</script>
