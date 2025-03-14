import { request } from "./axios"
import { DEVFLOW } from './constants'


export const login = (account, password) => {
	return request(
		{
			url: DEVFLOW + '/user/login',
			method: 'post',
			data: {
				account,
				password
			}
		},
		{
			isTransformRequestResult: true
		}
	)
}
