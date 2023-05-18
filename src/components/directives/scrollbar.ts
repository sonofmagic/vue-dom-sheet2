import type { ObjectDirective } from 'vue-demi'
import PerfectScrollbar from 'perfect-scrollbar'
export default <ObjectDirective<Element>>{
  inserted(el, binding) {
    if (el)
      // eslint-disable-next-line no-new
      new PerfectScrollbar(el)
  }
}
