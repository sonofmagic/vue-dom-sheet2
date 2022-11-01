<script lang="ts" setup>
import { toRefs } from 'vue-demi'
import type { IDataSourceItem, IDataSourceRow } from '@/components/types'
const props = defineProps<{
  colIndex: number
  rowIndex: number
  source: IDataSourceRow
  item: IDataSourceItem
}>()

const { colIndex, rowIndex, item, source } = toRefs(props)
</script>

<template>
  <div v-if="item.value" draggable class="border-l-2 border-[blue] h-full flex justify-between">
    <div
      :class="{
        'cursor-pointer': Boolean(item.value),
        'has-note': Boolean(item.value.remark),
      }" class="text-left flex flex-col justify-evenly pl-1.5"
    >
      <div class="text-[13px] text-[#333333]">
        {{ item.value.name }}
      </div>
      <div class="text-xs text-[#B1B9CC]">
        {{ item.value.startTime }}-{{ item.value.endTime }}
      </div>
    </div>
    <div class="text-xs flex items-center pr-1.5">
      {{ item.locked ? '锁' : '' }}
    </div>
  </div>
</template>

<style scoped>

</style>
