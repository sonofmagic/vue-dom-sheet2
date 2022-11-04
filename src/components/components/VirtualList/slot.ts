import { defineComponent, h } from 'vue-demi'
import { SlotProps } from './props'
import { Wrapper } from './mixin'
// wrapping for slot
export const Slot = defineComponent({
  name: 'VirtualListSlot',
  mixins: [Wrapper],

  props: SlotProps,

  render() {
    const { tag, uniqueKey } = this

    return h(
      tag,
      {
        key: uniqueKey,
        attrs: {
          role: uniqueKey,
        },
      },
      this.$slots.default,
    )
  },
})
