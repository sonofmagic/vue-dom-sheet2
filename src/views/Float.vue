<script setup lang="ts">
import { computePosition, flip, shift } from '@floating-ui/dom'
import { onMounted, ref, shallowRef } from 'vue-demi'
const buttonRef = shallowRef()
const tooltipRef = shallowRef()
const tooltipVisible = ref(false)
function showTooltip() {
  if (tooltipVisible.value) {
    tooltipVisible.value = false
    return
  }
  tooltipVisible.value = true
  computePosition(buttonRef.value, tooltipRef.value, {
    placement: 'right',
    middleware: [flip(), shift({
      // padding: 100,
    })],
  }).then(({ x, y }) => {
    Object.assign(tooltipRef.value.style, {
      left: `${x}px`,
      top: `${y}px`,
    })
  })
}
</script>

<template>
  <div class="h-screen w-screen ">
    <div class="h-24" />
    <div>
      <button
        ref="buttonRef" class="border p-2 rounded bg-gray-200" aria-describedby="tooltip"
        @click="showTooltip"
      >
        My button
      </button>
      <div v-show="tooltipVisible" ref="tooltipRef" class="tooltip" role="tooltip">
        My tooltip
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tooltip {
    width: max-content;
    position: absolute;
    top: 0;
    left: 0;
    background: #222;
    color: white;
    font-weight: bold;
    padding: 5px;
    border-radius: 4px;
    font-size: 90%;
    height: 500px;
    width: 180px;
}
</style>
