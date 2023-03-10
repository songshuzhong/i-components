<template>
  <div>
    <count description="asdf" :value="1000" :auto="true" />
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
    Chart
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
