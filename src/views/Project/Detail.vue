<template>
    <Layout>
        <a-tabs v-model:activeKey="activeKey" @change="tabsChange">
            <a-tab-pane key="1" tab="构建详情">
                <a-table :data-source="buildDataSource" :columns="buildColumns" :pagination="buildPagination" :scroll="{ x: 1000 }" @change="buildOnPaginationChange" >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'jenkins_id'">
                            <a :href="`http://jenkins.chengdd.cn/job/${record.task_name}/${record.jenkins_id}/consoleText`" target="_blank" >{{ record.jenkins_id }}</a>
                        </template>
                    </template>
                </a-table>
            </a-tab-pane>
            <a-tab-pane key="2" tab="K8s发布详情">

            </a-tab-pane>
            <a-tab-pane key="3" tab="Docker发布详情">

            </a-tab-pane>
        </a-tabs>
    </Layout>
</template>

<script setup>

import Layout from "@/components/Layout.vue";
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
import { getProjectDetail } from "@/http/projectDetail";

const activeKey = ref("1");
const route = useRoute();
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

const tabsChange = () => {
    console.log("activeKey", activeKey.value);
};
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