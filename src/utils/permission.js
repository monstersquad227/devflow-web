import store from '@/store'

/**
 * 检查是否有某个权限
 * @param {string} permission - 权限码
 * @returns {boolean}
 */
export function hasPermission(permission) {
	const permissions = store.getters.permissions
	return permissions.includes(permission)
}

/**
 * 检查是否有某个角色
 * @param {string} roleCode - 角色码
 * @returns {boolean}
 */
export function hasRole(roleCode) {
	const roles = store.getters.roles
	return roles.some(role => role.roleCode === roleCode)
}

/**
 * 检查是否有任意一个权限
 * @param {string[]} permissions - 权限码数组
 * @returns {boolean}
 */
export function hasAnyPermission(permissions) {
	return permissions.some(permission => hasPermission(permission))
}

/**
 * 检查是否有所有权限
 * @param {string[]} permissions - 权限码数组
 * @returns {boolean}
 */
export function hasAllPermissions(permissions) {
	return permissions.every(permission => hasPermission(permission))
}