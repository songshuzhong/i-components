<template>
  <el-button
    primary
    plain
    size="small"
    class="i-extable__container"
    :loading="isLoading"
    @click="onExportExcel"
  >
    导出
  </el-button>
</template>

<script>
import {defineComponent, getCurrentInstance, ref} from 'vue';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export default defineComponent({
  name: 'Extable',
  props: {
    target: {
      type: String,
      required: false
    }
  },
  setup(props, ctx) {
    const {proxy} = getCurrentInstance();
    const isLoading = ref(false);
    const onExportExcel = () => {
      isLoading.value = true;
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
        isLoading.value = false;
      });
    };
    return {
      onExportExcel,
      isLoading
    };
  }
});
</script>

<style>
.i-extable__container {
  margin: 0 10px;
}
</style>
