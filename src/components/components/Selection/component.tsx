import type { PropType } from 'vue-demi'
import { defineComponent, ref, toRefs, watch } from 'vue-demi'
import type { ISelectionContext } from './type'
import './component.scss'
export const Selection = defineComponent({
  name: 'CellSelection',
  props: {
    context: {
      type: Object as PropType<ISelectionContext>,
    },
    styleObject: {
      type: Object,
    },
  },
  setup(props) {
    const { context, styleObject } = toRefs(props)
    const dom = ref<HTMLDivElement>()
    const flag = ref(false)

    watch(
      () => {
        return dom.value
      },
      () => {
        if (context.value)
          context.value.el = dom.value
      },
    )
    const unwatch = watch(
      () => {
        return styleObject.value
      },
      () => {
        flag.value = true
        unwatch()
      },
    )
    return {
      dom,
      flag,
    }
  },
  // bg-gray-900 bg-opacity-10
  render() {
    return this.flag ? <div ref="dom" style={this.styleObject} class="vue-dom-sheet-selection"></div> : undefined
  },
})
