<template>
    <Layout>
        <a-tabs v-model:activeKey="activeKey" @change="tabsChange">
            <a-tab-pane key="1" tab="构建详情">
                <a-table :data-source="buildDataSource" :columns="buildColumns" :pagination="buildPagination" :scroll="{ x: 1000 }" @change="buildOnPaginationChange" >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'jenkins_id'">
                            <a-button type="link" @click="showDrawer(record.id)">
                                {{ record.jenkins_id }}
                            </a-button>
                            <a-drawer size="large" width="80%" direction="rtl" :open="drawerSwitch" @close="drawerClose">
                                <pre style="white-space: pre-wrap; font-family: monospace;" v-html="consoleText" />
                            </a-drawer>
                        </template>
                    </template>
                </a-table>
            </a-tab-pane>
            <a-tab-pane key="2" tab="K8s发布详情">
                <a-table :data-source="kubernetesDataResource" :columns="kubernetesColumns" :pagination="kubernetesPagination" :scroll="{ x: 1000 }">
                </a-table>
            </a-tab-pane>
            <a-tab-pane key="3" tab="Docker发布详情">
                <a-table :data-source="dockerDataResource" :columns="dockerColumns" :pagination="dockerPagination" :scroll="{ x: 1500 }">
                </a-table>
            </a-tab-pane>
            <a-tab-pane key="4" tab="Flowbox发布详情">
                <a-table :data-source="flowboxDataSource" :columns="flowboxColumns" :pagination="flowboxPagination" :scroll="{ x: 1500 }">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'resource'">
                            <a-switch v-model:checked="record.resource" :disabled="true" :checked-children="translateSwitch(record.resource)" :un-checked-children="translateSwitch(record.resource)" />
                        </template>
                        <template v-if="column.key === 'hpa'">
                            <a-switch v-model:checked="record.hpa" :disabled="true" :checked-children="translateSwitch(record.hpa)" :un-checked-children="translateSwitch(record.hpa)" />
                        </template>
                    </template>
                </a-table>
            </a-tab-pane>
        </a-tabs>
    </Layout>
</template>

<script setup>

import Layout from "@/components/Layout.vue";
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
import {getProjectDetail, getProjectDetailText} from "@/http/projectDetail";

const activeKey = ref("1");
const route = useRoute();
const drawerSwitch = ref(false);
const consoleText = ref("");
const showDrawer = (id) => {
    getProjectDetailText(id).then(res => {
        consoleText.value = res
                .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
                .replace(/(\[ERROR] )/g, '<span style="color: #e74c3c; font-weight: bold;">$1</span>')
                .replace(/(ERROR:)/g, '<span style="color: #e74c3c; font-weight: bold;">$1</span>')

    })
    drawerSwitch.value = true;
};
const drawerClose = () => {
    drawerSwitch.value = false;
};

const buildDataSource = ref([]);
const buildColumns = ref([
    { title: '#', align: 'center', dataIndex: 'id', key: 'id', width: 50 },
    { title: 'JobID', align: 'center', dataIndex: 'jenkins_id', key: 'jenkins_id', width: 80 },
    { title: '任务名称', align: 'center', dataIndex: 'task_name', key: 'task_name', width: 140 },
    { title: '构建状态', align: 'center', dataIndex: 'build_status', key: 'build_status', width: 100 },
    { title: '构建参数', align: 'center', dataIndex: 'build_params', key: 'build_params', ellipsis: true, width: 250 },
    { title: '构建者', align: 'center', dataIndex: 'create_by', key: 'create_by', width: 80 },
    { title: '创建时间', align: 'center', dataIndex: 'create_time', key: 'create_time', width: 180 },
    { title: '更新时间', align: 'center', dataIndex: 'update_time', key: 'update_time', width: 180 },
]);
const buildPagination = ref({
    page: 1,
    pageSize: 10,
    total: 0,
    size: 'medium',
    hideOnSinglePage: true
});

