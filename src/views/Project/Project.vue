<template>
    <div class="table-header">
        <a-button type="primary" @click="showSaveModal">
            <template #icon>
                <PlusCircleOutlined />
            </template>
            添加项目</a-button>
<!--           <a-input-search style="width: 200px"/>-->
        <a-button type="primary" @click="refresh">
            <template #icon>
                <ReloadOutlined />
            </template>刷新</a-button>
    </div>
    <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" :scroll="{ x: 1000 }" @change="onPaginationChange" >
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'build'">
                <a-button type="link" @click="showBuildModal(record)">build</a-button>
            </template>
            <template v-if="column.key === 'deploy'">
                <a-button type="link" @click="showDeployModal(record)">deploy</a-button>
            </template>
            <template v-if="column.key === 'action'">
                <span>
                    <a>编辑</a>
                    <a-divider type="vertical" />
                    <a>删除</a>
                    <a-divider type="vertical" />
                    <a>详情</a>
                </span>
            </template>
        </template>
    </a-table>

    <SaveModal ref="projectSaveModal" />
    <BuildModal ref="projectBuildModal" :project="projectBuildRecord" />
    <DeployModal ref="projectDeployModal" :project="projectDeployRecord"/>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getProjects } from "@/http/project";
import SaveModal from "./components/SaveModal.vue";
import BuildModal from "./components/BuildModal.vue"
import DeployModal from "@/views/Project/components/DeployModal.vue";


const dataSource = ref([]);
const columns = [
    { title: "#", align: "center", dataIndex: "id", key: "id", width: 80 },
    { title: "项目名", align: "center", dataIndex: "gitlab_name", key: "gitlab_name", width: 200 },
    { title: "应用名", align: "center", dataIndex: "deployment_name", key: "deployment_name", width: 200 },
    { title: "任务模版", align: "center", dataIndex: "task_id", key: "task_id", width: 150 },
    { title: "构建", align: "center", key: "build", width: 100 },
    { title: "发布", align: "center", key: "deploy", width: 100 },
    { title: "操作", align: "center", key: "action", fixed: 'right', width: 180 },
];
const pagination= ref({
    current: 1,
    pageSize: 10,
    total: 0
});
const projectSaveModal = ref(false);
const projectBuildModal = ref(false);
const projectDeployModal = ref(false);
const projectBuildRecord = ref(null);
const projectDeployRecord = ref(null)


onMounted(() => {
    getProject();
});
function getProject() {
    getProjects(pagination.value.current, pagination.value.pageSize)
        .then((res) => {
            const { data, total } = res
            dataSource.value = data
            pagination.value.total = total
        })
}
function onPaginationChange({ current }) {
    pagination.value.current = current
    getProject()
}
function refresh() {
    onPaginationChange({current: pagination.value.current, pageSize: 10})
}
function showSaveModal() {
    projectSaveModal.value.visible = true;
}
function showBuildModal(record) {
    projectBuildRecord.value = record;
    projectBuildModal.value.visible = true;
}
function showDeployModal(record) {
    projectDeployRecord.value = record
    projectDeployModal.value.visible = true;
}
</script>

<style>
.table-header {
    display: flex;
    align-items: center;
    margin: 0 0 24px 0;
    gap: 15px;
}
</style>
