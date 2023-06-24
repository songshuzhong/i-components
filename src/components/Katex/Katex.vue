<template>
  <span ref="latex" class="i-katex katex" v-html="rawHTML" />
</template>

<script>
import {defineComponent, computed} from 'vue';
import katex from 'katex';
import 'katex/dist/katex.css';

export default defineComponent({
  name: 'Katex',
  props: {
    exp: {
      type: String,
      required: false,
      default: ''
    },
    options: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
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
    const rawHTML = computed(() => {
      return katex.renderToString(props.exp, {
        throwOnError: false,
        ...props.options
      })
    });

    return {
      rawHTML
    };
  }
});
</script>
