<template>
  <div>
    <canvas
      ref="verify"
      :width="width"
      :height="height"
      @click="handleDraw"
    ></canvas>
  </div>
</template>

<script>
import {defineComponent, onMounted, toRefs, reactive, ref, nextTick, watch} from "vue";
export default defineComponent({
  name: 'Verify',
  props: {
    width: {
      type: String,
      required: false
    },
    height: {
      type: String,
      required: false
    },
  },
  setup(props, ctx) {
    const verify = ref(null);
    const state = reactive({
      pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",   // 随机字符串
      width: 120,                                     //展示区域宽度
      height: 32,                                     //展示区域高度
      imgCode: "",                                    //保存页面的内容（用来判断输入验证是否满足改code）
    });

    const randomNum = (min, max) => {
      return parseInt(Math.random() * (max - min + 1) + min);
    };
    const randomColor = (min, max) => {
      const r = randomNum(min, max);
      const g = randomNum(min, max);
      const b = randomNum(min, max);
      return `rgb(${r},${g},${b})`;
    };
    const handleDraw = () => {
      draw();
      state.imgCode = draw();
    };
    const draw = () => {
      const ctx = verify.value.getContext("2d");
      ctx.fillStyle = randomColor(180, 230);
      ctx.fillRect(0, 0, state.width, state.height);
      let imgCode = "";
      for (let i = 0; i < 4; i++) {
        const text = state.pool[randomNum(0, state.pool.length - 1)];

        const fontSize = randomNum(18, 40);
        const deg = randomNum(-30, 30);
        ctx.font = fontSize + "px Simhei";
        ctx.textBaseline = "top";
        ctx.fillStyle = randomColor(80, 150);


        ctx.save();
        ctx.translate(30 * i + 15, 15);
        ctx.rotate((deg * Math.PI) / 180);

        ctx.fillText(text, -15 + 5, -15);
        ctx.restore();
        imgCode += text;
      }
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(randomNum(0, state.width), randomNum(0, state.height));
        ctx.lineTo(randomNum(0, state.width), randomNum(0, state.height));
        ctx.strokeStyle = randomColor(180, 230);
        ctx.closePath();
        ctx.stroke();
      }
      for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.arc(
          randomNum(0, state.width),
          randomNum(0, state.height),
          1,
          0,
          2 * Math.PI
        );
        ctx.closePath();
        ctx.fillStyle = randomColor(150, 200);
        ctx.fill();
      }
      return imgCode;
    };
    watch(() => state.imgCode, val => {
      ctx.emit('update:value', val);
    });
    onMounted(() => {
      nextTick(() => {
        draw();
        state.imgCode = draw();
      });
    });

    return {
      ...toRefs(state),
      handleDraw,
      verify,
    };
  },
});
</script>
