<template>
    <Layout>
        <a-table :data-source="buildDataSource" :columns="buildColumns" :pagination="buildPagination" :scroll="{ x: 1000 }" @change="buildOnPaginationChange" >
        </a-table>
    </Layout>
</template>

<script setup>

import Layout from "@/components/Layout.vue";
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router';

const route = useRoute();
import {getProjectDetail} from "@/http/projectDetail";

const buildDataSource = ref([]);
const buildColumns = ref([
    { title: '#', align: 'center', dataIndex: 'id', key: 'id', width: 50 },
    { title: 'JobID', align: 'center', dataIndex: 'jenkins_id', key: 'jenkins_id', width: 80 },
    { title: '构建状态', align: 'center', dataIndex: 'build_status', key: 'build_status', width: 80 },
    { title: '构建参数', align: 'center', dataIndex: 'build_params', key: 'build_params', ellipsis: true, width: 250 },
    { title: '构建者', align: 'center', dataIndex: 'create_by', key: 'create_by', width: 80 },
    { title: '创建时间', align: 'center', dataIndex: 'create_time', key: 'create_time', width: 150 },
    { title: '更新时间', align: 'center', dataIndex: 'update_time', key: 'update_time', width: 150 },
]);
const buildPagination = ref({
    page: 1,
    pageSize: 10,
    total: 0,
});

const buildOnPaginationChange = ({ current }) => {
    buildPagination.value.current = current;
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