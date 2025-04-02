<template>
    <Layout>
        <div class="table-header">
        <a-button type="primary" @click="showSaveModal">
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
                        <a @click="showUpdateModal(record)">编辑</a>
                        <a-divider type="vertical" />
                        <a @click="showDeleteVmModal(record)">删除</a>
                        <a-divider type="vertical" />
                        <a @click="showPasswordModal(record)">查看密码</a>
                    </span>
                </template>
                <template v-if="column.key === ''"></template>
            </template>
        </a-table>

        <SaveModal ref="vmSaveModal"/>
        <UpdateModal ref="vmUpdateModal" :vm="vmUpdateRecord"/>
    </Layout>
</template>
<script setup>

import {onMounted, ref} from "vue";
import {delVmData, getVmData, getVmPasswordData} from "@/http/vm";
import Layout from "@/components/Layout.vue";
import SaveModal from "@/views/Vm/components/SaveModal.vue";
import {Modal} from "ant-design-vue";
import {Base64} from "js-base64";
import UpdateModal from "@/views/Vm/components/UpdateModal.vue";

const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    size: 'medium'
});
const dataSource = ref([]);
const columns = [
    { title: '#', align: 'center', dataIndex: 'id', key: 'id', width: 80 },
    { title: '实例ID', align: 'center', dataIndex: 'instance_id', key: 'instance_id', width: 220 },
    { title: '实例名称', align: 'center', dataIndex: 'instance_name', key: 'instance_name', width: 180 },
    { title: '内网IP', align: 'center', dataIndex: 'private_ip', key: 'private_ip', width: 180 },
    { title: '公网IP', align: 'center', dataIndex: 'public_ip', key: 'public_ip', width: 180 },
    { title: '配置', align: 'center', dataIndex: 'spec', key: 'spec', width: 120 },
    { title: '地区', align: 'center', dataIndex: 'region', key: 'region', width: 180 },
    { title: '平台', align: 'center', dataIndex: 'cloud_provider', key: 'cloud_provider', width: 80 },
    { title: '系统', align: 'center', dataIndex: 'os', key: 'os', width: 100 },
    { title: '创建时间', align: 'center', dataIndex: 'created_at', key: 'created_at', width: 200 },
    { title: '修改时间', align: 'center', dataIndex: 'updated_at', key: 'updated_at', width: 200 },
    { title: '操作', align: 'center', dataIndex: 'action', key: 'action', fixed: 'right', width: 200 }
];
const vmSaveModal = ref(false);
const vmUpdateModal = ref(false);
const vmUpdateRecord = ref(null);
const showDeleteVmModal = (record) => {
    Modal.confirm({
        title: record.instance_id+' 确定删除吗?',
        onOk() {
            delVmData(record.id)
            console.log('OK');
        },
    })
};
const showPasswordModal = async (record) => {
    const password = ref('')
    try {
        const res = await getVmPasswordData(record.id);
        password.value = Base64.decode(res);
    } catch (error) {
        password.value = '123456';
    }

    Modal.success({
        title: record.instance_id,
        content: password.value,
    })
};
const showUpdateModal = (record) => {
    vmUpdateRecord.value = record;
    vmUpdateModal.value.visible = true;
};
const getData = () => {
    getVmData(pagination.value.current, pagination.value.pageSize)
        .then(res => {
            const { data, total } = res
            dataSource.value = data || []
            pagination.value.total = total || 0
        })
};
const onPaginationChange = ({ current }) => {
    pagination.value.current = current
    getData()
};
const showSaveModal = () => {
    vmSaveModal.value.visible = true
};
const refresh = () => {
    onPaginationChange({ current: 1, pageSize: 10})
};

onMounted(() => {
    getData()
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
