import { computed, ref } from 'vue-demi'
import { pick } from 'lodash-es'
import type { ICellAttrs } from '../../types'

import type { ISelectionContext, ISelectionRect, useSelectionOptions } from './type'

export function useSelection(options: useSelectionOptions) {
  const selectionBorderOffest = 0
  const context: ISelectionContext = {}
  const selectionPosition = ref<ISelectionRect>({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: 0,
    height: 0,
  })

  const resetSelectionPosition = ref<ISelectionRect>({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: 0,
    height: 0,
  })
  const startCellAttrs = ref<ICellAttrs>()
  const endCellAttrs = ref<ICellAttrs>()

  const startEventTarget = ref<EventTarget | null>()
  const startEventTargetRect = ref<DOMRect | null>()
  const assign = (rect: Partial<ISelectionRect>) => {
    return Object.assign(selectionPosition.value, rect)
  }

  const reset = (col?: 'x' | 'y') => {
    if (col === 'x') {
      selectionPosition.value.width = resetSelectionPosition.value.width
      selectionPosition.value.left = resetSelectionPosition.value.left
      selectionPosition.value.right = resetSelectionPosition.value.right
    }
    else if (col === 'y') {
      selectionPosition.value.height = resetSelectionPosition.value.height
      selectionPosition.value.top = resetSelectionPosition.value.top
      selectionPosition.value.bottom = resetSelectionPosition.value.bottom
    }
    else {
      Object.assign(selectionPosition.value, resetSelectionPosition.value)
    }
  }

  const selectionStyle = computed(() => {
    return Object.entries(pick(selectionPosition.value, ['left', 'right', 'top', 'bottom', 'width', 'height'])).reduce<Record<string, string>>((acc, [key, value]) => {
      if (['left', 'right', 'top', 'bottom'].includes(key))
        acc[key] = `${value - selectionBorderOffest}px`
      else
        acc[key] = `${value}px`

      return acc
    }, {})
  })
  return {
    resetSelectionPosition,
    selectionPosition,
    startCellAttrs,
    endCellAttrs,
    startEventTarget,
    startEventTargetRect,
    assign,
    reset,
    selectionStyle,
    context,
  }
}
