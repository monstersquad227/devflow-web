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