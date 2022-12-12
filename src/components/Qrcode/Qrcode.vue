<template>
  <div
    :class="['i-qrcode__container', classname]"
    :style="{
      width: `${size}px`,
      height: `${size}px`
    }"
  >
    <div ref="qrcode" />
  </div>
</template>
<script>
import {defineComponent, onMounted, getCurrentInstance} from 'vue';
import QRCode from 'qrcode2';

export default defineComponent({
  name: 'Qrcode',
  props: {
    size: {
      type: Number,
      required: false,
      default: 150
    },
    classname: {
      type: String,
      required: false,
      default: ''
    },
    value: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup(props) {
    const {proxy} = getCurrentInstance();
    const init = () => {
      new QRCode(proxy.$.refs.qrcode, {
        width: props.size,
        height: props.size,
        text: props.value
      })
    };

    onMounted(() => {
      init();
    });
  },
});
</script>
