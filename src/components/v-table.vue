<!-- eslint-disable no-new -->
<script lang="ts" setup>
import { onMounted, provide, reactive, ref, shallowRef, toRefs } from 'vue-demi'
import { cloneDeep, forEach, throttle } from 'lodash-es'
import { unrefElement, useWindowScroll } from '@vueuse/core'
import PerfectScrollbar from 'perfect-scrollbar'
import { ContextMenu, Popover, Selection, VirtualList, useContextMenu, usePopover, useSelection } from './components'
import { useContainer, useKeyBoard } from './hooks'
import { getBoundingClientRect, getDirection } from './utils'
import type { ICellAttrs, IColumn, IDataSourceItem, IDataSourceRow, IScrollOffset } from './types'
import { CellEventsSymbol } from './contexts/CellEvents'
// import { vScrollbar } from './directives'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
const props = defineProps<{
  dataSource: IDataSourceRow[]
  columns: IColumn[]
  itemComponent: Function
  itemScopedSlots?: Record<string, unknown>
  onScrollToBottom?: ({ xAxisScrollbar, yAxisScrollbar }: { xAxisScrollbar: PerfectScrollbar; yAxisScrollbar: PerfectScrollbar }) => Promise<unknown> | unknown
}>()
const emit = defineEmits<{
  (e: 'scroll', payload: IScrollOffset): void
  // (e: 'scrolltobottom'): void
  // (e: 'scrolltoright'): void
  // (e: 'scrolltotop'): void
  // (e: 'scrolltoleft'): void
}>()
const { columns, dataSource, itemComponent, itemScopedSlots, onScrollToBottom } = toRefs(props)
const { context: valueSelectorContext } = usePopover()
const { context: showDetailContext } = usePopover()
const { x: windowX, y: windowY } = useWindowScroll()
const { shiftState, controlState } = useKeyBoard()

const { context: menuContext } = useContextMenu()
const containerRef = shallowRef<Element>()
const wrapperRef = shallowRef<Element>()
const yAxisScrollbar = shallowRef<PerfectScrollbar>()
const xAxisScrollbar = shallowRef<PerfectScrollbar>()
const { left: containerLeft, top: containerTop, scrollX: containerScrollX, scrollY: containerScrollY } = useContainer(containerRef)
onMounted(() => {
  // console.log(containerRef.value, wrapperRef.value)
  // 上下滚
  yAxisScrollbar.value = new PerfectScrollbar(unrefElement(containerRef.value) as Element)
  // 左右滚
  xAxisScrollbar.value = new PerfectScrollbar(unrefElement(wrapperRef.value) as Element)
})
const scrollToBottomLoading = ref(false)

const {
  resetSelectionPosition,
  selectionPosition,
  startCellAttrs,
  endCellAttrs,
  startEventTarget,
  assign: selectionAssign,
  reset: selectionReset,
  selectionStyle,
  context: selectionContext,
} = useSelection({
  container: {
    left: containerLeft,
    scrollX: containerScrollX,
    scrollY: containerScrollY,
    top: containerTop,
  },
  window: {
    scrollX: windowX,
    scrollY: windowY,
  },
})

const currentSelectionValues = ref<IDataSourceItem[]>()
const startSelection = ref(false)
const selectedCellSet = ref(new Set<IDataSourceItem>())

function onContextmenu(e: MouseEvent, attrs: ICellAttrs) {
  e.preventDefault()
  if (selectionContext.el) {
    const rect = getBoundingClientRect(selectionContext.el)
    menuContext.show({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    })
  }
  else {
    menuContext.show({
      x: e.x,
      y: e.y,
    })
  }
}
function getCurrentSelectionValues(start: ICellAttrs, end: ICellAttrs): IDataSourceItem[] {
  const { colIndex: startcolIndex, rowIndex: startrowIndex } = start
  const { colIndex: endcolIndex, rowIndex: endrowIndex } = end
  const rows = [Math.min(startrowIndex, endrowIndex), Math.max(startrowIndex, endrowIndex) + 1]
  const cols = [Math.min(startcolIndex, endcolIndex), Math.max(startcolIndex, endcolIndex) + 1]
  const values = dataSource.value.slice(...rows).map((x) => {
    return x.cells.slice(...cols)
  })
  return values.flat(1)
}

