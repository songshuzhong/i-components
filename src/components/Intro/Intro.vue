<template>
  <span class="i-plugin-intro" />
</template>
<script>
import {defineComponent, getCurrentInstance, onMounted} from 'vue';
import IntroJs from 'intro.js';

const DEFAULT_OPTIONS = {
  nextLabel: '下一个',
  prevLabel: '上一个',
  doneLabel: '完成',
  exitOnOverlayClick: false,
  showStepNumbers: true,
  disableInteraction: true,
  showBullets: false,
};

export default defineComponent({
  name: 'Intro',
  props: {
    steps: {
      type: [Array, Object],
      required: false
    }
  },
  setup(props) {
    const {proxy} = getCurrentInstance();
    let steps = [];
    let instance = IntroJs();

    const initIntro = () => {
      if (props.steps && !proxy.$iRenderConfig.editable) {
        props.steps.forEach((item, index) => {
          steps.push({
            ...item,
            step: index,
            element: `[path='${item.path}']`
          });
        });
        instance.setOptions({
          ...DEFAULT_OPTIONS,
          steps
        }).start();
      }
    };

    onMounted(() => {
      initIntro();
    });
  }
});
</script>
