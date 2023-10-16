<template>
  <div :class="{
    'i-delivery-schedule': true,
    disabled: disabled
  }">
    <div class="i-delivery-schedule__content">
      <aside class="i-delivery-schedule__frame">
        <div class="i-delivery-schedule__category">
          星期/时间
        </div>
        <div
          v-for="week in 7"
          :key="week"
          class="i-delivery-schedule__week"
          @click="onWeekClick(week)"
        >
          星期{{ weeks[week - 1] }}
        </div>
      </aside>
      <div class="i-delivery-schedule__body">
        <div class="i-delivery-schedule__time">
          <div class="i-delivery-schedule__time__noon">
            {{isH5? '23:00 - 12:00': '00:00 - 11:00'}}
          </div>
          <div class="i-delivery-schedule__time__noon">
            {{isH5? '11:00 - 00:00': '12:00 - 23:00'}}
          </div>
        </div>
        <table class="i-delivery-schedule__body__table">
          <thead>
            <tr>
              <th
                v-for="hour in 24"
                :key="hour"
                :label="createTips(0, isH5? 24 - hour: hour - 1)"
                class="i-delivery-schedule__cell"
                @click="onTheadClick(isH5? 24 - hour: hour - 1)"
              >
                {{ isH5? 24 - hour: hour - 1 }}
              </th>
            </tr>
          </thead>
          <tbody @mouseleave="onMouseLeave">
            <tr
              v-for="week in 7"
              :key="week"
            >
              <td
                v-for="hour in 24"
                :key="hour"
                ref="scheduleCell"
                class="i-delivery-schedule__cell"
                :data-week="week"
                :data-hour="isH5? 24 - hour: hour - 1"
                :class="isActive(collector, week, isH5? 24 - hour: hour - 1) ? 'active' : ''"
                :label="createTips(week, isH5? 24 - hour: hour - 1)"
                @click="onCellClick"
                @mousedown="onCellDown"
                @mousemove="onCellHover"
                @mouseup="onCellUp"
              />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="i-delivery-schedule__tools">
      <div class="i-delivery-schedule__active">
        已选
      </div>
      <div class="i-delivery-schedule__inactive">
        未选
      </div>
      <div class="i-delivery-schedule__tip">
        可拖动鼠标选择时间段
      </div>
      <div
        class="i-delivery-schedule__clear"
        @click="onClearClick"
      >
        清空
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, getCurrentInstance, onBeforeMount, onMounted, ref, watch, nextTick} from 'vue';
import {cloneDeep} from 'lodash';
export default defineComponent({
  name: 'Schedule',
  props: {
    value: {
      type: Object,
      required: false,
      default: {}
    },
    disabled: Boolean,
    disabledOn: String,
    action: {
      type: Function,
      required: false,
    },
    linkageTrigger: {
      type: Function,
      required: false,
    },
    initData: {
      type: Object,
      required: false
    }
  },
  setup(props, ctx) {
    const {proxy} = getCurrentInstance();
    const startY = ref(0);
    const startX = ref(0);
    const isClick = ref(false);
    const isDragging = ref(false);
    const collector = ref(props.value || {});
    const weeks = ['一', '二', '三', '四', '五', '六', '日'];
    const isH5 = ref(false);

    const isActive = (collector, week, hour) => {
      return collector[week] && collector[week].includes(hour)
    }
    const isCovered = (event, cell) =>  {
      const x = event.target.offsetLeft
      const y = event.target.offsetTop
      const minX = Math.min(x, startX.value)
      const maxX = Math.max(x, startX.value)
      const minY = Math.min(y, startY.value)
      const maxY = Math.max(y, startY.value)

      return cell.offsetLeft >= minX &&
          cell.offsetLeft <= maxX &&
          cell.offsetTop >= minY &&
          cell.offsetTop <= maxY
    }
    const createTips = (week, hour) =>  {
      const time = hour < 10 ? '0' + hour : hour
      const weeky = week ? `星期${weeks[week - 1]}` : ''

      return `${weeky} ${time}:00 - ${time}:59`
    }
    const onClearClick = () =>  {
      collector.value = {}
    }
    const onCellClick = (event) =>  {
      if (isClick.value) {
        const collector = cloneDeep(collector.value) || {}
        const week = Number(event.target.dataset.week)
        const hour = Number(event.target.dataset.hour)

        reflushCollector(collector, week, hour)
        collector.value = collector
      }
    }
    const onCellDown = (event) =>  {
      isClick.value = true
      isDragging.value = true
      startX.value = event.target.offsetLeft
      startY.value = event.target.offsetTop
    }
    const onCellHover = (event) =>  {
      isClick.value = false
      if (isDragging.value) {
        proxy.$refs.scheduleCell.forEach(cell => {
          if (isCovered(event, cell)) {
            cell.classList.add('on-hover')
          } else {
            cell.classList.remove('on-hover')
          }
        })
      }
    }
    const onMouseLeave = () =>  {
      const iCollector = cloneDeep(collector.value) || {}
      let isChanged = false
      isDragging.value = false
      proxy.$refs.scheduleCell.forEach(cell => {
        if (cell.classList.contains('on-hover')) {
          const week = Number(cell.dataset.week)
          const hour = Number(cell.dataset.hour)

          reflushCollector(iCollector, week, hour)
          cell.classList.remove('on-hover')
          isChanged = true
        }
      })

      isChanged && (collector.value = collector)
    }
    const onCellUp = (event) =>  {
      const iCollector = cloneDeep(collector.value) || {}

      proxy.$refs.scheduleCell.forEach(cell => {
        cell.classList.remove('on-hover')

        if (!isClick.value && isCovered(event, cell)) {
          const week = Number(cell.dataset.week)
          const hour = Number(cell.dataset.hour)

          reflushCollector(iCollector, week, hour)
        }
      })
      collector.value = iCollector
      isDragging.value = false
    }
    const onTheadClick = (hour) =>  {
      const iCollector = cloneDeep(collector.value) || {}
      for (let i = 1; i < 8; i++) {
        if (!iCollector[i]) {
          iCollector[i] = [hour]
        } else if (iCollector[i].indexOf(hour) === -1) {
          iCollector[i].push(hour)
        }
      }
      collector.value = iCollector
    }
    const onWeekClick = (week) =>  {
      const iCollector = cloneDeep(collector.value) || {}
      const hours = []
      for (let i = 0; i < 24; i++) {
        hours.push(i)
      }
      iCollector[week] = hours
      collector.value = iCollector
    }
    const reflushCollector = (collector, week, hour) =>  {
      if (!collector[week]) {
        collector[week] = [hour]
      } else if (collector[week] && !collector[week].includes(hour)) {
        collector[week].push(hour)
      } else if (collector[week] && collector[week].includes(hour)) {
        collector[week] = collector[week].filter(item => item !== hour)
        if (!collector[week].length) {
          delete collector[week]
        }
      }
    }

    watch(() => props.value, val => {
      collector.value = val || {};
    }, {
      immediate: true
    });
    watch(() => collector.value, val => {
      ctx.emit('update:value', val);
    });
    onBeforeMount(() => {
      const page = document.querySelector('.i-website-app__container');
      if (page && page.classList.contains('h5')) {
        isH5.value = true;
      }
    });
    return {
      isH5,
      startY,
      startX,
      isClick,
      isDragging,
      collector,
      weeks,
      isActive,
      createTips,
      onClearClick,
      onCellClick,
      onCellDown,
      onCellHover,
      onMouseLeave,
      onCellUp,
      onTheadClick,
      onWeekClick
    };
  }
});
</script>

