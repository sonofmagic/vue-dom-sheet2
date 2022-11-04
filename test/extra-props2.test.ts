import { mount } from '@vue/test-utils'
import Vue from 'vue'
import VirtualList from '../src/components/components/VirtualList/index'
import { VirtualProps } from '../src/components/components/VirtualList/props'
import Item from './item.vue'
import { getDatas } from './util'

describe('extra-props inline', () => {
  const Instance = mount({
    name: 'test',
    components: {
      'virtual-list': VirtualList,
    },
    template: `
      <div id="app">
        <virtual-list class="my-list" style="height: 300px; overflow-y: auto;"
          :data-key="'id'"
          :data-sources="items"
          :data-component="item"
          :extra-props="{ otherProp }"
        />
      </div>
    `,
    data() {
      return {
        items: getDatas(1000),
        item: Item,
        otherProp: 'abc',
      }
    },
  })

  it('check mount', () => {
    expect(Instance.name()).toBe('test')
    expect(Instance.is('div')).toBe(true)
    expect(Instance.isVueInstance()).toBe(true)
    expect(Instance.find('.my-list').exists()).toBe(true)
  })

  it('check extra props render and data reactive', () => {
    const vmData = Instance.vm.$data
    const vslVm = Instance.find('.my-list').vm
    const rootEl = vslVm.$el
    const wrapperEl = rootEl.firstElementChild

    const checkProps = (otherProp) => {
      // items render content
      for (let i = 0; i < wrapperEl.childNodes.length; i++) {
        const itemEl = wrapperEl.childNodes[i]
        const itemInnerEl = itemEl.firstElementChild
        expect(itemInnerEl.className).toBe('inner')
        expect(itemInnerEl.querySelector('.index').textContent).toBe(`${i}`)
        expect(itemInnerEl.querySelector('.source').textContent).toBe(vmData.items[i].text)
        expect(itemInnerEl.querySelector('.other').textContent).toBe(otherProp)
      }
    }

    checkProps(vmData.otherProp)

    vmData.otherProp = 'xyz'
    Vue.nextTick(() => {
      checkProps('xyz')
    })
  })
})
