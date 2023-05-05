<template>
  <div>
    <count description="asdf" :value="1000" :auto="true" />
    <todo init-api="https://www.fastmock.site/mock/a93e0b29161761b8153cbc02db04c643/api/todos"/>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import {Richtxt} from '../src/components/Richtxt/index.js';
import {Workflow} from '../src/components/Workflow/index.js';
import {Qrcode} from '../src/components/Qrcode/index.js';
import {Driver} from '../src/components/Driver/index.js';
import {Watermark} from '../src/components/Watermark/index.js';
import {Extable} from '../src/components/Extable/index.js';
import {Player} from '../src/components/Player/index.js';
import {Chart} from '../src/components/Chart/index.js';
import {Count} from '../src/components/Count/index.js';
import {Particle} from '../src/components/Particle/index.js';
import {Todo} from '../src/components/Todo/index.js';

export default defineComponent({
  name: 'Application',
  components: {
    Count,
    Workflow,
    Richtxt,
    Qrcode,
    Driver,
    Watermark,
    Extable,
    Player,
    Chart,
    Particle,
    Todo
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

    return {
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
  background: cadetblue;
}
.demo-particle {
  position: absolute;
  height: 100% !important;
  width: 100% !important;
  z-index: 20;
}
</style>
