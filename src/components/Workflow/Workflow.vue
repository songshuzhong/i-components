<template>
  <div
    ref="container"
    :class="['i-workflow__container']"
    :style="{height: defaultHeight}"
  >
    <div
      ref="workflow"
      class="i-workflow__container__body"
    />
    <div class="i-workflow__container__panel" ref="js-properties-panel" />
  </div>
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted, ref, reactive, watch, nextTick} from 'vue';
import BpmnJS from 'bpmn-js/lib/Modeler';
import {BpmnPropertiesPanelModule, BpmnPropertiesProviderModule} from 'bpmn-js-properties-panel';
import {xmlStr, customTranslate} from './xmlStr';

import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';

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
        instance = new BpmnJS({
          container: proxy.$refs.workflow,
          propertiesPanel: {
            parent: proxy.$refs['js-properties-panel']
          },
          additionalModules: [
            BpmnPropertiesPanelModule,
            BpmnPropertiesProviderModule,
            {
              translate: ['value', customTranslate]
            }
          ]
        });
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
      nextTick(() => {
        const height = props.height || proxy.$refs.container?.parentNode?.offsetHeight - 16;
        defaultHeight.value = typeof height === 'number'? `${height}px`: height;
        createWork();
      });
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
<style>
.i-workflow__container {
  position: relative;
  border: 1px dashed black;
}
.i-workflow__container__body {
  height: 100%;
}
.i-workflow__container__panel {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
