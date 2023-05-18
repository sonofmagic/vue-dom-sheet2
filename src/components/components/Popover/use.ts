import { ref } from 'vue-demi'

import type { IPopoverContext } from './type'
export function usePopover() {
  const context: IPopoverContext = {
    show() {
      throw new Error('context is null')
    },
    close() {
      throw new Error('context is null')
    },
    el: undefined,
    visible: ref<boolean>(false)
  }
  return {
    context
  }
}