const kubernetesDataResource = ref([
    { id: 101, env: 'dev', namespace: 'dev', image: 'harbor.chengduoduo.com/dev/gateway:20250327_141202-7aeeeb1f', created_by: 'yening', created_at: '2025-04-07 07:46:31'}
]);
const kubernetesColumns = ref([
    { title: '#', align: 'center', dataIndex: 'id', key: 'id', width: 50 },
    { title: '环境', align: 'center', dataIndex: 'env', key: 'env', width: 80 },
    { title: '名称空间', align: 'center', dataIndex: 'namespace', key: 'namespace', width: 80 },
    { title: '版本', align: 'center', dataIndex: 'image', key: 'image', width: 100 },
    { title: '发布者', align: 'center', dataIndex: 'created_by', key: 'created_by', width: 80 },
    { title: '发布时间', align: 'center', dataIndex: 'created_at', key: 'created_at', width: 200 },
]);
const kubernetesPagination = ref({
    page: 1,
    pageSize: 10,
    total: 0,
    size: 'medium',
    hideOnSinglePage: true
})

const dockerDataResource = ref([
    { id: 101, env: 'prod', machine: '["192.168.1.10", "192.168.1.30"]', image: 'harbor.chengduoduo.com/dev/gateway:20250327_141202-7aeeeb1f', created_by: 'yening', created_at: '2025-04-07 07:46:31' }
]);
const dockerColumns = ref([
    { title: '#', align: 'center', dataIndex: 'id', key: 'id', width: 50 },
    { title: '环境', align: 'center', dataIndex: 'env', key: 'env', width: 80 },
    { title: '机器', align: 'center', dataIndex: 'machine', key: 'machine', width: 200 },
    { title: '版本', align: 'center', dataIndex: 'image', key: 'image', width: 100 },
    { title: '发布者', align: 'center', dataIndex: 'created_by', key: 'created_by', width: 80 },
    { title: '发布时间', align: 'center', dataIndex: 'created_at', key: 'created_at', width: 200 },
]);
const dockerPagination = ref({
    page: 1,
    pageSize: 10,
    total: 0,
    size: 'medium',
    hideOnSinglePage: true
});

const flowboxDataSource = ref([
    { id: 1, replicas: 2, image: 'harbor.chengduoduo.com/dev/gateway:20250327_141202-7aeeeb1f', resource: true, hpa: false, created_by: 'yening', created_at: '2025-04-23 06:23:31' },
]);
const flowboxColumns = ref([
    { title: '#', align: 'center', dataIndex: 'id', key: 'id', width: 50 },
    { title: '副本数', align: 'center', dataIndex: 'replicas', key: 'replicas', width: 80 },
    { title: '版本', align: 'center', dataIndex: 'image', key: 'image', width: 100 },
    { title: '资源限制', align: 'center', dataIndex: 'resource', key: 'resource', width: 100 },
    { title: '自动伸缩',align: 'center', dataIndex: 'hpa', key: 'hpa', width: 100 },
    { title: '发布者', align: 'center', dataIndex: 'created_by', key: 'created_by', width: 80 },
    { title: '发布时间', align: 'center', dataIndex: 'created_at', key: 'created_at', width: 200 },
]);
const flowboxPagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  size: 'medium',
  hideOnSinglePage: true
});

const tabsChange = () => {
    console.log("activeKey", activeKey.value);
};
const buildOnPaginationChange = ({ current }) => {
    buildPagination.value.current = current;
};

const translateSwitch = (value) => {
    return value === true ? '开启' : '关闭';
};

onMounted(() => {
    const projectId = route.fullPath.split("/").at(-1)
    getProjectDetail(projectId)
        .then((res) => {
            const { data, total } = res;
            buildDataSource.value = data;
            buildPagination.value.total = total;
        })
})
</script>

<style scoped>

</style>