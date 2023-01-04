<script setup lang="ts">
import { onMounted, ref } from 'vue-demi'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
const dom = ref()
const color = ref('red')
onMounted(() => {
  // console.log(dom.value)
  // const ps = new PerfectScrollbar(dom.value, {
  //   wheelPropagation: false
  // })
})
</script>

<template>
  <div>
    <!-- <div class="text">hello</div> -->
    <div ref="dom" class="relative w-[600px] h-[400px] bg-black overflow-auto" @scroll.stop>
      <div class="w-[1000px] h-[1000px] bg-pink-300" />
    </div>
    <div class="flow-root h-72"></div>
  </div>
</template>

<style scoped>
.text {
  color: v-bind(color);
}
</style>
