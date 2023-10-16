<template>
  <div class="i-form__computed" />
</template>

<script>
import {defineComponent, onMounted, onBeforeUnmount, reactive, watch, getCurrentInstance} from 'vue';
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
    },
    immediate: Boolean
  },
  setup(props, ctx) {
    const {proxy} = getCurrentInstance();
    const iModelValue = reactive({});
    const onAction = () => {
      return new Promise((resolve) => {
        console.log(`before ${props.type} ${props.library} ${props.method}`);
        window[props.library][props.type](props.method, arguments, function(res = {}, status) {
          console.log(`in ${props.type} ${props.library} ${props.method}`);
          resolve({
            ...res,
            status
          });
        });
        console.log(`after ${props.type} ${props.library} ${props.method}`);
      });
    };
    const handleAction = async(target) => {
      if (target === props.name) {
        iModelValue[props.name] = await onAction();
        console.log(iModelValue[props.name]);
      }
    };
    watch(() => iModelValue[props.name], val => {
      ctx.emit('update:value', val);
    }, {
      deep: true
    });
    onMounted(() => {
      proxy.$eventHub.$on('component:telecontrol', handleAction);
      const timer = setTimeout(async() => {
        if (window[props.library] && props.immediate) {
          iModelValue[props.name] = await onAction();
          console.log(iModelValue[props.name]);
        }
        if (!window[props.library]) {
          iModelValue[props.name] = {
            status: 0,
            message: 'out of app'
          };
        }
        clearTimeout(timer);
      }, 2000);
    });
    onBeforeUnmount(() => {
      proxy.$eventHub.$off('component:telecontrol', handleAction);
    });
  }
})
</script>
