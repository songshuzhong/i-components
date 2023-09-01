<template>
  <div id="comments">
    <el-skeleton v-if="!isMounted" :rows="6" animated />
  </div>
</template>
<script>
import {defineComponent, onMounted, ref} from 'vue';
export default defineComponent({
  name: 'Issues',
  props: {
    repo: {
      type: String,
      required: false,
      default: 'songshuzhong/i-comments'
    }
  },
  setup(props) {
    const isMounted = ref(false);
    onMounted(() => {
      const comments = document.getElementById('comments');
      const script = document.createElement('script')
      script.type = 'text/javascript';
      script.src = 'https://utteranc.es/client.js';
      script.setAttribute('repo', props.repo);
      script.setAttribute('issue-term', 1);
      script.setAttribute('theme', 'github-light');
      script.setAttribute('crossorigin', 'anonymous');
      script.onload = script.onreadystatechange = function() {
        if (
          !script.readyState ||
          script.readyState === 'loaded' ||
          script.readyState === 'complete'
        ) {
          script.onload = script.onreadystatechange = null;
          const frame = document.querySelectorAll('.utterances-frame')[0];
          frame.onload = frame.onreadystatechange = function() {
            isMounted.value = true;
            console.log('comments loaded');
          }
        } else {
          console.error('comments loaded');
        }

        script.onerror = function() {
          console.error('comments loaded');
        };
      }
      comments.appendChild(script);
    });
    return {
      isMounted
    };
  }
});
</script>
