<template>
  <div class="sc-async-cascader">
    <div class="sc-async-cascader__header">
      {{ title }}
    </div>
    <div class="sc-async-cascader__body">
      <div class="sc-async-cascader__main">
        <search-bar
          :data="selectedData"
          :absence="absence"
          :categories="categories"
          v-model:category="iCategory"
          :sprouting="sprouting"
          @updateCheckedIds="updateCheckedIds"
        >
          <template v-slot="{ data }">
            <slot :data="data" />
          </template>
        </search-bar>
        <cascader-main
          :absence="absence"
          :categories="categories"
          :category="iCategory"
          :sprouting="sprouting"
          @updateCheckedIds="updateCheckedIds"
        >
          <template v-slot="{ data }">
            <slot :data="data" />
          </template>
        </cascader-main>
      </div>
      <sc-selection-viewer
        class="sc-async-cascader__selected"
        :max="max"
        :data="selectedData"
        :disabled="false"
        :multi-source="false"
        @clear="remove"
        @remove="remove"
      />
    </div>
    <div class="sc-async-cascader__foot">
      <el-button @click="onCancel"> 取消 </el-button>
      <el-button type="primary" plain @click="onSure"> 确定 </el-button>
    </div>
  </div>
</template>

<script>
import * as Vue from 'vue'
import CascaderMain from './main.vue'
import SearchBar from './search.vue'

export default {
  name: 'Cascader',
  components: {
    CascaderMain,
    SearchBar
  },
  props: {
    max: {
      type: Number,
      required: false,
      default: 10,
    },
    title: {
      type: String,
      required: false,
      default: '选择广告计划',
    },
    categories: {
      type: Object,
      required: false,
      default: () => ({
        0: '广告系列',
        1: '广告计划',
        2: '广告创意',
      }),
    },
    category: {
      type: [String, Number],
      required: false,
      default: 0,
    },
    cancel: {
      type: Function,
      required: false,
    },
    ok: {
      type: Function,
      required: false,
    }
  },
  data() {
    return {
      eventHub: new Vue(),
      selectedData: [],
      iCategory: 0,
    }
  },
  provide() {
    return {
      eventHub: this.eventHub,
    }
  },
  computed: {
    absence() {
      return this.max - this.selectedData.length
    },
  },
  watch: {
    category(val) {
      this.iCategory = val
    },
  },
  methods: {
    sprouting(params) {
      const type = params.type
      if (type === 1) {
        return this.$api.staticApi({})
            .get('https://www.fastmock.site/mock/dc68471bb17633aadf38d2b84a1b314e/ajax/campaign2', {
              params
            })
            .then(res => {
              return res.result.list
            })
      } else if (type === 0) {
        return this.$api.staticApi({})
            .get('https://www.fastmock.site/mock/dc68471bb17633aadf38d2b84a1b314e/ajax/rb/campaign', {
              params
            })
            .then(res => {
              return res.result.list
            })
      } else {
        return this.$api.staticApi({})
            .get('https://www.fastmock.site/mock/dc68471bb17633aadf38d2b84a1b314e/ajax/creatives11', {
              params
            })
            .then(res => {
              return res.data.list
            }).catch(e => console.error(e))
      }
    },
    joinOnUnique(arr1, arr2, hash = {}) {
      const combine = arr1.concat(arr2)
      return combine.reduce((item, next) => {
        if (!hash[next.id]) {
          hash[next.id] = true
          item.push(next)
        }
        return item
      }, [])
    },
    updateCheckedIds(isChecked, ids) {
      const isArray = Object.prototype.toString.call(ids) === '[object Array]'

      if (isArray) {
        if (isChecked) {
          this.selectedData = this.joinOnUnique(this.selectedData, ids)
        } else {
          const ids = ids.map((item) => item.id)
          this.selectedData = this.selectedData.filter(
            (item) => ids.indexOf(item.id) === -1
          )
        }
      } else {
        if (isChecked) {
          this.selectedData.push(ids)
        } else {
          this.selectedData = this.selectedData.filter(
            (item) => item.id !== ids.id
          )
        }
      }
    },
    remove(ids) {
      if (ids) {
        this.selectedData = this.selectedData.filter(
          (item) => item.id !== ids.id
        )
      } else {
        this.selectedData = []
      }
      $emit(this.eventHub, 'sc-asyncCascader:change', ids)
    },
    onCancel() {
      this.cancel && this.cancel()
    },
    onSure() {
      this.ok && this.ok(this.selectedData)
    },
  },
  emits: ['sc-asyncCascader:change'],
}
</script>
<style lang="scss">
.sc-async-cascader {
  padding: 10px;
  border: 1px solid #ebecee;
  border-radius: 4px;
}
.sc-async-cascader__header {
  font-weight: bold;
  font-size: 13px;
  line-height: 18px;
}
.sc-async-cascader__body {
  display: flex;
  margin: 10px 0;
}
.sc-async-cascader__main {
  flex: 1;
  margin-right: 20px;
  .el-select .el-input {
    width: 130px;
  }
}
.sc-async-cascader__main__search {
  position: relative;
}
.sc-async-cascader__main__search__result {
  position: absolute;
  width: 100%;
  min-height: 190px;
  max-height: 256px;
  margin-top: 10px;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid #ebecee;
  box-shadow: 0 2px 4px 0 rgba(56, 67, 78, 0.1);
  overflow-y: auto;
  z-index: 10;
  animation: drawer-down 0.5s;
}
.sc-async-cascader__main__search__empty {
  line-height: 34px;
  text-align: center;
  font-size: 12px;
}
.sc-async-cascader__main__cascaders {
  display: flex;
  height: 276px;
  margin-top: 10px;
  border: 1px solid #ebecee;
  border-radius: 4px;
  overflow: hidden;
}
.sc-async-cascader__main__cascader {
  flex: 1;
  border-left: 1px solid #ebecee;
  animation: drawer-out 0.3s;
  &:first-child {
    border-left: 0;
  }
  &:last-child {
    border-right: 0;
  }
}
.sc-async-cascader__main__cascader__header {
  height: 40px;
  display: block;
  padding: 0 10px;
  line-height: 43px;
  font-size: 12px;
  font-weight: bold;
}
.sc-async-cascader__main__cascader__group {
  height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
  &.taller {
    height: 235px;
  }
}
.sc-async-cascader__main__cascader__item {
  position: relative;
  box-sizing: border-box;
  display: block;
  padding: 0 10px;
  line-height: 34px;
  font-size: 12px;
  &.active {
    background-color: #F9F9F9;
  }
}
.sc-async-cascader__main__cascader__item--extend {
  float: right;
  font-size: 14px;
  line-height: 34px;
}
.sc-async-cascader__selected {
  width: 200px;
  height: 326px !important;
}
.sc-async-cascader__foot {
  text-align: right;
}
@keyframes drawer-out {
  0% {
    transform: translate(-10%);
  }
  100% {
    transform: translate(0);
  }
}
@keyframes drawer-down {
  0% {
    transform: translate3d(0, -10%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>
