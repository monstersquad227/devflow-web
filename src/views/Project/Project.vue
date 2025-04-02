<template>
    <Layout>
        <div class="table-header">
            <a-button type="primary" @click="showSaveModal">
                <template #icon>
                    <PlusCircleOutlined />
                </template>添加</a-button>
<!--               <a-input-search style="width: 200px"/>-->
            <a-button type="primary" @click="refresh">
                <template #icon>
                    <ReloadOutlined />
                </template>刷新</a-button>
        </div>
        <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" :scroll="{ x: 1000 }" @change="onPaginationChange" >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'build'">
                    <a-button type="link" :disabled="idIsExist(record.id, projectBuildStatus)" :loading="idIsExist(record.id, projectBuildStatus)" @click="showBuildModal(record)" >{{ buildButtonText(record.id) }}</a-button>
                </template>
                <template v-if="column.key === 'deploy'">
                    <a-button type="link" @click="showDeployModal(record)">deploy</a-button>
                </template>
                <template v-if="column.key === 'action'">
                    <span>
                        <a @click="showUpdateModal(record)">编辑</a>
                        <a-divider type="vertical" />
                        <a @click="showDeleteProjectModal(record)">删除</a>
                        <a-divider type="vertical" />
                        <a>详情</a>
                    </span>
                </template>
            </template>
        </a-table>

        <SaveModal ref="projectSaveModal" />
        <BuildModal ref="projectBuildModal" :project="projectBuildRecord" />
        <DeployModal ref="projectDeployModal" :project="projectDeployRecord"/>
        <UpdateModal ref="projectUpdateModal" :project="projectUpdateRecord"/>
    </Layout>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { delProjects, getProjects, getProjectsBuildStatus } from "@/http/project";
import SaveModal from "./components/SaveModal.vue";
import BuildModal from "./components/BuildModal.vue"
import DeployModal from "@/views/Project/components/DeployModal.vue";
import Layout from "@/components/Layout.vue";
import { Modal } from "ant-design-vue";
import UpdateModal from "@/views/Project/components/UpdateModal.vue";
import { onBeforeRouteLeave } from "vue-router";
import { idIsExist } from "@/utils/exists";


const dataSource = ref([]);
const columns = [
    { title: "#", align: "center", dataIndex: "id", key: "id", width: 80 },
    { title: "项目名", align: "center", dataIndex: "gitlab_name", key: "gitlab_name", width: 200 },
    { title: "应用名", align: "center", dataIndex: "deployment_name", key: "deployment_name", width: 200 },
    { title: "任务ID", align: "center", dataIndex: "task_id", key: "task_id", width: 130 },
    { title: "构建", align: "center", key: "build", width: 110 },
    { title: "发布", align: "center", key: "deploy", width: 110 },
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
const projectUpdateModal = ref(false);
const projectUpdateRecord = ref(null);
const projectBuildStatus = ref([]);
const projectBuildStatusIntervalId = ref(null);

const showDeleteProjectModal = (record) => {
    Modal.confirm({
        title: record.gitlab_name+' 确定删除该项目吗？',
        onOk() {
            delProjects(record.id)
        },
    })
};
const showUpdateModal = (record) => {
    projectUpdateModal.value.visible = true;
    projectUpdateRecord.value = record;
};
const getProject = () => {
    getProjects(pagination.value.current, pagination.value.pageSize)
        .then((res) => {
            const { data, total } = res
            dataSource.value = data
            pagination.value.total = total
        })
};
const onPaginationChange = ({ current }) => {
    pagination.value.current = current
    getProject()
};
const refresh = () => {
    onPaginationChange({current: 1, pageSize: 10})
};
const showSaveModal = () => {
    projectSaveModal.value.visible = true;
};
const showBuildModal = (record) => {
    projectBuildRecord.value = record;
    projectBuildModal.value.visible = true;
};
const showDeployModal = (record) => {
    projectDeployRecord.value = record
    projectDeployModal.value.visible = true;
};
const buildButtonText = (id) => {
    return projectBuildStatus.value.includes(id) ? 'Running' : 'build';
};
const fetchProjectsBuildStatus = () => {
    getProjectsBuildStatus()
        .then((res) => {
            projectBuildStatus.value = res;
        })
};
const startCheckBuildStatusesInterval = () => {
    projectBuildStatusIntervalId.value = setInterval(() => {
        fetchProjectsBuildStatus();
    }, 3000)
};
const stopCheckBuildStatusesInterval = () => {
    clearInterval(projectBuildStatusIntervalId.value);
};
onMounted(() => {
    getProject();
    startCheckBuildStatusesInterval();
});
onBeforeUnmount(() => {
    stopCheckBuildStatusesInterval();
});
onBeforeRouteLeave(() => {
    stopCheckBuildStatusesInterval();
});

// function getProject() {
//     getProjects(pagination.value.current, pagination.value.pageSize)
//         .then((res) => {
//             const { data, total } = res
//             dataSource.value = data
//             pagination.value.total = total
//         })
// }
// function onPaginationChange({ current }) {
//     pagination.value.current = current
//     getProject()
// }
// function refresh() {
//     onPaginationChange({current: pagination.value.current, pageSize: 10})
// }
// function showSaveModal() {
//     projectSaveModal.value.visible = true;
// }
// function showBuildModal(record) {
//     projectBuildRecord.value = record;
//     projectBuildModal.value.visible = true;
// }
// function showDeployModal(record) {
//     projectDeployRecord.value = record
//     projectDeployModal.value.visible = true;
// }
</script>

<style>
.table-header {
    display: flex;
    align-items: center;
    margin: 0 0 24px 0;
    gap: 15px;
}
</style>
