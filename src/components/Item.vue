<script lang="ts" setup>
import { Fragment } from 'vue-fragment'
import { inject, toRefs, computed } from 'vue-demi'
import type { IDataSourceItem, IDataSourceRow } from './types'
import type { ICellEvents } from './contexts/CellEvents'
import { CellEventsSymbol } from './contexts/CellEvents'
const props = withDefaults(
  defineProps<{
    // rowIndex
    index: number
    source: IDataSourceRow
    attrs?:
      | Record<string, string>
      | ((
          item: IDataSourceItem<unknown>,
          colIndex: number,
          source: IDataSourceRow<unknown>,
          rowIndex: number
        ) => Record<string, string>)
    listeners?: { [key: string]: Function | Array<Function> }
  }>(),
  {
    attrs: undefined,
    listeners: undefined
  }
)

const events = inject(CellEventsSymbol, {})
const {
  contextmenu,
  dblclick,
  mousedown,
  mouseenter,
  mouseleave,
  mousemove,
  mouseup,
  drag,
  drop,
  dragstart,
  dragend
} = (events ?? {}) as Required<ICellEvents>

const { index: rowIndex, source, attrs, listeners } = toRefs(props)

const currentAttrs = computed(() => {
  return typeof attrs?.value === 'function'
    ? (item: IDataSourceItem<unknown>, colIndex: number) =>
        attrs?.value(item, colIndex, source.value, rowIndex.value, colIndex)
    : (...args: any[]) => attrs?.value
})

defineOptions({
  name: 'DomSheetCell'
})
</script>

<template>
  <Fragment>
    <td
      v-for="(item, colIndex) in source.cells"
      :key="item.id"
      data-sheet-cell="1"
      class="vue-dom-sheet-cell"
      :class="[
        item.selected ? 'selected' : undefined,
        item.disabled ? 'disabled' : undefined
      ]"
      v-bind="currentAttrs(item, colIndex)"
      v-on="listeners"
      @contextmenu="
        contextmenu($event, {
          rowIndex,
          colIndex,
          item
        })
      "
      @mousedown="
        mousedown($event, {
          rowIndex,
          colIndex,
          item
        })
      "
      @mouseup="
        mouseup($event, {
          rowIndex,
          colIndex,
          item
        })
      "
      @mousemove="
        mousemove($event, {
          rowIndex,
          colIndex,
          item
        })
      "
      @dblclick="
        dblclick($event, {
          rowIndex,
          colIndex,
          item
        })
      "
      @mouseleave="
        mouseleave($event, {
          rowIndex,
          colIndex,
          item
        })
      "
      @mouseenter="
        mouseenter($event, {
          rowIndex,
          colIndex,
          item
        })
      "
      @drop="
        drop($event, {
          rowIndex,
          colIndex,
          item
        })
      "
      @dragstart="
        dragstart($event, {
          rowIndex,
          colIndex,
          item
        })
      "
      @dragend="
        dragend($event, {
          rowIndex,
          colIndex,
          item
        })
      "
      @dragover.prevent>
      <slot
        class="sheet-cell-inner"
        :item="item"
        :col-index="colIndex"
        :row-index="rowIndex"
        :source="source"
        :attrs="attrs"
        :listeners="listeners" />
    </td>
  </Fragment>
</template>

<style lang="scss">
.vue-dom-sheet-cell {
  --color-sheet-cell-border: #eef0f4;
  --color-sheet-cell-selected-bg: rgb(17 24 39 / 0.1);
  --color-sheet-cell-disabled-bg: rgba(192, 196, 204, 0.1);
  --color-sheet-cell-has-note-bg: #3380ff;
  @apply p-0 border h-[48px] cursor-default select-none relative;
  border-color: var(--color-sheet-cell-border);

  &.selected::before {
    position: absolute;
    content: '';
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    background-color: var(--color-sheet-cell-selected-bg);
    pointer-events: none;
  }

  &.disabled::before {
    position: absolute;
    content: '';
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    background-color: var(--color-sheet-cell-disabled-bg);
    cursor: not-allowed;
    // pointer-events: none;
  }

  .has-note::after {
    // background-color: #3380FF;
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    height: 0;
    width: 0;
    border-top: 11px solid var(--color-sheet-cell-has-note-bg);
    border-left: 13px solid transparent;
  }

  .sheet-cell-inner {
    @apply select-none pointer-events-auto relative w-full h-full;
  }
}
</style>
