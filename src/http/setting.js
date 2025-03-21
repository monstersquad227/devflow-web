import {request} from "@/http/axios";
import {DEVFLOW} from "@/http/constants";

export function getEnvData(pageNumber, pageSize) {
	return request({
		url: `${DEVFLOW}/setting/envs`,
		params: {
			"pageNumber": pageNumber,
			"pageSize": pageSize
		},
		method: 'GET'
	},{
		successMessageText: '操作成功'
	})
}

export function getImageData(pageNumber, pageSize) {
	return request({
		url: `${DEVFLOW}/setting/images`,
		params: {
			"pageNumber": pageNumber,
			"pageSize": pageSize
		},
		method: 'GET'
	})
}

export function getTaskData(pageNumber, pageSize) {
	return request({
		url: `${DEVFLOW}/setting/tasks`,
		params: {
			"pageNumber": pageNumber,
			"pageSize": pageSize
		},
		method: 'GET'
	})
}
