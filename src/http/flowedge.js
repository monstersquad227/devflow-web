import {request} from './axios';
import {DEVFLOW} from "@/http/constants";

export function getFlowedges(pageNumber, pageSize) {
	return request(
		{
			url: `${DEVFLOW}/flowedges`,
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

export function getFlowedgesByApplication(application) {
	return request({
		url: `${DEVFLOW}/flowedges/${application}`,
		method: 'GET'
	})
}

export function patchFlowedgeApplication(data, agent_id) {
	return request({
		url: `${DEVFLOW}/flowedges/${agent_id}`,
		method: 'PATCH',
		data: data
	}, {
		successMessageText: '操作成功'
	})
}