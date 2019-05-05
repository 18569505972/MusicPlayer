import header from './pageHead.vue'
const PageHead = {
	install:(Vue) => {
		Vue.component('pageHead', header)
	}
}
export default PageHead