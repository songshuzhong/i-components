<template>
  <div v-loading="isLoading" class="sc-async-cascader__main__cascaders">
    <div
      v-for="(trunkId, key) in trunkIds"
      :key="key"
      class="sc-async-cascader__main__cascader"
    >
      <async-item
        v-bind="$attrs"
        :key="trunkId"
        v-model:value="trunkIds"
        :index="key"
        :trunk-id="trunkId"
        :leaves="findActiveTrunk(trunkId, trunkIds)"
        @getMoreLeaves="getMoreLeaves"
      >
        <template v-slot="{ data }">
          <slot :data="data" />
        </template>
      </async-item>
    </div>
  </div>
</template>

<script>
import AsyncItem from './item.vue'

export default {
  name: 'Main',
  components: {
    AsyncItem,
  },
  props: {
    category: {
      type: [String, Number],
      required: true,
    },
    sprouting: {
      type: Function,
      required: false,
    },
  },
  data() {
    return {
      tree: {
        id: 'root',
        name: 'root',
        children: [],
      },
      isLoading: false,
      trunkIds: ['root'],
    }
  },
  mounted() {
    this.onTrunkSprouting('root', true, this.trunkIds)
  },
  methods: {
    findActiveTrunk(trunkId, trunkIds) {
      let trunk = this.tree
      for (let i = 0; i < trunkIds.length; i++) {
        const pId = trunkIds[i]
        const cId = trunkIds[i + 1]
        if (trunkId === pId) {
          break
        } else {
          trunk = trunk.children.find((child) => child.id === cId)
        }
      }
      return trunk
    },
    updateActiveTrunk(trunkId, leaves, trunkIds) {
      const activeTrunk = this.findActiveTrunk(trunkId, trunkIds)

      activeTrunk.children = leaves
      this.trunkIds = trunkIds
    },
    getMoreLeaves(id, trunkId, hasChild) {
      const trunkIds = this.trunkIds

      if (trunkIds.length - 1 === id && hasChild) {
        trunkIds.push(trunkId)
      } else if (id < trunkIds.length - 1) {
        trunkIds.splice(id + 1, trunkIds.length, trunkId)
      }
      this.onTrunkSprouting(trunkId, hasChild, trunkIds).then((options) => {
        if (options) {
          this.updateActiveTrunk(trunkId, options, trunkIds)
        }
      })
    },
    onTrunkSprouting(trunkId, hasChild, trunkIds) {
      const activeTrunk = this.findActiveTrunk(trunkId, trunkIds)
      if (activeTrunk && hasChild) {
        this.isLoading = true
        return (
          this.sprouting &&
          this.sprouting({
            type: trunkIds.length - 1,
            searchId: trunkId,
            category: this.category,
          })
            .then((list) => {
              if (trunkId === 'root') {
                this.tree.children = list
              }
              return list
            })
            .catch((e) => {
              // eslint-disable-next-line no-console
              console.log(e)
            })
            .finally(() => {
              this.isLoading = false
            })
        )
      }
      return Promise.resolve()
    },
  },
}
</script>
