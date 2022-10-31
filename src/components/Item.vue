<script lang="ts" setup>
import { Fragment } from 'vue-fragment'
import { inject, toRefs } from 'vue-demi'
import type { IDataSourceRow } from './types'
import type { ICellEvents } from './contexts/CellEvents'
import { CellEventsSymbol } from './contexts/CellEvents'
const props = defineProps<{
  // rowIndex
  index: number
  source: IDataSourceRow
}>()

const events = inject(CellEventsSymbol, {})
const { contextmenu, dblclick, mousedown, mouseenter, mouseleave, mousemove, mouseup, drag, drop, dragstart, dragend } = (events ?? {}) as Required<ICellEvents>

const { index: rowIndex, source } = toRefs(props)
</script>

<template>
  <Fragment>
    <td
      v-for="(item, colIndex) in source.cells" :key="item.id" data-sheet-cell="1" class="vue-dom-sheet-cell"
      :class="[item.selected ? 'selected' : '']" @contextmenu.prevent="
        contextmenu($event, {
          rowIndex,
          colIndex,
          item,
        })
      " @mousedown="
        mousedown($event, {
          rowIndex,
          colIndex,
          item,
        })
      " @mouseup="
        mouseup($event, {
          rowIndex,
          colIndex,
          item,
        })
      " @mousemove="
        mousemove($event, {
          rowIndex,
          colIndex,
          item,
        })
      " @dblclick="
        dblclick($event, {
          rowIndex,
          colIndex,
          item,
        })
      " @mouseleave="
        mouseleave($event, {
          rowIndex,
          colIndex,
          item,
        })
      " @mouseenter="
        mouseenter($event, {
          rowIndex,
          colIndex,
          item,
        })
      " @drop="drop($event, {
        rowIndex,
        colIndex,
        item,
      })" @dragstart="dragstart($event, {
        rowIndex,
        colIndex,
        item,
      })" @dragend="dragend($event, {
        rowIndex,
        colIndex,
        item,
      })" @dragover.prevent
    >
      <!-- <slot :rowIndex="rowIndex" :colIndex="colIndex" :source="source" :item="item">

      </slot> -->
      <div
        v-if="item.value" draggable :class="{
          'cursor-pointer': Boolean(item.value),
          'has-note': Boolean(item.note),
        }" class="sheet-cell-inner"
      >
        <div class="text-left flex flex-col justify-evenly pl-1.5">
          <div class="text-[13px] text-[#333333]">
            加科技看看{{ item.value }}
          </div>
          <div class="text-xs text-[#B1B9CC]">
            15:30-18:00
          </div>
        </div>
        <div class="text-xs flex items-center pr-1.5">
          {{ item.locked ? '锁' : '' }}
        </div>
      </div>
    </td>
  </Fragment>
</template>

<style lang="scss">
.vue-dom-sheet-cell {
  @apply p-0 border border-[#EEF0F4] h-[48px] cursor-default select-none relative;

  &.selected::before {
    position: absolute;
    content: '';
    left: 1px;
    right: 1px;
    top: 1px;
    bottom: 1px;
    background-color: rgb(17 24 39 / 0.1);

  }

  .has-note::after {
    // background-color: #3380FF;
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    height: 0;
    width: 0;
    border-top: 11px solid #3380ff;
    border-left: 13px solid transparent;
  }

  .sheet-cell-inner {
    @apply select-none pointer-events-auto relative w-full h-full flex justify-between border-l-[2px] border-blue-600;
  }
}
</style>
