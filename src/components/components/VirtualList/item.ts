/**
 * item and slot component both use similar wrapper
 * we need to know their size change at any time
 */

import { defineComponent, h } from 'vue-demi'
import { ItemProps } from './props'
import { Wrapper } from './mixin'
// wrapping for item
export const Item = defineComponent({
  name: 'VirtualListItem',
  mixins: [Wrapper],

  props: ItemProps,

  render() {
    const { tag, component, extraProps = {}, index, source, scopedSlots = {}, uniqueKey, slotComponent } = this

    const props = {
      ...extraProps,
      source,
      index,
    }

    return h(
      tag,
      {
        key: uniqueKey,
        attrs: {
          role: 'listitem',
        },
      },
      [
        slotComponent
          ? h('div', slotComponent({ item: source, index, scope: props }))
          : h(component, {
            props,
            scopedSlots,
          }),
      ],
    )
  },
})

