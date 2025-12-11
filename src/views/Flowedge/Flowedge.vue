<template>
    <Layout>
        <div class="table-header">
            <a-button type="primary" @click="refresh">
                <template #icon>
                    <ReloadOutlined />
                </template>
                刷新</a-button>
        </div>
        <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :scroll="{ x: 'max-content' }"  @change="onPaginationChange">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <span>
                        <a>指令</a>
                        <a-divider type="vertical" />
                        <a @click="showUpdateModal(record)">编辑</a>
                        <a-divider type="vertical" />
                        <a>详情</a>
<!--                        <a-divider type="vertical" />-->
<!--                        <a>启动</a>-->
<!--                        <a-divider type="vertical" />-->
                    </span>
                </template>
                <template v-if="column.key === 'status'">
                    <span>
                        <a-badge :status="getFlowedgeStatus(record.status).s" />
                        {{ getFlowedgeStatus(record.status).t }}
                    </span>
                </template>
            </template>
        </a-table>

        <UpdateModal ref="flowedgeUpdateModal" :FlowedgeAgentID="flowedgeAgentId" @success="getData"/>
    </Layout>
</template>

<script setup>

import Layout from "@/components/Layout.vue";
import {onMounted, ref} from "vue";
import {getFlowedges} from "@/http/flowedge";
import UpdateModal from "@/views/Flowedge/components/UpdateModal.vue";

const columns = ref([
    { title: '名称', align: 'left', dataIndex: 'agent_id', key: 'agent_id', width: 180, ellipsis: true },
    { title: '主机名', align: 'left', dataIndex: 'hostname', key: 'hostname', width: 160, ellipsis: true },
    { title: '状态', align: 'center', dataIndex: 'status', key: 'status', width: 80 },
    { title: '版本', align: 'center', dataIndex: 'version', key: 'version', width: 100 },
    { title: '关联项目', align: 'center', dataIndex: 'application', key: 'application', width: 120 },
    { title: '心跳时间', align: 'center', dataIndex: 'last_heartbeat', key: 'last_heartbeat', width: 180 },
    { title: '操作', align: 'center', dataIndex: 'action', key: 'action', fixed: 'right', width: 150 }
]);
const dataSource = ref([]);
const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: false,
    size: 'medium'
});
const flowedgeUpdateModal = ref(false);
const flowedgeAgentId = ref('');

const getData = async () => {
    await getFlowedges(pagination.value.current, pagination.value.pageSize)
            .then(res => {
                const { data, total } = res
                dataSource.value = data || []
                pagination.value.total = total || 0
            })
};
const refresh = async () => {
    await getData();
};
const onPaginationChange = async ({ current }) => {
    pagination.value.current = current
    await getData()
};
const getFlowedgeStatus= (val) => {
    let s = ''
    let t = ''
    switch (val) {
        case 'online':
            s = 'success'
            t = '在线'
            break
        default:
            s = 'error'
            t = '离线'
    }
    return { s, t }
};
const showUpdateModal= (record) => {
    flowedgeUpdateModal.value.visible = true;
    flowedgeUpdateModal.value.application = record.application;
    flowedgeUpdateModal.value.flowedgeID = record.agent_id;
};

onMounted(async () => {
    await getData()
});
</script>

<style scoped>
.table-header {
    display: flex;
    align-items: center;
    margin: 0 0 24px 0;
    gap: 15px;
}
</style>