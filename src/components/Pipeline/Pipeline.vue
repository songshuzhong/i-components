<template>
  <canvas ref="canvas" class="i-pipeline__container" />
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted} from 'vue';

export default defineComponent({
  name: 'Pipeline',
  props: {
    action: {
      type: Function,
      required: false
    },
    initData: Object,
    lines: {
      type: Array,
      required: false,
      default: () => {
        return [
          {
            s: [0, 20],
            e: [1, 20]
          },
          {
            s: [520, 20],
            e: [520, 310]
          },
          {
            s: [490, 310],
            e: [650, 310],
            xTag: [true, false]
          },
          {
            s: [530, 340],
            e: [650, 340],
            xTag: [true, false]
          },
          {
            s: [530, 340],
            e: [530, 370],
            yTag: [true, false]
          },
          {
            s: [190, 100],
            e: [190, 300],
            yTag: [true, false]
          },
          {
            s: [190, 100],
            e: [490, 100],
            xTag: [true, true]
          },
          {
            s: [490, 100],
            e: [490, 310],
            yTag: [true, true]
          },
          {
            s: [850, 20],
            e: [850, 310]
          },
          {
            s: [820, 310],
            e: [990, 310],
            xTag: [true, false]
          },
          {
            s: [750, 132],
            e: [810, 132],
            xTag: [false, true]
          },
          {
            s: [810, 132],
            e: [810, 315],
            yTag: [true, true]
          },
          {
            s: [860, 340],
            e: [860, 380],
            yTag: [true, false]
          },
          {
            s: [860, 340],
            e: [990, 340],
            xTag: [true, false]
          },
          {
            s: [335, 45],
            e: [920, 45],
            xTag: [true, true]
          },
          {
            s: [335, 45],
            e: [335, 140],
            yTag: [true, false]
          },
          {
            s: [920, 45],
            e: [920, 135],
            yTag: [true, true]
          },
          {
            s: [920, 135],
            e: [1065, 135],
            xTag: [true, false]
          },
          {
            s: [435, 65],
            e: [1070, 65],
            xTag: [true, true]
          },
          {
            s: [435, 65],
            e: [435, 455],
            yTag: [true, true]
          },
          {
            s: [330, 455],
            e: [435, 455],
            xTag: [true, true]
          },
          {
            s: [330, 390],
            e: [330, 455],
            yTag: [false, true]
          },
          {
            s: [1074, 60],
            e: [1074, 130],
            yTag: [true, false]
          }
        ];
      }
    }
  },
  setup(props) {
    const {proxy} = getCurrentInstance();
    let ctx;
    let canvas;
    let points;
    let ratio;
    let speed = 1;
    const getValue = (s, type = 'x') => {
      if (s <= 1) {
        return s * (type === 'x'? canvas.width: canvas.height);
      }
      return s;
    };
    const animate = () => {
      requestAnimationFrame(() => {
        animate();
      });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < points.length; index++) {
        if (points[index].startX !== points[index].endX) {
          points[index].x += speed * ratio * (points[index].startX > points[index].endX? -1: 1);
        }
        if (points[index].startY !== points[index].endY) {
          points[index].y += speed * (points[index].startY > points[index].endY? -1: 1);
        }
        if (!points[index].reverseX && (points[index].x > points[index].endX || points[index].y > points[index].endY)) {
          points[index].x = points[index].startX;
          points[index].y = points[index].startY;
        }
        if (points[index].reverseX && points[index].x < 0) {
          points[index].x = points[index].startX;
          points[index].y = points[index].startY;
        }
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.moveTo(points[index].startX, points[index].startY);
        ctx.lineTo(points[index].endX, points[index].endY);
        ctx.stroke();

        if (points[index].xTag) {
          if (points[index].xTag[0]) {
            ctx.beginPath();
            ctx.lineWidth = 10;
            ctx.moveTo(points[index].startX - 5, points[index].startY);
            ctx.lineTo(points[index].startX + 15, points[index].startY);
            ctx.stroke();
          }
          if (points[index].xTag[1]) {
            ctx.beginPath();
            ctx.lineWidth = 10;
            ctx.moveTo(points[index].endX - 15, points[index].endY);
            ctx.lineTo(points[index].endX + 5, points[index].endY);
            ctx.stroke();
          }
        }
        if (points[index].yTag) {
          if (points[index].yTag[0]) {
            ctx.beginPath();
            ctx.lineWidth = 10;
            ctx.moveTo(points[index].startX, points[index].startY);
            ctx.lineTo(points[index].startX, points[index].startY + 20);
            ctx.stroke();
          }
          if (points[index].yTag[1]) {
            ctx.beginPath();
            ctx.lineWidth = 10;
            ctx.moveTo(points[index].endX, points[index].endY - 20);
            ctx.lineTo(points[index].endX, points[index].endY);
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(points[index].x, points[index].y, 5, 0, Math.PI * 2, true);
        ctx.fillStyle = "#ff0000";
        ctx.fill();
      }
    };
    const init = () => {
      points = props.lines.map(line => {
        let {s: [startX, startY], e: [endX, endY], xTag, yTag} = line;
        startX = getValue(startX, 'x');
        startY = getValue(startY, 'y');
        endX = getValue(endX, 'x');
        endY = getValue(endY, 'y');

        return {
          xTag,
          yTag,
          startX,
          startY,
          endX,
          endY,
          reverseX: startX > endX,
          reverseY: startY > endY,
          x: startX,
          y: startY
        }
      });
      animate();
    };
    onMounted(() => {
      canvas = proxy.$.refs.canvas;
      canvas.width = proxy.$.refs.canvas.parentNode.offsetWidth;
      canvas.height = proxy.$.refs.canvas.parentNode.offsetHeight;
      ctx = canvas.getContext('2d');
      ratio = canvas.width / canvas.height;
      init();
    });
  }
});
</script>
