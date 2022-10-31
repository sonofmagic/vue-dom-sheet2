import type { ObjectDirective } from 'vue-demi'
import PerfectScrollbar from 'perfect-scrollbar'
export default <ObjectDirective>{
  // bind(el){

  // }
  inserted(el, binding) {
    console.log(el, binding)
    // @ts-expect-error
    // if (el)
    //   new PerfectScrollbar(el)
  },
}
