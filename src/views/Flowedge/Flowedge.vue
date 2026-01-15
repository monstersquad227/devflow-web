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
                        <a v-permission="'flowedge:instruction'">指令</a>
                        <a-divider v-permission="'flowedge:instruction'" type="vertical" />
                        <a v-permission="'flowedge:edit'" @click="showUpdateModal(record)">编辑</a>
                        <a-divider v-permission="'flowedge:edit'" type="vertical" />
                        <a v-permission="'flowedge:view'" @click="showDetailModal(record)">详情</a>
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
        <DetailModal ref="flowedgeDetailModal"/>
    </Layout>
</template>

<script setup>

import Layout from "@/components/Layout.vue";
import {h, onMounted, ref} from "vue";
import {getFlowedges} from "@/http/flowedge";
import UpdateModal from "@/views/Flowedge/components/UpdateModal.vue";
import DetailModal from "@/views/Flowedge/components/DetailModal.vue";

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
const flowedgeDetailModal = ref(false);

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
const showUpdateModal= ({ agent_id, application }) => {
    flowedgeUpdateModal.value.visible = true;
    flowedgeUpdateModal.value.application = application;
    flowedgeUpdateModal.value.flowedgeID = agent_id;
};
const showDetailModal = (val) => {
    let metadataObj = {}
    try {
        metadataObj = JSON.parse(val.metadata)
    } catch (e) {
        console.error('解析 metadata 出错', e)
    }

    flowedgeDetailModal.value.visible = true;
    flowedgeDetailModal.value.metadata = metadataObj;
}

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