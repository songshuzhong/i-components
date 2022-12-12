<template>
  <span class="i-plugin-watermark" />
</template>
<script>
import {defineComponent, onMounted, onBeforeUnmount} from 'vue';
import Watermark from 'web-watermark';

export default defineComponent({
  name: 'Watermark',
  props: {
    text: {
      type: String,
      required: false,
      default: 'watermark'
    }
  },
  setup(props) {
    let watermarkDom;
    onMounted(() => {
      watermarkDom = new Watermark({text: props.text});
      watermarkDom.render();
    });
    onBeforeUnmount(() => {
      watermarkDom && watermarkDom.destroy();
    });
  }
});
</script>
