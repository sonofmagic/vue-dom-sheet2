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
      :class="[item.selected ? 'selected' : undefined, item.disabled ? 'disabled' : undefined]" @contextmenu.prevent="
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
      <slot class="sheet-cell-inner" :item="item" :col-index="colIndex" :row-index="rowIndex" :source="source" />
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

  &.disabled::before {
    position: absolute;
    content: '';
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    background-color: rgba(192, 196, 204, 0.10);
    cursor: not-allowed;
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
    @apply select-none pointer-events-auto relative w-full h-full;
  }
}
</style>
