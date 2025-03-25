import {request} from "@/http/axios";
import {DEVFLOW} from "@/http/constants";

export function getVmData(pageNumber, pageSize) {
	return request(
		{
			url: `${DEVFLOW}/vms`,
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

export function getVmByApplication(application) {
	return request({
		url: `${DEVFLOW}/vms/${application}`,
		method: 'GET'
	})
}
