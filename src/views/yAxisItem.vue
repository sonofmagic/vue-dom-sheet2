<script setup lang="ts">
import { Checkbox } from 'element-ui'
import { inject, toRefs } from 'vue-demi'
import { yAxisSymbol } from './symbol'
const props = defineProps<{
  index: number
  source: {}
}>()
const { index } = toRefs(props)

const { onChange } = inject(yAxisSymbol, {})
</script>

<template>
  <div class="h-[48px] border-t border-r border-l w-full">
    <div class="p-2">
      <Checkbox :true-label="true" :false-label="false" @change="onChange(props.index, $event)" />
      选中第{{ index + 1 }}行
    </div>
  </div>
</template>

<style scoped>

</style>
