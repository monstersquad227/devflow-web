<template>
    <Layout>
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="routes">
                <a-table :columns="routesColumns" :data-source="routesDataSource" :scroll="{ x: 1500}"></a-table>
            </a-tab-pane>
            <a-tab-pane key="2" tab="services" force-render>
                <a-table :columns="columns" :data-source="dataSource"></a-table>
            </a-tab-pane>
            <a-tab-pane key="3" tab="upstreams">
                <a-table :columns="columns" :data-source="dataSource"></a-table>
            </a-tab-pane>
            <a-tab-pane key="4" tab="plugins">
                <a-table :columns="columns" :data-source="dataSource"></a-table>
            </a-tab-pane>
        </a-tabs>

    </Layout>
</template>

<script setup>

import Layout from "@/components/Layout.vue";
import {ref} from "vue";

const activeKey = ref("1");
const routesColumns = ref([
    { title: 'ID', dataIndex: 'id', key: 'id', width: 200 },
    { title: 'NAME', dataIndex: 'name', key: 'name', width: 100 },
    { title: 'PATHS', dataIndex: 'paths', key: 'paths', width: 100 },
    { title: 'SERVICES', dataIndex: 'services', key: 'services', width: 200 },
    { title: 'STRIP_PATH', dataIndex: 'strip_path', key: 'strip_path', width: 100 },
]);
const routesDataSource = ref([
    { id: '47b476ef-0c68-44c8-bdaf-8a6382d7d0a7', name: 'route_demoV2', paths: ["/devflow"], services: '44a45181-fa26-4448-b686-68d7572334a0', strip_path: 'false' },
    { id: '4a6bcadb-2cb4-4069-8a9f-66628d1f7f43', name: 'route_demo', paths: ["/baidu"], services: '4f49f494-0e71-473d-86f5-050e2b4510cf', strip_path: 'true' },
    { id: '75be4f68-79fc-4832-8483-daeb5cf9d933', name: 'flight_routes', paths: ["/MojoryApi"], services: '210cbc5c-1c83-4cc4-bd82-e785dd6d18a4', strip_path: 'false' },
    { id: 'c14f3ded-8632-47ff-964c-55533702efdb', name: 'route_demoV2_vms', paths: ["/devflow/vms/xxx/xxx"], services: '44a45181-fa26-4448-b686-68d7572334a0', strip_path: 'false' },
]);
const columns = ref([]);
const dataSource = ref([]);

</script>

<style scoped>

</style>