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

export function getProjectsBranches(gitlabId) {
	return request({
		url: `${DEVFLOW}/projects/${gitlabId}/branches`,
		method: 'GET'
	})
}

export function saveProjects(data) {
	return request({
		url: `${DEVFLOW}/projects`,
		data
	}, {
		successMessageText: '操作成功'
	})
}
