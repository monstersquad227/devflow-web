import axios from 'axios'
import { message } from 'ant-design-vue'
import router from '../router'
import store from '../store'
import {baseURL} from "@/http/constants";

const { VUE_APP_BASEURL } = process.env

export const InvalidTokenCodes = [3045, 3046]
export function is(val, type) {
	return toString.call(val) === `[object ${type}]`
}
export const isObject = (val) => {
	return val !== null && is(val, 'Object')
}

// 消息弹框
const showToast = (content, type, onClose) => {
	if (!content) return
	message[type]({
		type,
		content,
		onClose
	})
}

// 登录过期
let loginExpiredVisible = false
const loginExpiredHandle = (message) => {
	if (!loginExpiredVisible) {
		loginExpiredVisible = true
		showToast(message || '请重新登录', 'error', () => {
			loginExpiredVisible = false
		})
		store.dispatch('clearUserInfo').then()
		if (router.currentRoute.value.name !== 'Login') {
			router.push('/login')
		}
	}
}

export const request = (requestOptions, options) => {
	return new Promise((resolve, reject) => {
		const { url, method, responseType } = requestOptions
		const { baseUrl, isTransformRequestResult, successMessageText, errorMessageText, errorMessageTextVisible = true, mockUrl = '' } = options ?? Object.create(null)
		const _url = url
		if (requestOptions.headers) {
			requestOptions.headers.token = store.getters.token
		} else {
			requestOptions.headers = {
				token: store.getters.token
			}
		}
		axios
			.request({
				...requestOptions,
				url: mockUrl ? mockUrl : _url,
				method: method || 'POST'
			})
			.then((res) => {
				if (res.status === 200) {
					const data = res.data

					if (InvalidTokenCodes.includes(Number(data.code))) {
						loginExpiredHandle(data.message)
						reject(data.result)
						return
					}
					if (isTransformRequestResult) {
						resolve(data)
					} else {
						if (data.code === 0) {
							showToast(successMessageText, 'success')
							resolve(data.result)
						} else {
							showToast(errorMessageText || data.message || '系统忙不过来了，请稍后再试', 'error')
							reject(data.result)
						}
					}
				}
				else {
					if (errorMessageTextVisible) {
						if (isObject(res) && isObject(res.data)) {
							const data = res.data
							showToast(data.message || errorMessageText || '系统忙不过来了，请稍后再试', 'error')
						} else {
							showToast(errorMessageText || '系统忙不过来了，请稍后再试', 'error')
						}
					}
					reject(res)
				}
			})
			.catch((err) => {
				if (axios.isCancel(err)) {
					reject(err)
					return
				}
				if (err && err.isAxiosError) {
					const data = err.response?.data
					if (data && InvalidTokenCodes.includes(Number(data.code))) {
						loginExpiredHandle(data.message)
						reject(data)
						return
					}
					if (errorMessageTextVisible) {
						showToast(errorMessageText || data?.message || '系统忙不过来了，请稍后再试', 'error')
					}
					reject(data || err)
					return
				}
				if (errorMessageTextVisible) {
					showToast(errorMessageText || '系统忙不过来了，请稍后再试', 'error')
				}
				reject(err)
			})
	})
}