function setMoveStyle(rect: DOMRect) {
  // console.log(rect.left, selectionPosition.value.left)
  const originPointRect = getBoundingClientRect(startEventTarget.value)
  // console.log(originPointRect)
  const offsetX = rect.left - originPointRect.left // containerLeft.value - selectionPosition.value.left
  const offsetY = rect.top - originPointRect.top // containerTop.value - selectionPosition.value.top

  if (offsetX > 0) {
    // 右
    selectionPosition.value.right = rect.right + containerScrollX.value + windowX.value // - containerLeft.value
    selectionPosition.value.width = Math.abs(offsetX) + rect.width
  }
  else if (offsetX < 0) {
    // 左
    selectionPosition.value.left = rect.left + containerScrollX.value - containerLeft.value
    selectionPosition.value.width = Math.abs(offsetX) + rect.width
  }
  else {
    selectionReset('x')
  }

  // console.log(rect.top, selectionPosition.value.top)
  if (offsetY > 0) {
    // 下
    selectionPosition.value.bottom = rect.bottom + containerScrollY.value + windowY.value // - containerTop.value
    selectionPosition.value.height = Math.abs(offsetY) + rect.height
  }
  else if (offsetY < 0) {
    // 上
    //  - containerTop.value
    // console.log(containerTop.value, windowY.value)
    selectionPosition.value.top = rect.top + containerScrollY.value - containerTop.value
    selectionPosition.value.height = Math.abs(offsetY) + rect.height
  }
  else {
    selectionReset('y')
  }
  console.log(offsetX, offsetY, getDirection([offsetX, offsetY]))
}

function getTdElement(e: MouseEvent) {
  // @ts-expect-error
  const path = e.path as Element[]
  if (Array.isArray(path)) {
    for (let i = 0; i < path.length; i++) {
      const element = path[i]
      // @ts-expect-error
      if (element.tagName === 'TD' && element.dataset.sheetCell === '1')
        return element
    }
    return null
  }
  else {
    return null
  }
}
// https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/buttons
function onMousedown(e: MouseEvent, attrs: ICellAttrs) {
  const target = getTdElement(e)
  // console.log('onMousedown', e)

  if (e.buttons === 1 && e.button === 0 && target) {
    if (shiftState.value) {
      if (startEventTarget.value) {
        const rect = getBoundingClientRect(target)
        selectionReset()
        setMoveStyle(rect)
        // console.log(startEventTarget.value,target)
      }
      return
    }
    if (!controlState.value)
      resetDataSetSelected()
    // forEach(currentSelectionValues.value, x => {
    //   x.selected = true
    // })

    startEventTarget.value = target
    const rect = getBoundingClientRect(startEventTarget.value)
    // 设置开始拖动
    if (controlState.value)
      startSelection.value = true

    const computedRect = {
      left: rect.left + containerScrollX.value - containerLeft.value,
      right: rect.right + containerScrollX.value - containerLeft.value,
      top: rect.top + containerScrollY.value - containerTop.value,
      bottom: rect.bottom + containerScrollY.value - containerTop.value,
      width: rect.width,
      height: rect.height,
    }
    // console.log(containerScrollY.value, windowY.value, containerTop.value, computedRect)
    // debugger
    selectionAssign(computedRect)
    endCellAttrs.value = attrs
    Object.assign(resetSelectionPosition.value, selectionPosition.value)
  }
}

