<template>
  <div class="i-form__computed" />
</template>

<script>
import {defineComponent, onMounted, reactive, watch} from 'vue';
export default defineComponent({
  name: 'Bridge',
  props: {
    name: {
      type: String,
      required: false,
      default: ''
    },
    library: {
      type: String,
      required: false,
      default: ''
    },
    type: {
      type: String,
      required: false,
      default: ''
    },
    method: {
      type: String,
      required: false,
      default: ''
    },
    arguments: {
      type: Object,
      required: false,
      default: {}
    }
  },
  setup(props, ctx) {
    const iModelValue = reactive({});
    const onAction = () => {
      return new Promise((resolve) => {
        window[props.library][props.type](props.method, arguments, function(res = {}, status) {
          resolve({
            ...res,
            status
          });
        });
      });
    };
    watch(() => iModelValue[props.name], val => {
      ctx.emit('update:value', val);
    });
    onMounted(async() => {
      if (window[props.library]) {
        iModelValue[props.name] = await onAction();
      }
    });
  }
})
</script>
