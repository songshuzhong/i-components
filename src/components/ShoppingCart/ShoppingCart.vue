<template>
  <template v-if="$isArray(body)">
    <i-component
      v-for="(child, index) in body"
      :key="index"
      :renderer="child.renderer"
      :path="`${$attrs.path}/body/${index}/${child.renderer}`"
      :track="`${$attrs.track}/body/${index}`"
      :props="iAttrs(child)"
      :init-data="state.data"
    />
  </template>
  <i-component
    v-else-if="body?.renderer"
    :renderer="body.renderer"
    :path="`${$attrs.path}/body/${body.renderer}`"
    :track="`${$attrs.track}/body`"
    :props="iAttrs(body)"
    :init-data="state.data"
  />
  <span v-else-if="$isString(body)" v-html="$renderTpl(body, state.data)" />
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted, ref, reactive, watch} from 'vue';

export default defineComponent({
  name: 'ShoppingCart',
  props: {
    name: {
      type: String,
      required: false,
      default: ''
    },
    initData: {
      type: Object,
      required: false,
      default: {},
    },
    inherit: {
      type: Object,
      required: false,
      default() {
        return {
          type: 'all',
          value: [],
        };
      },
    },
    errorInfo: {
      type: [Object, String],
      required: false
    },
    action: {
      type: Function,
      required: false,
    },
    body: {
      type: [Array, Object, String],
      required: false,
      default: ''
    },
    primaryKey: {
      type: String,
      required: false,
      default: 'id'
    }
  },
  setup(props, ctx) {
    const {proxy} = getCurrentInstance();
    const state = reactive({data: {}});
    state.data[props.name] = [];
    const iAttrs = (props) => {
      const {
        // eslint-disable-next-line no-unused-vars
        initData, ...other} = props;

      return other;
    };
    const onLinkageFormatting = (data) => {
      const hasOne = state.data[props.name].filter(i => i[props.primaryKey] = data[props.primaryKey]);
      if (hasOne) {
        hasOne.count = (hasOne.count || 0) + 1;
      } else {
        state.data[props.name].push(data);
      }
    };
    watch(() => props.initData, (val) => {
      state.data = val;
    }, {
      deep: true,
      immediate: true,
    });

    return {
      onLinkageFormatting,
      iAttrs,
      state
    };
  }
});
</script>
