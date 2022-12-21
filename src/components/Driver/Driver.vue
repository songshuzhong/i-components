<template>
  <span class="i-plugin-driver" />
</template>
<script>
import {defineComponent, getCurrentInstance, onMounted} from 'vue';
import Driver from 'driver.js';

export default defineComponent({
  name: 'Driver',
  props: {
    steps: {
      type: [Array, Object],
      required: false
    }
  },
  setup(props, ctx) {
    const { proxy } = getCurrentInstance();
    let steps = [];
    let instance;

    const initDriver = () => {
      if (props.steps && !proxy.$iRenderConfig.editable) {
        createSteps().then(() => onDriverStart());
      }
    };
    const createSteps = () => new Promise((resolve) => {
      props.steps.forEach(item => {
        proxy.$eventHub.$emit('component:track', item.element, path => {
          steps.push({
            element: `[path='${path}']`,
            popover: item
          });
          if (steps.length === props.steps.length) {
            resolve();
          }
        });
      });
    });
    const onDriverStart = async() => {
      event.preventDefault();
      event.stopPropagation();
      if (instance) {
        return instance.start();
      }
      instance = new Driver({
        doneBtnText: '完成',
        closeBtnText: '关闭',
        nextBtnText: '下一步',
        prevBtnText: '上一步'
      });
      instance.defineSteps(steps);
      const timer = setTimeout(() => {
        instance.start();
        clearTimeout(timer);
      }, 500);
    };

    onMounted(() => {
      initDriver();
    });
  }
});
</script>
