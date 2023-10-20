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
        props.steps.forEach(item => {
          steps.push({
            element: `[path='${item.path}']`,
            popover: item
          });
        });
        onDriverStart();
      }
    };
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
