import type { MaybeElement } from '@vueuse/core'
import { useElementBounding, useScroll } from '@vueuse/core'
import type { Ref } from 'vue-demi'
export default function useContainer(el: Ref<MaybeElement>) {
  const { x, y, top, right, bottom, left, width, height, update } = useElementBounding(el)
  // @ts-expect-error
  const { x: scrollX, y: scrollY, directions, isScrolling, arrivedState } = useScroll(el)
  return {
    x,
    y,
    top,
    right,
    bottom,
    left,
    width,
    height,
    update,
    directions,
    isScrolling,
    arrivedState,
    scrollX,
    scrollY,
  }
}
