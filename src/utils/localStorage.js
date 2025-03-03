export function setStorage(name, value) {
	if (!value || !name) return
	window.localStorage.setItem(name, JSON.stringify(value))
}

export function delStorage(name) {
	window.localStorage.removeItem(name)
}

export function getStorage(name) {
	const data = window.localStorage.getItem(name)
	if (!data) {
		return null
	}
	try {
		return JSON.parse(data)
	} catch (err) {
		return null
	}
}
