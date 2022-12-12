<template>
  <div
    :class="['i-workflow__container']"
    :style="{height: defaultHeight}"
  >
    <div
      ref="workflow"
      class="i-workflow__container__body"
    />
  </div>
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted, ref, reactive, watch} from 'vue';
import BpmnJS from 'bpmn-js';
import { xmlStr } from './xmlStr';

import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/diagram-js.css';

export default defineComponent({
  name: 'Workflow',
  props: {
    name: String,
    defaultValue: String,
    value: String
  },
  setup(props, ctx) {
    const { proxy } = getCurrentInstance();
    const iModelValue = reactive({[props.name]: xmlStr});
    const loading = ref(false);
    const error = ref(false);
    const defaultHeight = ref(200);
    let instance;

    const createWork = () => {
      try {
        error.value = false;
        instance = new BpmnJS({container: proxy.$refs.workflow});
        instance.importXML(iModelValue[props.name]);
      } catch (e) {
        error.value = true;
        console.error(e);
      } finally {
        loading.value = false;
      }
    };

    watch(() => props.value, (val) => {
      if (val) {
        iModelValue[props.name] = val;
      }
    }, {
      immediate: true,
    });

    onMounted(() => {
      loading.value = true;
      const height = props.height || proxy.$refs.workflow?.parentNode?.offsetWidth * 0.618;
      defaultHeight.value = typeof height === 'number'? `${height}px`: height;
      createWork();
    });

    return {
      path: ctx.attrs.path,
      defaultHeight,
      loading,
      error,
      iModelValue
    };
  }
});
</script>
