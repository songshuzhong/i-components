<template>
  <div>
    <schema :init-schema="schema"/>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import {Schema} from 'i-renderer/dist/js/renderer';

export default defineComponent({
  name: 'Application',
  components: {
    Schema
  },
  setup() {
    const option = {
      "grid": {
        "top": 15,
            "right": 15,
            "bottom": 20,
            "left": 30
      },
      "tooltip": {
        "trigger": "axis"
      },
      "xAxis": {
        "type": "category",
            "boundaryGap": false,
            "data": [
          "1天",
          "2天",
          "3天",
          "4天",
          "5天",
          "6天",
          "7天"
        ]
      },
      "yAxis": {
        "type": "value"
      },
      "series": [
        {
          "name": "邮件营销",
          "type": "line",
          "stack": "总量",
          "data": [
            12,
            32,
            11,
            34,
            90,
            23,
            21
          ]
        },
        {
          "name": "联盟广告",
          "type": "line",
          "stack": "总量",
          "data": [
            22,
            82,
            91,
            24,
            90,
            30,
            30
          ]
        },
        {
          "name": "视频广告",
          "type": "line",
          "stack": "总量",
          "data": [
            50,
            32,
            18,
            14,
            90,
            30,
            50
          ]
        }
      ]
    };
    const schema = {
      renderer: 'page',
      body: [
        {
          name: 'aaa',
          renderer: 'alert'
        },
        {
          name: 'bbb',
          renderer: 'alert'
        },
        {
          renderer: 'intro',
          lazy: true,
          steps: [
            {
              element: 'aaa',
              title: 'intro',
              intro: 'this is intro.'
            },
            {
              element: 'bbb',
              title: 'intro',
              intro: 'this is intro.'
            }
          ]
        }
      ]
    };
    return {
      schema,
      option
    };
  },
});
</script>
<style>
html,
body,
.i-website-app__container {
  position: relative;
  height: 100%;
}
.i-website-app__container {
  padding: 20px;
}
</style>
