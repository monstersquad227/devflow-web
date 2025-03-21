<template>
    <Layout>
        <div class="table-header">
            <a-button type="primary">
                <template #icon>
                    <PlusCircleOutlined />
                </template>
                添加</a-button>
            <a-button type="primary" @click="refresh">
                <template #icon>
                    <ReloadOutlined />
                </template>
                刷新</a-button>
        </div>
        <a-table :data-source="dataSource" :columns="columns" :pagination="pagination" :scroll="{ x: 1800}" @change="onPaginationChange" >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <span>
                        <a>编辑</a>
                        <a-divider type="vertical" />
                        <a>删除</a>
                        <a-divider type="vertical" />
                        <a>查看密码</a>
                    </span>
                </template>
                <template v-if="column.key === ''"></template>
            </template>
        </a-table>
    </Layout>
</template>
<script setup>

import Layout from "@/components/Layout.vue";
import {onMounted, ref} from "vue";
import { getVmData } from "@/http/vm"

const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    size: 'medium'
})
const dataSource = ref([])
const columns = [
    { title: '', align: 'center', dataIndex: 'id', key: 'id', width: 80 },
    { title: '实例ID', align: 'center', dataIndex: 'instance_id', key: 'instance_id', width: 220 },
    { title: '实例名称', align: 'center', dataIndex: 'instance_name', key: 'instance_name', width: 180 },
    { title: '内网IP', align: 'center', dataIndex: 'private_ip', key: 'private_ip', width: 180 },
    { title: '公网IP', align: 'center', dataIndex: 'public_ip', key: 'public_ip', width: 180 },
    { title: '配置', align: 'center', dataIndex: 'spec', key: 'spec', width: 80 },
    { title: '地区', align: 'center', dataIndex: 'region', key: 'region', width: 180 },
    { title: '平台', align: 'center', dataIndex: 'cloud_provider', key: 'cloud_provider', width: 80 },
    { title: '系统', align: 'center', dataIndex: 'os', key: 'os', width: 100 },
    { title: '创建时间', align: 'center', dataIndex: 'created_at', key: 'created_at', width: 200 },
    { title: '修改时间', align: 'center', dataIndex: 'updated_at', key: 'updated_at', width: 200 },
    { title: '操作', align: 'center', dataIndex: 'action', key: 'action', fixed: 'right', width: 200 }
]

onMounted(() => {
    getData()
})

function getData() {
    getVmData(pagination.value.current, pagination.value.pageSize)
        .then(res => {
            const { data, total } = res
            dataSource.value = data || []
            pagination.value.total = total || 0
        })
}

function onPaginationChange({current, pageSize}) {
    pagination.value.current = current
    getData()
}

function refresh() {
    onPaginationChange({current: pagination.value.current, pageSize: 10})
}
</script>
<style scoped>
.table-header {
    display: flex;
    align-items: center;
    margin: 0 0 24px 0;
    gap: 15px;
}
</style>
