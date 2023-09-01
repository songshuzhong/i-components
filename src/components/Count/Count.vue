<template>
  <div :class="['i-info__container', classname]">
    <div v-if="auto" class="i-info__title" ref="countRef" />
    <div v-else class="i-info__title">
      {{ renderTitle }}
    </div>
    <div v-if="unit" class="i-info__unit">
      {{ unit }}
    </div>
    <el-tooltip v-if="tip" :content="renderTip" placement="top-start">
      <el-icon size="12" class="i-info__tip">
        <component is="info-filled" />
      </el-icon>
    </el-tooltip>
    <div v-if="description" class="i-info__description">
      {{ renderDescription }}
    </div>
  </div>
</template>
<script>
import {defineComponent, computed, getCurrentInstance, onMounted, onBeforeUnmount} from 'vue';
import {CountUp} from 'countup.js';

export default defineComponent({
  name: 'Count',
  props: {
    value: {
      type: [String, Number],
      required: false,
      default: ''
    },
    unit: {
      type: String,
      required: false,
      default: ''
    },
    tip: {
      type: String,
      required: false,
      default: ''
    },
    description: {
      type: String,
      required: false,
      default: ''
    },
    auto: {
      type: Boolean,
      required: false,
      default: false
    },
    classname: {
      type: String,
      required: false,
      default: ''
    },
    action: {
      type: Function,
      required: false
    },
    initData: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  },
  setup(props, ctx) {
    const { proxy } = getCurrentInstance();
    let instance;

    const renderTitle = computed(() => {
      if (props.value) {
        return proxy.$renderTpl(props.value, props.initData);
      }
      return undefined;
    });
    const renderTip = computed(() => {
      if (props.tip) {
        return proxy.$renderTpl(props.tip, props.initData);
      }
      return undefined;
    });
    const renderDescription = computed(() => {
      if (props.description) {
        return proxy.$renderTpl(props.description, props.initData);
      }
      return undefined;
    });
    const startCountUp = () => {
      const value = proxy.$expressionEval(props.value, props.initData);
      instance = new CountUp(proxy.$refs.countRef, value);
      if (!instance.error) {
        instance.start();
      } else {
        proxy.$message.error(instance.error);
        console.error(instance.error);
      }
    };

    onMounted(() => {
      if (props.auto) {
        startCountUp();
      }
    });
    onBeforeUnmount(() => {
      instance&&instance.pauseResume();
    });

    return {
      renderTitle,
      renderTip,
      renderDescription
    };
  }
});
</script>
<style lang="scss">
.i-info__container {
  position: relative;
  padding: 5px 0;
  .i-info__title {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    font-weight: 500;
    font-size: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--el-text-color-primary);
  }
  .i-info__unit {
    display: inline-block;
    margin-left: 5px;
    font-weight: 400;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--el-text-color-secondary);
  }
  .i-info__tip {
    position: absolute;
  }
  .i-info__description {
    padding: 0 5px;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.5;
    color: var(--el-text-color-regular);
  }
}
</style>
