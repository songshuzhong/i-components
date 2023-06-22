<template>
  <fragment>
    <div class="sc-async-cascader__main__cascader__header">
      {{ categories[index] }}
    </div>
    <div
      v-if="trunkId !== 'root'"
      class="sc-async-cascader__main__cascader__item"
    >
      <el-checkbox
        v-model:value="checkAll"
        :indeterminate="isIndeterminate"
        @change="onAllChecked"
      >
        全选
      </el-checkbox>
    </div>
    <el-checkbox-group
      :key="trunkId"
      v-model:value="checkedIds"
      class="sc-async-cascader__main__cascader__group"
      :class="index === 0 ? 'taller' : ''"
      @change="onGroupChange"
    >
      <template v-for="option in leaves.children" :key="option.id">
        <div
          :class="isActive(option.id)"
          class="sc-async-cascader__main__cascader__item"
          @click.once="onChecked(option)"
        >
          <el-checkbox
            :label="option.id"
            :disabled="absence <= 0"
            @change="onChanged"
          >
            <slot :data="option">
              {{ option.name }}
            </slot>
          </el-checkbox>
          <i
            v-if="index < 2"
            class="el-icon-arrow-right sc-async-cascader__main__cascader__item--extend"
          />
        </div>
      </template>
    </el-checkbox-group>
  </fragment>
</template>

<script>
export default {
  name: 'Item',
  props: {
    absence: {
      type: Number,
      required: true,
    },
    categories: {
      type: Object,
      required: true,
    },
    index: {
      type: [String, Number], // 列索引 0系列1计划2创意
      required: true,
    },
    leaves: {
      type: Object,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
    trunkId: {
      type: [String, Number],
      required: false,
    },
  },
  data() {
    return {
      trunkIds: [],
      checkedIds: [],
      checkAll: false,
      isIndeterminate: true,
    }
  },
  inject: ['eventHub'],
  watch: {
    value: {
      deep: true,

      handler(val) {
        this.trunkIds = val
      },

      immediate: true,
    },
  },
  created() {
    $on(this.eventHub, 'sc-asyncCascader:change', this.onListener)
  },
  beforeUnmount() {
    $off(this.eventHub, 'sc-asyncCascader:change', this.onListener)
  },
  methods: {
    isActive(index) {
      return this.trunkIds.includes(String(index)) ? 'active' : ''
    },
    onGroupChange(value) {
      const boxes = this.leaves.children.length
      this.checkAll = value.length === boxes
      this.isIndeterminate = value.length > 0 && value.length < boxes
    },
    onChanged(isChecked, event) {
      const id = event.target.defaultValue
      const value = event.target.labels[0].innerText

      $emit(this, 'updateCheckedIds', isChecked, { id, value })
    },
    onChecked(option) {
      $emit(this, 'getMoreLeaves', this.index, option.id, this.index < 2)
    },
    onAllChecked(val) {
      const checkedIds = []
      const selectedIds = []
      const absence = this.leaves.children.length - this.checkedIds.length

      if (absence > this.absence) {
        notification({
          title: '警告',
          message: `您还剩 ${this.absence} 个位置可以选择！`,
          type: 'warning',
          dangerouslyUseHTMLString: true,
        })
        return
      }
      this.leaves.children.forEach((option) => {
        checkedIds.push(option.id)
        selectedIds.push({
          id: option.id,
          value: option.name,
        })
      })

      if (val) {
        this.checkedIds = checkedIds
        $emit(this, 'updateCheckedIds', true, selectedIds)
      } else {
        this.checkedIds = []
        $emit(this, 'updateCheckedIds', false, selectedIds)
      }
      this.isIndeterminate = false
    },
    onListener(detail) {
      if (detail) {
        this.checkedIds = this.checkedIds.filter((id) => id !== detail.id)
        this.isIndeterminate = true
      } else {
        this.checkedIds = []
        this.checkAll = false
      }
    },
  },
  emits: ['updateCheckedIds', 'getMoreLeaves', 'update:value'],
}
</script>
