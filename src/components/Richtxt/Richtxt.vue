<template>
  <div ref="richtxt" class="i-form__richtext" />
</template>
<script>
import {getCurrentInstance, defineComponent, reactive, watch, onMounted, onBeforeUnmount} from 'vue';
import E from 'wangeditor'

export default defineComponent({
  name: 'Richtxt',
  props: {
    name: String,
    defaultValue: String,
    value: String
  },
  setup(props, ctx) {
    const { proxy } = getCurrentInstance();
    const iModelValue = reactive({});
    let richEditor;
    const onRichtxtChange = txt => {
      iModelValue[props.name] = txt;
    };
    watch(() => props.defaultValue, (val) => {
      iModelValue[props.name] = val;
    }, {
      immediate: true,
    });

    watch(() => props.value, (val) => {
      iModelValue[props.name] = val || 0;
    }, {
      immediate: true,
    });

    watch(() => iModelValue[props.name], (val) => {
      ctx.emit('update:value', val);
    });

    onMounted(() => {
      richEditor = new E(proxy.$refs.richtxt);
      richEditor.config.zIndex = 1;
      richEditor.config.onchange = onRichtxtChange;
      richEditor.create();
      richEditor.txt.html(iModelValue[props.name] || '');
    });
    onBeforeUnmount(() => {
      richEditor && richEditor.destroy && richEditor.destroy();
    });

    return {
      path: ctx.attrs.path,
      iModelValue
    };
  }
});
</script>
