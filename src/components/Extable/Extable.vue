<template>
  <div class="i-plugin-extable" />
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted, onBeforeUnmount} from 'vue';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export default defineComponent({
  name: 'Extable',
  props: {
    name: {
      type: String,
      required: false
    },
    target: {
      type: String,
      required: false
    }
  },
  setup(props, ctx) {
    const { proxy } = getCurrentInstance();
    const onExportExcel = (actionType, target, onActionFeedback) => {
      if (props.name && props.name === target) {
        proxy.$eventHub.$emit('component:track', props.target, path => {
          const table = document.querySelectorAll(`[path='${path}']`)[0];
          const fixedTable = table.querySelector('.el-table__fixed');
          const wb = XLSX.utils.table_to_book(fixedTable || table, {raw: true});
          const wbout = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array',
            bookSST: true,
          });
          FileSaver.saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            'sheetjs.xlsx'
          );
          onActionFeedback&&onActionFeedback('CANCEL_LOADING');
        });
      }
    };

    onMounted(() => {
      proxy.$eventHub.$on('component:telecontrol', onExportExcel);
    });
    onBeforeUnmount(() => {
      proxy.$eventHub.$off('component:telecontrol', onExportExcel);
    });
  }
});
</script>
