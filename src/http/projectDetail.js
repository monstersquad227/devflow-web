import {request} from './axios';
import {DEVFLOW} from "@/http/constants";

export function getProjectDetail(id) {
	return request({
		url: `${DEVFLOW}/projects/${id}/builds/details`,
		method: 'get',
	}, {
		successMessageText: '操作成功'
	})
}