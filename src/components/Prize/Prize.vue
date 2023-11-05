<template>
  <div class="luck-draw">
    <h1>抽奖次数{{ total }}</h1>
    <div class="luck-draw-box">
      <div class="luck-draw-turntable">
        <table>
          <tr>
            <td class="td_0">
              <span>{{ list[0].title }}</span>
            </td>
            <td class="td_1">
              <span>{{ list[1].title }}</span>
            </td>
            <td class="td_2">
              <span>{{ list[2].title }}</span>
            </td>
          </tr>
          <tr>
            <td class="td_7">
              <span>{{ list[7].title }}</span>
            </td>
            <td class="luck-draw-button" :style="{background:total == 0 ? '#CCC' : '#F90'}" @click="handleStart">
              {{total == 0 ? '无抽奖机会' : luckyText}}
            </td>

            <td class="td_3">
              <span>{{ list[3].title }}</span>
            </td>
          </tr>
          <tr>
            <td class="td_6">
              <span>{{ list[6].title }}</span>
            </td>
            <td class="td_5">
              <span>{{ list[5].title }}</span>
            </td>
            <td class="td_4">
              <span>{{ list[4].title }}</span>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'LuckDraw',
  data() {
    return {
      total: 2, // 抽奖次数
      timer: null,
      initSpeed: 200, // 初始速度
      speed: null, // 变化速度
      diff: 22, // 速度变化的值，值越大，变化地越慢
      prize: {}, // 抽中的奖品
      time: 0, // 记录开始抽奖的时间
      current: -1, // 当前转动的位置
      isRuningLucky: false, // 是否正在抽奖
      luckyText:'点击开始抽奖',
      list: [
        {
          title: "1",
          id: 1,
        },
        {
          title: "2",
          id: 2,
        },
        {
          title: "3",
          id: 3,
        },
        {
          title: "4",
          id: 4,
        },
        {
          title: "5",
          id: 5,
        },
        {
          title: "6",
          id: 6,
        },
        {
          title: "7",
          id: 7,
        },
        {
          title: "8",
          id: 8,
        },
      ],
    };
  },
  methods: {
    handleStart() {
      // 判断抽奖次数
      if (this.total < 1) return;
      // 判断是否正在抽奖
      if (this.isRuningLucky) return;
      // 初始时间设置不对 停止
      if (isNaN(Number(this.initSpeed))) return;
      const button = document.querySelector(".luck-draw-button");
      button.style.background = "red"
      this.luckyText = '抽奖中'
      this.speed = this.initSpeed;
      // 开始抽奖
      this.isRuningLucky = true;
      this.time = Date.now();
      this.getData();
    },
    getData() {
      //这里请求接口 接口返回抽奖ID
      this.prize = {
        //中奖的奖品的ID
        id: 6,
      };
      this.move();
    },
    move() {
      var that = this
      const timer = setTimeout(() => {
        that.current++;
        if (that.current > 7) {
          that.current = 0;
        }
        const dom = document.querySelector(`.td_${that.current}`);
        document.querySelector(".active")
            ? document.querySelector(".active").classList.remove("active")
            : "";
        dom.classList.add("active");
        // 如果抽到的奖品ID 存在，则开始减速转动
        if (that.prize.id && (Date.now() - that.time) / 1000 > 4) {
          that.speed += that.diff; // 转动减速
          // 这里判断时间  并且奖品等于 抽奖池奖品id，则停下来
          if (
              (Date.now() - that.time) / 1000 > 6 &&
              +that.prize.id === +that.list[that.current].id
          ) {
            clearTimeout(timer);
            setTimeout(() => {
              // 转盘停止
              that.total = that.total - 1;
              that.isRuningLucky = false;
              // 抽中之后的操作（弹出奖品框）
              const button = document.querySelector(".luck-draw-button");
              button.style.background = that.total == 0 ? '#CCC' : '#F90'
              that.luckyText = that.total == 0 ? '点击开始抽奖' : '点击开始抽奖'
              this.$emit('input', that.list[that.current].title);
            }, 1000);
            return;
          }
          // 若抽中的奖品不存在，则加速转动
        } else {
          //加速
          if (that.speed >= 50) {
            that.speed -= that.diff;
          }
        }
        that.move();
      }, that.speed);
    },
  },
};
</script>

<style>
.luck-draw {
  height: 820px;
  width: 600px;
  margin: 0 auto;
}
.luck-draw-box .luck-draw-turntable {
  height: 590px;
  width: 100%;
}
.luck-draw-turntable table {
  width: 100%;
  height: 100%;
}
.luck-draw-turntable table tr .luck-draw-button {
  cursor: pointer;
  font-size: 14px;
}
td.active {
  background: #f9ea5d;
}
.luck-draw-turntable table tr {
  width: 100%;
  height: 180px;
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
table tr td {
  width: 23%;
  height: 70%;
  border-radius: 16px;
  background: #fff;
  line-height: 130px;
  position: relative;
  overflow: hidden;
  text-align: center;
}
.luck-draw-box {
  width: 100% ;
  height: 600px ;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: skyblue;
}
</style>
