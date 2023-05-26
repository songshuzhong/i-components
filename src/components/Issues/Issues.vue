<template>
  <div id="comments" />
</template>
<script>
import {defineComponent, onMounted} from 'vue';
export default defineComponent({
  name: 'Issues',
  setup() {
    onMounted(() => {
      const comments = document.getElementById('comments');
      const script = document.createElement('script')
      script.type = 'text/javascript';
      script.src = 'https://utteranc.es/client.js';
      script.setAttribute('repo', 'songshuzhong/i-comments');
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
          console.log('comments loaded');
        } else {
          console.error('comments loaded');
        }

        script.onerror = function() {
          console.error('comments loaded');
        };
      }
      comments.appendChild(script);
    });
  }
});
</script>