<style lang="scss">
.i-delivery-schedule {
  position: relative;
  width: 536px;
  &.disabled {
    pointer-events: none;
    .i-delivery-schedule__clear,
    .i-delivery-schedule__tip {
      color: var(--el-text-color-disabled);
    }
  }
}
.i-delivery-schedule__content {
  border-radius: 4px;
  overflow: hidden;
  border: solid 1px #E6E7E8;
  border-bottom: 0;
}
.i-delivery-schedule__tools {
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
}
.i-delivery-schedule__inactive {
  position: absolute;
  left: 22px;
  font-size: 12px;
  color: #39434E;
  &::before {
    position: absolute;
    top: 50%;
    left: -22px;
    width: 12px;
    height: 12px;
    border: solid 1px #E6E7E8;
    border-radius: 50%;
    content: '';
    transform: translate3d(0, -50%, 0);
  }
}
.i-delivery-schedule__active {
  position: absolute;
  left: 66px + 22px;
  font-size: 12px;
  color: #39434E;

  &::before {
    position: absolute;
    top: 50%;
    left: -22px;
    width: 12px;
    height: 12px;
    border: solid 1px var(--el-color-primary-light-5);
    border-radius: 50%;
    background-color: var(--el-color-primary);
    content: '';
    transform: translate3d(0, -50%, 0);
  }
}
.i-delivery-schedule__tip {
  position: absolute;
  left: 50%;
  font-size: 12px;
  transform: translate3d(-50%, 0, 0);
}
.i-delivery-schedule__clear {
  position: absolute;
  right: 0;
  height: 26px;
  font-size: 12px;
  line-height: 25px;
  text-align: center;
  border-radius: 2px;
  cursor: pointer;
}
.i-delivery-schedule__body {
  width: 456px;
  margin-left: 80px;
}
.i-delivery-schedule__time {
  width: 456px;
  height: 34px;
  display: flex;
  align-items: center;
  background: #F2F3F4;
  border: 1px solid #E6E7E8;
  border-bottom: 0;
  border-top: 0;
}
.i-delivery-schedule__time__noon {
  width: 50%;
  height: 34px;
  font-size: 12px;
  line-height: 34px;
  text-align: center;

  &:first-child {
    border-right: 1px solid #DADCDE;
  }
}
.i-delivery-schedule__frame {
  position: absolute;
  width: 80px;
}
.i-delivery-schedule__category {
  position: relative;
  width: 80px;
  height: 64px;
  border: 1px solid #E6E7E8;
  border-left: 0;
  border-top: 0;
  background: #F2F3F4;
  border-right: 0;
  text-align: center;
  line-height:  64px;
  font-size: 12px;
}
.i-delivery-schedule__category__time {
  text-align: right;
}
.i-delivery-schedule__category__week {
  line-height: 34px;
}
.i-delivery-schedule__week {
  width: 80px;
  height: 34px;
  border-bottom: 1px solid #DADCDE;
  line-height: 34px;
  text-align: center;
  font-size: 12px;
  background-color: #F2F3F4;
  cursor: pointer;
}
.i-delivery-schedule__body__table {
  border-collapse: collapse;
  border-spacing: 0;
  border: 0;
  cursor: crosshair;
  th {
    background-color: #f9f9f9;
    cursor: pointer;
    &.i-delivery-schedule__cell {
      height: 26px;
      line-height: 26px;
    }
  }
  td {
    background-color: var(--el-color-white);
  }
}
.i-delivery-schedule__cell {
  width: 19px;
  height: 34px;
  border: 1px solid #DADCDE;
  font-size: 12px;
  line-height: 34px;
  transition: background 500ms ease;

  &:hover {
    background-color: #F2F3F4;

    &::after {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 150px;
      height: 27px;
      margin-left: 14px;
      margin-top: 14px;
      padding: 5px;
      border-radius: 5px;
      border: 1px solid #DADCDE;
      text-align: center;
      font-size: 12px;
      content: attr(label);
      z-index: 2;
    }
  }

  &.active {
    background-color: var(--el-color-primary);
  }

  &.on-hover {
    background-color: var(--el-color-primary);
  }
}
.h5 {
  .i-delivery-schedule__frame {
    display: flex;
    width: 373px;
  }
  .i-delivery-schedule__category {
    width: 60px;
    height: 34px;
    line-height: 34px;
  }
  .i-delivery-schedule__content {
    max-width: 375px;
    height: 490px;
    overflow: unset
  }
  .i-delivery-schedule__body {
    margin-left: 0;
    transform: rotate(-90deg) translate(-74px, -41px);
  }
  .i-delivery-schedule__week {
    width: 45px;
    height: 34px;
  }
  .i-delivery-schedule__time {
    width: 456px;
    height: 30px;
  }
  .i-delivery-schedule__cell {
    width: 19px;
    height: 45px;
    &:hover {
      &::after {
        transform: rotate(90deg);
      }
    }
  }
  .i-delivery-schedule__tip {
    display: none;
  }
}
</style>
