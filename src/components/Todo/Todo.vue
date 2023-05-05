<template>
  <section class="i-todo-container">
    <header class="i-todo__header">
      <input
        class="i-todo__add"
        placeholder="点击添加待办项"
        @keyup.enter="addTodo"
      />
      <span class="i-todo__checkbox" @click="checkAll()"/>
    </header>
    <section v-if="todos.length" class="i-todo__body">
      <ul class="i-todo__body__list">
        <li
          v-for="(todo, index) in filteredTodos()"
          :key="index"
          :class="{completed: todo.done}"
        >
          <div class="i-todo__view">
            <input
              :checked="todo.done"
              type="checkbox"
              class="i-todo__view__toggle"
              @change="toggleTodo(todo, index)"
            />
            <label v-text="todo.title"/>
            <button class="i-todo__view__delete" @click="deleteTodo(todo)"/>
          </div>
        </li>
      </ul>
    </section>
    <el-empty v-else description="暂无待办"/>
    <footer v-show="todos.length" class="i-todo__footer">
      <span class="i-todo__count">
        <template v-if="visible === 'all'">
          共计<strong>{{ filteredTodos().length }}</strong>个待办。
        </template>
        <template v-if="visible === 'active'">
          剩余<strong>{{ filteredTodos().length }}</strong>个待办。
        </template>
        <template v-if="visible === 'completed'">
          已完成<strong>{{ filteredTodos().length }}</strong>个。
        </template>
      </span>
      <ul class="i-todo__filter">
        <li
          v-for="(item, index) in [{key:'all', text: '全部'}, {key: 'active', text: '待办'}, {key: 'completed', text: '已完成'}]"
          :key="index"
          :class="{selected: visible === item.key}"
          @click.prevent="visible = item.key"
        >
          {{ item.text }}
        </li>
        <li v-loading="loading" @click="onSave">更新</li>
      </ul>
    </footer>
  </section>
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted, ref, reactive, watch} from 'vue';

export default defineComponent({
  name: 'Todo',
  props: {
    name: {
      type: String,
      required: false,
      default: ''
    },
    initData: {
      type: Object,
      required: false,
      default: {},
    },
    inherit: {
      type: Object,
      required: false,
      default() {
        return {
          type: 'all',
          value: [],
        };
      },
    },
    errorInfo: {
      type: [Object, String],
      required: false
    },
    initApi: {
      type: [Object, String],
      required: false,
    },
    interval: {
      type: Number,
      required: false,
      default: 0,
    },
    sendOn: {
      type: String,
      required: false,
      default: ''
    },
    stopAutoRefreshWhen: {
      type: String,
      required: false,
      default: ''
    },
    silentLoading: {
      type: Boolean,
      required: false,
      default: false
    },
    silentMessage: {
      type: Boolean,
      required: false,
      default: true,
    },
    syncLocation: {
      type: Boolean,
      required: false,
      default: false,
    },
    actionApi: {
      type: [Object, String],
      required: false,
    },
    action: {
      type: Function,
      required: false,
    },
  },
  setup(props, ctx) {
    const {proxy} = getCurrentInstance();
    const state = reactive({data: {}});
    const todos = ref([]);
    const loading = ref(false);
    const visible = ref('all');
    const onComponentUpdate = () => {
      if (props.initApi) {
        fetchDataList();
      }
    };
    const fetchDataList = () => {
      if (proxy && proxy.axiosCancelToken) {
        typeof proxy.axiosCancelToken === 'function' && proxy.axiosCancelToken('CANCELED_DUE_TO_NEW_REQUEST');
      }
      loading.value = true;
      proxy.$api.useApi(proxy.$iRenderConfig, {})['get'](props.initApi, state.data)
        .then(({data}) => {
          todos.value = data;
        })
        .catch((err) => {
          if (err.message === 'CANCELED_DUE_TO_NEW_REQUEST') {
            console.info(err);
          }
        })
        .finally(() => {
          loading.value = false;
        });
    };
    const onSave = () => {
      if (loading.value) {
        return;
      }
      const actionApi = {};
      const {...other} = ctx.attrs;
      loading.value = true;
      actionApi.method = 'post';
      actionApi.params = state.data;
      actionApi.url = props.initApi;
      props.action(
        {
          actionType: 'ajax',
          actionApi,
          ...other,
        },
        todos.value,
        () => loading.value = false
      );
    };
    const checkAll = () => {
      todos.value.forEach(todo => {
        todo.done = true;
      });
    };
    const addTodo = (e) => {
      const title = e.target.value;
      if (title.trim()) {
        todos.value.push({
          title,
          done: false
        });
      }
      e.target.value = ''
    };
    const toggleTodo = (todo, index) => todos.value[index].done = !todo.done;
    const deleteTodo = (todo) => todos.value.splice(todos.value.indexOf(todo), 1);
    const doneEdit = (index) => todos.value[index].done = true;
    const filteredTodos = () => {
      if (visible.value === 'active') {
        return todos.value.filter(todo => !todo.done);
      }
      if (visible.value === 'completed') {
        return todos.value.filter(todo => todo.done);
      }
      return todos.value;
    };

    watch(() => props.initData, (val) => {
      state.data = val;
    }, {
      deep: true,
      immediate: true,
    });
    onMounted(() => {
      onComponentUpdate();
    });

    return {
      onComponentUpdate,
      checkAll,
      addTodo,
      toggleTodo,
      deleteTodo,
      doneEdit,
      filteredTodos,
      onSave,
      loading,
      visible,
      todos,
      state
    };
  }
});
</script>
<style lang="scss">
.i-todo-container {
  position: relative;
  width: 100%;
  border: 1px solid var(--el-card-border-color);
  font-weight: 300;
}

