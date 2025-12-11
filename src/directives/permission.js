import { hasPermission } from '@/utils/permission'

export default {
	mounted(el, binding) {
		const { value } = binding

		if (value) {
			const hasAuth = hasPermission(value)

			if (!hasAuth) {
				el.parentNode && el.parentNode.removeChild(el)
			}
		}
	}
}