import type { PropType } from 'vue-demi'
import { Ref, defineComponent, onMounted, ref, toRefs, watch } from 'vue-demi'
import { onClickOutside } from '@vueuse/core'
import type { ReferenceElement } from '@floating-ui/dom'
import { autoPlacement, computePosition, flip, offset, shift } from '@floating-ui/dom'
import type { IPosition } from '../../types'
import type { IContextMenuContext } from './type'
import { IContextMenuProps } from './type'
import './component.scss'
export const ContextMenu = defineComponent({
  name: 'ContextMenu',
  props: {
    context: {
      type: Object as PropType<IContextMenuContext>,
    },
  },
  setup(props) {
    const { context } = toRefs(props)

    const visible = ref(false)
    const menuRef = ref<HTMLDivElement>()

    function close() {
      visible.value = false
    }

    function show(e: IPosition) {
      const width = e.width ?? 0
      const height = e.height ?? 0
      const bottom = e.bottom ?? 0
      const right = e.right ?? 0
      const virtualEl: ReferenceElement = {
        getBoundingClientRect() {
          return {
            x: e.x,
            y: e.y,
            left: e.x,
            top: e.y,
            width,
            height,
            bottom,
            right,
          }
        },
      }
      if (menuRef.value) {
        const rect = menuRef.value.getBoundingClientRect()
        // console.log(rect)
        computePosition(virtualEl, menuRef.value, {
          placement: 'right',
          middleware: [
            offset({
              mainAxis: 10,
              alignmentAxis: -rect.height / 2,
            }),
            // flip(),
            autoPlacement(),
            shift(),
          ],
        }).then(({ x, y }) => {
          Object.assign(menuRef.value!.style, {
            left: `${x}px`,
            top: `${y}px`,
          })
          visible.value = true
        })
      }
    }
    onClickOutside(menuRef, () => {
      close()
    })

    // if (context?.value) {
    //   context.value.close = close
    //   context.value.show = show
    // }

    watch(
      () => menuRef.value,
      () => {
        if (context?.value) {
          context.value.el = menuRef.value
          context.value.close = close
          context.value.show = show
        }
      },
    )

    return {
      visible,
      menuRef,
      close,
    }
  },
  render() {
    return (
      <div style={{ visibility: this.visible ? 'visible' : 'hidden' }} ref="menuRef" class="vue-dom-sheet-context-menu">
        {this.$slots.default}
      </div>
    )
  },
})