.i-todo__header {
  position: relative;
  border-bottom: 1px solid var(--el-card-border-color);
}

.i-todo__add {
  width: 100%;
  height: 100%;
  padding: 10px 16px 10px 60px;
  border: none;
  font-size: 18px;
}

.i-todo__body {
  position: relative;
  height: 255px;
  overflow-y: scroll;
}

.i-todo__checkbox {
  position: absolute;
  top: 0;
  left: 10px;
  width: 41px;
  height: 100%;
  font-size: 12px;
  cursor: pointer;

  &:before {
    position: absolute;
    height: 100%;
    content: '❯';
    font-size: 22px;
    color: var(--el-card-border-color);
    transform: rotate(90deg);
  }
}

.i-todo__body__list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;

  li {
    position: relative;
    font-size: 24px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    &:last-child {
      border-bottom: none;
    }

    &.completed label {
      color: #d9d9d9;
      text-decoration: line-through;
    }

    &:hover {
      .i-todo__view__delete {
        display: block;
      }
    }

    .i-todo__view__toggle {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 40px;
      height: auto;
      margin: auto 0;
      opacity: 0;
      cursor: pointer;

      & + label {
        background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
        background-repeat: no-repeat;
        background-position: center left;
        background-size: 36px;
      }

      &:checked + label {
        background-size: 36px;
        background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E');
      }
    }

    label {
      word-break: break-all;
      padding: 15px 15px 15px 50px;
      display: block;
      line-height: 1.0;
      font-size: 14px;
      transition: color 0.4s;
    }

    .i-todo__view__delete {
      position: absolute;
      top: 0;
      right: 10px;
      bottom: 0;
      width: 40px;
      height: 40px;
      margin: auto 0;
      display: none;
      border: 0;
      border-radius: 100%;
      font-size: 30px;
      color: rgba(245, 108, 108, .5);
      transition: color 0.2s ease-out;
      cursor: pointer;

      &:hover {
        color: #F56C6C;
      }

      &:after {
        content: '×';
      }
    }
  }
}

.i-todo__footer {
  color: #777;
  position: relative;
  padding: 10px 15px;
  height: 40px;
  text-align: center;
  border-top: 1px solid var(--el-card-border-color);

  &:before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 40px;
    overflow: hidden;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6, 0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2);
  }
}

.i-todo__count {
  position: absolute;
  left: 0;
  padding-left: 15px;

  strong {
    font-weight: 600;
  }
}

.i-todo__filter {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    padding: 3px 7px;
    display: inline;
    cursor: pointer;
    font-size: 12px;
    text-decoration: none;
    border: 1px solid transparent;
    border-radius: 3px;

    &:hover {
      border-color: rgba(64, 158, 255, 0.1);
    }

    &.selected {
      border-color: rgba(64, 158, 255, 0.2);
    }

    &:last-child {
      position: absolute;
      right: 0;
      color: var(--el-color-primary);
    }
  }
}
</style>
