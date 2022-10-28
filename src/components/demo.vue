<script lang="ts" setup>
import { ref } from 'vue-demi'
// import Sheet from '@/components/Sheet/index.vue'

import vTable from './v-table.vue'
import type { IScrollOffset } from './types'
import { useDataSource } from './hooks'
import item from './Item.vue'
const { columns, dataSource } = useDataSource()
const dom = ref<HTMLDivElement>()
const syncScroll = ({ scrollLeft, scrollTop }: IScrollOffset) => {
  if (dom.value) {
    dom.value.scrollLeft = scrollLeft
    dom.value.scrollTop = scrollTop
  }
}
</script>

<template>
  <div class="max-w-[100vw] max-h-[100vh]">
    <div class="flex relative p-16 h-screen">
      <div class="mr-2 flex-shrink-0 w-[200px] flex flex-col">
        <div class="text-lg p-2 h-[48px] flex-shrink-0">
          阿斯蒂芬
        </div>
        <div ref="dom" class="flex-1 overflow-y-hidden">
          <div class="table border-collapse w-full">
            <div class="table-row-group">
              <div v-for="(row, idx) in dataSource" :key="row.key" class="h-[48px] border table-row">
                <div class="table-cell p-2">
                  <el-checkbox />
                  选中第{{ idx + 1 }}行
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <Sheet :columns="columns" :dataSource="dataSource" @scroll="syncScroll"></Sheet> -->
      <vTable :columns="columns" :data-source="dataSource" :item-component="item" @scroll="syncScroll" />
    </div>
  </div>
</template>

<style scoped></style>
