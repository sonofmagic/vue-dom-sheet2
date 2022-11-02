<script setup lang="ts">
import { Checkbox } from 'element-ui'
import { toRefs } from 'vue-demi'
const props = defineProps<{
  index: number
  source: {}
}>()
const { index } = toRefs(props)
</script>

<template>
  <div class="h-[48px] border w-full">
    <div class="p-2">
      <Checkbox :true-label="true" :false-label="false" />
      选中第{{ index + 1 }}行
    </div>
  </div>
</template>

<style scoped>

</style>