function selectCellOver(attrs: ICellAttrs) {
  startSelection.value = false
  startCellAttrs.value = attrs
  if (endCellAttrs.value && startCellAttrs.value) {
    let d: ICellAttrs = startCellAttrs.value
    // console.log(controlState.value,shiftState.value)
    // 避免不按ctrl时拖动选中多个cell
    if (!controlState.value)
      d = endCellAttrs.value

    // shfit 时点击其他选择多个
    if (shiftState.value)
      d = startCellAttrs.value

    const values = getCurrentSelectionValues(endCellAttrs.value, d)
    currentSelectionValues.value = values
    // forEach(currentSelectionValues.value, x => {
    //     x.selected = true
    //   })
    forEach(values, (x) => {
      x.selected = true
      selectedCellSet.value.add(x)
    })
  }
}

function onMouseup(e: MouseEvent, attrs: ICellAttrs) {
  // console.log('onMouseup', e)
  if (e.buttons === 0 && e.button === 0)
    selectCellOver(attrs)
}

const dblclickCellAttrs = ref<ICellAttrs>()

function onDblclick(e: MouseEvent, attrs: ICellAttrs) {
  // console.log('onDblclick', e)
  const target = getTdElement(e)
  if (target) {
    const rect = getBoundingClientRect(target)

    valueSelectorContext.show({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    })
    dblclickCellAttrs.value = attrs
  }
}

function _onMousemove(e: MouseEvent) {
  const target = getTdElement(e)
  if (target) {
    if (startSelection.value) {
      const rect = getBoundingClientRect(target)
      setMoveStyle(rect)
    }
  }
}

const onMousemove = throttle(_onMousemove, 20)

const detailCellAttrs = ref<ICellAttrs>()

function onMouseenter(e: MouseEvent, attrs: ICellAttrs) {
  // console.log('onMouseenter',e)

  const target = getTdElement(e)
  if (target) {
    showDetailContext.close()
    if (attrs.item.value) {
      const rect = getBoundingClientRect(target)
      detailCellAttrs.value = attrs
      showDetailContext.show({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      })
    }
  }
}

function onMouseleave(e: MouseEvent, attrs: ICellAttrs) {
  // console.log('onMouseleave',e)
  // const target = getTdElement(e)
  // if(target){
  //   showDetailContext.close()
  // }
}

function resetDataSetSelected() {
  forEach(dataSource.value, (x) => {
    forEach(x.cells, (y) => {
      y.selected = false
    })
  })
  selectedCellSet.value.clear()
}

async function onContainerScroll(payload: UIEvent) {
  // @ts-expect-error
  // console.log(payload.target.scrollLeft, payload.target.scrollTop)
  const target = payload.target
  if (target) {
    emit('scroll', {
      // @ts-expect-error
      scrollLeft: target.scrollLeft ?? 0,
      // @ts-expect-error
      scrollTop: target.scrollTop ?? 0,
    })

    // console.log(target.scrollHeight, target.scrollWidth)
    // console.log(target.scrollTop, target.scrollLeft)
    // @ts-expect-error

    let shouldTrigger = false

    // be aware of difference between clientHeight & offsetHeight & window.getComputedStyle().height
    const scrollBottom = target.scrollTop + target.clientHeight
    shouldTrigger = target.scrollHeight - scrollBottom <= 0
    // console.log(target.scrollTop, target.clientHeight, target.scrollHeight)
    if (shouldTrigger && !scrollToBottomLoading.value) {
      try {
        scrollToBottomLoading.value = true
        await onScrollToBottom?.value?.({
          xAxisScrollbar: xAxisScrollbar.value,
          yAxisScrollbar: yAxisScrollbar.value,
        })
        // emit('scrolltobottom')
      }
      finally {
        scrollToBottomLoading.value = false
      }
    }

    // @ts-expect-error
    // if (target.scrollWidth === target.scrollLeft)
    //   emit('scrolltoright')
  }
}

