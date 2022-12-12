<template>
  <div
    class="i-video__container"
    :style="{
      width: `${width}px`,
      height: `${height}px`
    }"
  >
    <video
      :ref="uuid"
      muted="muted"
      class="i-video__container__video video-js" />
  </div>
</template>
<script>
import {defineComponent, onMounted, getCurrentInstance, onBeforeUnmount, ref, watch, nextTick} from 'vue';
import VideoJS from 'video.js';

export default defineComponent({
  name: 'Player',
  props: {
    src: {
      type: String,
      required: false,
      default: ''
    },
    poster: {
      type: String,
      required: false,
      default: ''
    },
    type: {
      type: String,
      required: false,
      default: 'video/mp4'
    },
    autoplay: {
      type: Boolean,
      required: false,
      default: false
    },
    preload: {
      type: Boolean,
      required: false,
      default: false
    },
    volume: {
      type: Number,
      required: false,
      default: 1
    },
    width: {
      type: [Number, String],
      required: false,
      default: '640'
    },
    height: {
      type: [Number, String],
      required: false,
      default: '264'
    },
    action: {
      type: Function,
      required: false,
    },
    initData: {
      type: Object,
      required: false
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const uuid = 'id' + new Date().getTime();
    const computedUrl = ref('');
    const computedPoster = ref('');
    let player;

    const updateVideo = () => {
      player && player.dispose();
      if (computedUrl.value) {
        player = VideoJS(proxy.$refs[uuid], {
          controls: true,
          autoplay: props.autoplay,
          width: props.width,
          height: props.height,
          sources: [{
            src: computedUrl.value,
            poster: computedPoster.value,
          }]
        }, function onPlayerReady() {
          // player.play();
        });
      }
    };
    watch(() => props.initData, (val) => {
      const src = proxy.$compiledUrl(props.src, val);
      const poster =  proxy.$compiledUrl(props.poster, val);
      if (computedUrl.value !== src) {
        computedUrl.value = src;
        computedPoster.value = poster;
        nextTick(() => {
          updateVideo();
        });
      }
    }, {
      deep: true,
      immediate: true,
    });

    onMounted(() => {
      if (computedUrl.value !== props.src) {
        updateVideo();
      }
    });
    onBeforeUnmount(() => {
      player && player.dispose();
    });

    return {
      computedPoster,
      computedUrl,
      uuid
    };
  },
});
</script>
