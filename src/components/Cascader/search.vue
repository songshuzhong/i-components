<template>
  <div class="sc-async-cascader__main__search">
    <el-input
      v-model:value="searchKey"
      clearable
      placeholder="请输入名称/ID"
      :validate-event="false"
      @keyup.enter="search"
    >
      <template v-slot:prepend>
        <el-select v-model:value="iCategory" placeholder="请选择">
          <el-option
            v-for="(label, key) in categories"
            :key="label"
            :label="label"
            :value="key"
          />
        </el-select>
      </template>
      <template v-slot:append>
        <el-button icon="el-icon-search" @click="search" />
      </template>
    </el-input>
    <div
      v-if="isShow"
      v-loading="isLoading"
      class="sc-async-cascader__main__search__result"
    >
      <el-checkbox-group v-if="searchResult.length" v-model:value="checkedIds">
        <div
          v-for="(option, key) in searchResult"
          :key="key"
          class="sc-async-cascader__main__cascader__item"
        >
          <el-checkbox
            :label="option.id"
            :disabled="absence <= 0"
            :checked="hasChecked(option.id)"
            @change="onChanged"
          >
            <slot :data="option">
              {{ option.name }}
            </slot>
          </el-checkbox>
        </div>
      </el-checkbox-group>
      <div v-else class="sc-async-cascader__main__search__empty">
        无搜索结果，请尝试其它搜索词
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
    absence: {
      type: Number,
      required: true,
    },
    data: {
      type: Array,
      required: false,
    },
    categories: {
      type: Object,
      required: true,
    },
    category: {
      type: [String, Number],
      required: true,
    },
    sprouting: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      checkedIds: [],
      isLoading: false,
      isShow: false,
      searchKey: '',
      searchResult: [],
      iCategory: '1',
    }
  },
  inject: ['eventHub'],
  computed: {
    checkedKeys() {
      return this.data.map((item) => item.id)
    },
  },
  watch: {
    searchKey: {
      deep: true,

      handler(val) {
        if (val.length === 0) {
          this.isShow = false
        }
      },

      immediate: true,
    },
    iCategory: {
      deep: true,

      handler(val) {
        $emit(this, 'update:category', val)
      },
    },
    category: {
      deep: true,

      handler(val) {
        this.iCategory = String(val)
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
    hasChecked(checkedId) {
      return this.checkedKeys.includes(checkedId)
    },
    onChanged(isChecked, event) {
      const id = event.target.defaultValue
      const value = event.target.labels[0].innerText

      $emit(this, 'updateCheckedIds', isChecked, { id, value })
    },
    search() {
      this.isShow = true
      this.isLoading = true

      this.sprouting &&
        this.sprouting({
          name: this.searchKey,
          category: this.category,
        })
          .then((list) => {
            this.searchResult = list
          })
          .catch(() => {
            // console.log('Request canceled');
          })
          .finally(() => {
            this.isLoading = false
          })
    },
    onListener(detail) {
      if (detail) {
        this.checkedIds = this.checkedIds.filter((id) => id !== detail.id)
      } else {
        this.checkedIds = []
      }
    },
  },
  emits: ['update:category', 'updateCheckedIds'],
}
</script>
