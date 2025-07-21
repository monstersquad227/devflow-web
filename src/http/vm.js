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

export function postSaveVmData(data) {
	return request({
		url: `${DEVFLOW}/vms`,
		data
	},{
		successMessageText: '操作成功'
	})
}

export function updateVmData(data) {
	return request({
		url: `${DEVFLOW}/vms`,
		method: 'PUT',
		data
	}, {
		successMessageText: "操作成功"
	})
}

export function delVmData(id) {
	return request({
		url: `${DEVFLOW}/vms/${id}`,
		method: 'DELETE'
	},{
		successMessageText: '操作成功'
	})
}

export function getVmPasswordData(id) {
	return request({
		url: `${DEVFLOW}/vms/${id}/password`,
		method: 'GET'
	})
}

export function getVmByApplication(application) {
	return request({
		url: `${DEVFLOW}/vms/${application}`,
		method: 'GET'
	})
}

export function getUsersByVm(vmId) {
	return request({
		url: `${DEVFLOW}/vms/${vmId}/users`,
		method: 'GET'
	})
}

export function postUsersByUser(vmId, data) {
	return request({
		url: `${DEVFLOW}/vms/${vmId}/users`,
		method: 'POST',
		data: data
	}, {
		successMessageText: '操作成功'
	})
}
