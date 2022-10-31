<script setup lang="ts">
import { onMounted, ref } from 'vue-demi'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
const dom = ref()

onMounted(() => {
  // console.log(dom.value)
  const ps = new PerfectScrollbar(dom.value)
})
</script>

<template>
  <div>
    <div ref="dom" class="relative w-[600px] h-[400px] bg-black">
      <div class="w-[1000px] h-[1000px] bg-pink-300" />
    </div>
  </div>
</template>

<style scoped>

</style>