// function onDrag(e: DragEvent, attrs: ICellAttrs) {
//   console.log('onDrag', e, attrs)
// }
const dragCellAttrs = ref<ICellAttrs>()
function onDrop(e: DragEvent, attrs: ICellAttrs) {
  // console.log('onDrop', e, attrs)
  if (dragCellAttrs.value)
    attrs.item.value = cloneDeep(dragCellAttrs.value.item.value)
}

function onDragstart(e: DragEvent, attrs: ICellAttrs) {
  // console.log('onDragstart', e, attrs)
  dragCellAttrs.value = attrs
}

function onDragend(e: DragEvent, attrs: ICellAttrs) {
  // console.log('onDragend', e, attrs)
  dragCellAttrs.value = undefined
}

function selectColumn(idx: number, value = true) {
  forEach(dataSource.value, (row) => {
    const item = row.cells[idx]
    item.selected = value
    if (value)
      selectedCellSet.value.add(item)

    else
      selectedCellSet.value.delete(item)
  })
}

function selectRow(idx: number, value = true) {
  forEach(dataSource.value[idx].cells, (item) => {
    item.selected = value
    if (value)
      selectedCellSet.value.add(item)

    else
      selectedCellSet.value.delete(item)
  })
}

// <{
//   selectColumn: typeof selectColumn
//   selectRow: typeof selectRow
// }>
defineExpose({
  selectColumn,
  selectRow,
})

provide(
  CellEventsSymbol,
  reactive({
    contextmenu: onContextmenu,
    dblclick: onDblclick,
    mousedown: onMousedown,
    mouseenter: onMouseenter,
    mouseleave: onMouseleave,
    mousemove: onMousemove,
    mouseup: onMouseup,
    // drag: onDrag,
    drop: onDrop,
    dragstart: onDragstart,
    dragend: onDragend,
  }),
)
</script>

<template>
  <div ref="wrapperRef" class="vue-dom-sheet-wrapper">
    <VirtualList
      ref="containerRef" table table-class="vue-dom-sheet-virtual-table" class="vue-dom-sheet-virtual-list"
      data-key="key" :data-sources="dataSource" :data-component="itemComponent" :item-scoped-slots="itemScopedSlots"
      @scroll.passive="onContainerScroll"
    >
      <template #thead>
        <thead class="vue-dom-sheet-virtual-table-head">
          <tr>
            <th
              v-for="(t, i) in columns" :key="i" class="vue-dom-sheet-virtual-table-head-cell"
              @click.stop="selectColumn(i)"
            >
              {{ t.title }}
            </th>
          </tr>
        </thead>
      </template>
      <template #colgroup>
        <col
          v-for="col in columns" :key="col.key" :style="{
            'min-width': `${col.width}px`,
          }" :width="col.width"
        >
      </template>
      <template #append>
        <Selection :context="selectionContext" :style-object="selectionStyle" />
        <ContextMenu :context="menuContext">
          <slot name="context-menu" :selected-cell-set="selectedCellSet" :menu-context="menuContext" />
        </ContextMenu>
        <Popover :context="valueSelectorContext" placement="bottom-start">
          <slot name="value-selector" :attrs="dblclickCellAttrs" />
        </Popover>
        <Popover :context="showDetailContext" placement="bottom-start">
          <slot name="detail" :attrs="detailCellAttrs" />
        </Popover>
      </template>
    </VirtualList>
  </div>
</template>

<style lang="scss">
.vue-dom-sheet-wrapper {
  @apply relative flex;

  .ps__rail-x,
  .ps__rail-y {
    z-index: 2;
  }

  .vue-dom-sheet-virtual-table {
    @apply w-auto table-fixed border-collapse text-center bg-white;

    .vue-dom-sheet-virtual-table-head {
      @apply sticky top-0 left-0 z-[1];

      .vue-dom-sheet-virtual-table-head-cell {
        @apply p-0 h-[48px] text-center border border-[#EEF0F4] cursor-pointer bg-white;
      }
    }
  }

  .vue-dom-sheet-virtual-list {
    @apply relative;
  }

}
</style>
