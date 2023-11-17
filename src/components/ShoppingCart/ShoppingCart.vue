<template>
  <div class="i-shopping-cart__container">
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
    <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
      <div class="ball" v-show="ball.show">
        <div class="ball__inner inner-hook" />
      </div>
    </transition>
  </div>
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted, onBeforeUnmount, ref, reactive, watch} from 'vue';

export default defineComponent({
  name: 'Shopping',
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
    const ball = ref({show: false, el: '', left: '', top: ''});
    let cart = null;
    const iAttrs = (props) => {
      const {
        // eslint-disable-next-line no-unused-vars
        initData, ...other} = props;

      return other;
    };
    const beforeDrop = (el) => {
      if (ball.value.show && ball.value.el) {
        const {left, width} = cart.getBoundingClientRect();
        if (ball.value.left < left) {
          el.classList.add('ball-left');
        } else {
          el.classList.add('ball-right');
        }
        el.style.display = '';
        el.style.left = left + width / 2 + 'px';
        el.style.transform = `translateY(${-(window.innerHeight - ball.value.top - 80)}px)`;
        let inner = el.getElementsByClassName('inner-hook')[0];
        inner.style.transform = `translateX(${ball.value.left}px)`;
      }
    };
    const dropping = (el, done) => {
      if (ball.value.show && ball.value.el) {
        el.offsetHeight;
        el.style.transform = 'translate3d(0,0,0)';
        let inner = el.getElementsByClassName('inner-hook')[0];
        inner.style.transform = 'translate3d(0,0,0)';
        el.addEventListener('transitionend', done);
      }
    };
    let targetRef;
    let dataRef;
    const afterDrop = (el) => {
      if (ball.value.show && ball.value.el) {
        ball.value.show = false;
        ball.value.el = null;
        ball.value.left = null;
        ball.value.top = null;
        el.style.display = 'none';
        el.classList.remove('ball-left');
        el.classList.remove('ball-right');
        cart.classList.add('anima_wobble');
        const timer = setTimeout(() => {
          clearTimeout(timer);
          cart.classList.remove('anima_wobble');
        }, 2000);
        const [name, type] = targetRef.split('?');
        if (type === 'merge') {
          Object.assign(state.data, dataRef);
        } else {
          const hasOne = state.data[props.name].filter(i => i[props.primaryKey] === dataRef[props.primaryKey]);
          if (hasOne.length) {
            hasOne[0].count = (hasOne[0].count || 1) + 1;
          } else {
            dataRef.count = 1;
            state.data[props.name].push(dataRef);
          }
          targetRef = null
          dataRef = null;
        }
      }
    };
    const onLinkageFormatting = (target, data) => {
      if (target.includes(props.name)) {
        if (!ball.value.show && !event.target.classList.contains('i-form__container')) {
          ball.value.show = true;
          ball.value.el = event.target;
          ball.value.left = event.clientX;
          ball.value.top = event.clientY;
        }
        targetRef = target;
        dataRef = data;
      }
    };
    watch(() => props.initData, (val = {}) => {
      Object.assign(state.data, val);
    }, {
      deep: true,
      immediate: true,
    });
    onMounted(() => {
      const timer = setTimeout(() => {
        cart = document.getElementsByClassName('shopping-cart-page')[0].getElementsByClassName('el-tabs__item')[1];
        clearTimeout(timer);
      }, 3000);
      state.data[props.name] = [];
      proxy.$eventHub.$on('component:linkage', onLinkageFormatting, proxy.$attrs.path);
    });
    onBeforeUnmount(() => {
      proxy.$eventHub.$off('component:linkage', onLinkageFormatting, proxy.$attrs.path);
    });
    return {
      onLinkageFormatting,
      iAttrs,
      beforeDrop,
      dropping,
      afterDrop,
      ball,
      state
    };
  }
});
</script>
<style>
.i-shopping-cart__container {
  height: 100%;
}
.ball-left {
  position: fixed;
  bottom: 80px;
  z-index: 0;
  transition: all 1s cubic-bezier(0, 0.2, 1, 1);
}
.ball-right {
  position: fixed;
  bottom: 80px;
  z-index: 0;
  transition: all 1s cubic-bezier(0.2, 0, 1, 1);
}
.ball__inner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: var(--el-color-danger);
  transition: all 1s linear;
}
</style>
