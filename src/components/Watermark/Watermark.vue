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
    },
    destructible: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props) {
    let watermarkDom;
    onMounted(() => {
      watermarkDom = new Watermark({text: props.text});
      watermarkDom.render();
    });
    onBeforeUnmount(() => {
      if (props.destructible) {
        watermarkDom && watermarkDom.destroy();
      }
    });
  }
});
</script>
