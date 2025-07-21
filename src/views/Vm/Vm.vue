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
        <a-table :data-source="dataSource" :columns="columns" :pagination="pagination" :scroll="{ x: 2000}" @change="onPaginationChange" >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <span>
                        <a @click="showUpdateModal(record)">编辑</a>
                        <a-divider type="vertical" />
                        <a @click="showDeleteVmModal(record)">删除</a>
                        <a-divider type="vertical" />
                        <template v-if="record.cloud_provider === 'aliyun'">
                            <a>续费</a>
                            <a-divider type="vertical" />
                        </template>
                        <a @click="showPasswordModal(record)">查看密码</a>
                        <a-divider type="vertical" />
                        <a @click="showAssignUserModal(record)">分配用户</a>
                    </span>
                </template>
                <template v-if="column.key === 'cloud_provider'">
                    <a-tag :color=getColorByCloud_provider(record.cloud_provider)>{{ getCloudProviderText(record.cloud_provider) }}</a-tag>
                </template>
                <template v-if="column.key === 'region'">
                    {{ getRegionText(record.region) }}
                </template>
                <template v-if="column.key === 'spec'">
                    <a-tooltip :title="getSpecDescribe(record.spec)">
                        <a-tag :color="getColorBySpec(record.spec)">{{ getSpecText(record.spec) }}</a-tag>
                    </a-tooltip>
                </template>
<!--                <template v-if="column.key === 'os'">-->
<!--                    <a-tag :color="getColorByOs(record.os)">{{ record.os }}</a-tag>-->
<!--                </template>-->
            </template>
        </a-table>

        <SaveModal ref="vmSaveModal"/>
        <UpdateModal ref="vmUpdateModal" :vm="vmUpdateRecord"/>
        <AssignUserModal ref="assignUserModal" />
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
import AssignUserModal from "@/views/Vm/components/AssignUserModal.vue";

const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: false,
    size: 'medium'
});
const dataSource = ref([]);
const columns = [
    // { title: '#', align: 'center', dataIndex: 'id', key: 'id', width: 80 },
    { title: '实例ID', align: 'center', dataIndex: 'instance_id', key: 'instance_id', width: 240 },
    { title: '实例名称', align: 'center', dataIndex: 'instance_name', key: 'instance_name', width: 180, ellipsis: true },
    { title: '平台', align: 'center', dataIndex: 'cloud_provider', key: 'cloud_provider', width: 80 },
    { title: '配置', align: 'center', dataIndex: 'spec', key: 'spec', width: 80 },
    { title: '内网IP', align: 'center', dataIndex: 'private_ip', key: 'private_ip', width: 150 },
    { title: '公网IP', align: 'center', dataIndex: 'public_ip', key: 'public_ip', width: 150 },
    { title: '地区', align: 'center', dataIndex: 'region', key: 'region', width: 80 },
    { title: '系统', align: 'center', dataIndex: 'os', key: 'os', width: 100 },
    { title: '创建时间', align: 'center', dataIndex: 'created_at', key: 'created_at', width: 200 },
    { title: '修改时间', align: 'center', dataIndex: 'updated_at', key: 'updated_at', width: 200 },
    { title: '操作', align: 'center', dataIndex: 'action', key: 'action', fixed: 'right', width: 300 }
];
const vmSaveModal = ref(false);
const vmUpdateModal = ref(false);
const assignUserModal = ref(false);
const vmUpdateRecord = ref(null);
const getColorByCloud_provider = (value) => {
    switch (value) {
        case 'aliyun': return '#FF6A00';
        case 'huawei': return '#F03B3B';
        case 'tencent': return '#1684FC';
        case 'aws': return '#FF9900';
        default: return '#4B5563';
    }
};
const getCloudProviderText = (value) => {
    switch (value) {
        case 'aliyun': return '阿里云';
        case 'huawei': return '华为云';
        case 'tencent': return '腾讯云';
        case 'aws': return '亚马云';
        default: return '本地云';
    }
};
const getRegionText = (value) => {
    switch (value) {
        case 'cn-shanghai': return '上海';
        case 'cn-hangzhou': return '杭州';
        case 'ap-shanghai': return '上海';
        case 'cn-east-2' : return '上海二';
        case 'cn-east-3' : return '上海一';
    }
};
const getColorBySpec = (value) => {
    switch (value) {
        case 'small': return '#A0AEC0';
        case 'medium': return '#805AD5';
        case 'large': return '#38A169';
        case 'xlarge': return '#D69E2E';
        case '2xlarge': return '#2B6CB0';
        case 'ultra': return '#E53E3E'
        default: return '#718096';
    }
};
const getSpecText = (value) => {
    switch (value) {
        case 'small': return '小型';
        case 'medium': return '中型';
        case 'large': return '大型';
        case 'xlarge': return '超大';
        case '2xlarge': return '巨型';
        case 'ultra': return '至尊';
        case 'mega': return '超级型';
        case 'tera': return '太级型';
        case 'peta': return '拍级型';
        case 'exa': return '艾级型';
        default: return value;
    }
};
const getSpecDescribe = (value) => {
    switch (value) {
        case 'small': return `1 核 / 2 G 内存 / 40 G 磁盘`;
        case 'medium': return `2 核 / 4 G 内存 / 80 G 磁盘`;
        case 'large': return `4 核 / 8 G 内存 / 100 G 磁盘`;
        case 'xlarge': return `8 vCPU / 16 G 内存 / 150 G 磁盘`;
        case '2xlarge': return `16 vCPU / 32 G 内存 / 180 G 磁盘`;
        case 'ultra': return `32 vCPU / 64 G 内存 / 230 G 磁盘`;
        case 'mega': return `64 vCPU / 128 G 内存 / 280 G 磁盘`;
        case 'tera': return `128 vCPU / 256 G 内存 / 320 G 磁盘`;
        case 'peta': return `256 vCPU / 512 G 内存 / 380 G 磁盘`;
        case 'exa': return `512 vCPU / 1 T 内存 / 520 G 磁盘`;
        default: return value;
    }
};
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
const showAssignUserModal = (record) => {
    assignUserModal.value.visible = true;
    assignUserModal.value.vmId = record.id;
}
const getData = async () => {
    await getVmData(pagination.value.current, pagination.value.pageSize)
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

onMounted( () => {
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
