import type { Ref } from 'vue-demi'
import type { IPosition } from '../../types'
export interface IPopoverContext {
  close: () => void
  show: (e: IPosition) => void
  el?: HTMLDivElement
  visible: Ref<boolean>
}
