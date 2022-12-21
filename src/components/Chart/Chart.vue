<template>
  <div
    class="i-chart__container"
    :style="{height: defaultHeight}"
  >
    <div
      ref="chart"
      style="height:100%;"
    />
  </div>
</template>
<script>
import {defineComponent, getCurrentInstance, onMounted, ref, watch, nextTick} from 'vue';
import {cloneDeep} from 'lodash';
import {appendScript} from '../../utils/appendAssets';
import * as Echarts from 'echarts';
import 'echarts-wordcloud';
import 'echarts/extension/bmap/bmap';

export default defineComponent({
  name: 'Chart',
  props: {
    name: {
      type: String,
      required: false,
      default: ''
    },
    height: {
      type: [Number, String],
      required: false
    },
    initData: {
      type: Object,
      required: false
    },
    config: {
      type: Object,
      required: false,
    },
    useMap: {
      type: Boolean,
      required: false,
      default: false
    },
    useWordcloud: {
      type: Boolean,
      required: false,
      default: false
    },
    action: {
      type: Function,
      required: false,
    },
    actions: {
      type: Object,
      required: false,
    },
  },
  setup(props, ctx) {
    const { proxy } = getCurrentInstance();
    const loading = ref(false);
    const error = ref(false);
    const defaultHeight = ref(200);
    const iConfig = ref();
    const isMounted = ref(false);
    let chartFactory;
    iConfig.value = cloneDeep(props.config);

    const onComponentUpdate = () => {
      if (isMounted.value) {
        error.value = false;
        loading.value = true;
        const defaultConfig = cloneDeep(props.config);
        iConfig.value = compiledConfig(defaultConfig, props.initData);
        nextTick(() => {
          createEcharts();
        });
      }
    };
    const compiledConfig = (config = {}, data) => {
      const temp = JSON.stringify(config);
      const option = temp.replace(/"\${([^}{]+?)}"/gi, (escape, name) => {
        return JSON.stringify(data[name]) || '""';
      });
      return JSON.parse(option);
    };
    const createEcharts = () => {
      try {
        chartFactory = Echarts.init(proxy.$refs.chart);
        chartFactory.setOption(iConfig.value);
        chartFactory.on('click', handleClick);
      } catch (e) {
        error.value = true;
        console.error(e);
      } finally {
        loading.value = false;
      }
    };
    const handleClick = (data) => {
      if (!props.actions) {
        return;
      }
      const {
        $vars, encode, event, dimensionNames, ...other
      } = data;
      props.action(props.actions, other);
    };
    const renderMap = () => {
      if (props.useMap) {
        return appendScript('', '', 'https://api.map.baidu.com/getscript?ak=R1g6V9BEDdFBoOYlbOHPUXsHUaGjH2HL');
      }
      return Promise.resolve();
    };
    watch(() => isMounted.value, () => {
      onComponentUpdate();
    });
    watch(() => props.initData, val => {
      onComponentUpdate();
    }, {
      deep: true
    });

    onMounted(() => {
      const height = props.height || proxy.$refs.chart?.parentNode?.offsetWidth * 0.618;
      defaultHeight.value = typeof height === 'number'? `${height}px`: height;
      renderMap().then(() => {
        isMounted.value = true;
      });
    });

    return {
      onComponentUpdate,
      handleClick,
      createEcharts,
      defaultHeight,
      loading,
      error
    };
  },
});
</script>
