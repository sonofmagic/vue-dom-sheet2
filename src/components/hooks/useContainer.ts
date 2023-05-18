import type { MaybeRefOrGetter } from '@vueuse/core'
import { useElementBounding, useScroll } from '@vueuse/core'

export default function useContainer(
  el: MaybeRefOrGetter<HTMLElement | undefined>
) {
  const { x, y, top, right, bottom, left, width, height, update } =
    useElementBounding(el)

  const {
    x: scrollX,
    y: scrollY,
    directions,
    isScrolling,
    arrivedState
  } = useScroll(el)
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
    scrollY
  }
}
