import { reactive, ref } from 'vue-demi'

import type { IPopoverContext } from './type'
export function usePopover() {
  const context: IPopoverContext = reactive({
    show() {
      throw new Error('context is null')
    },
    close() {
      throw new Error('context is null')
    },
    el: undefined,
    visible: ref<boolean>(false),
  })
  return {
    context,
  }
}
