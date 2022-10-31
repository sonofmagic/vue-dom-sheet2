import type { ObjectDirective } from 'vue-demi'
import PerfectScrollbar from 'perfect-scrollbar'
export default <ObjectDirective<Element>>{
  // bind(el){

  // }
  inserted(el, binding) {
    // console.log(el, binding)
    // @ts-expect-error
    if (el)
      // eslint-disable-next-line no-new
      new PerfectScrollbar(el)
  },
}
