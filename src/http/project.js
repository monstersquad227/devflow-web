import {request} from './axios'
import {DEVFLOW} from "@/http/constants";

export function getProjects(pageNumber, pageSize) {
	return request(
		{

			url: `${DEVFLOW}/projects`,
			params: {
				"pageNumber": pageNumber,
				"pageSize": pageSize
			},
			method: 'GET'
		},
		{
			successMessageText: '操作成功'
		}
	)
}
