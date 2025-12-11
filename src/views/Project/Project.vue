<template>
    <Layout>
        <div class="table-header">
            <a-button v-permission="'project:add'" type="primary" @click="showSaveModal">
                <template #icon>
                    <PlusCircleOutlined />
                </template>添加</a-button>
<!--               <a-input-search style="width: 200px"/>-->
            <a-button type="primary" @click="refresh">
                <template #icon>
                    <ReloadOutlined />
                </template>刷新</a-button>
        </div>
        <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" :scroll="{ x: 800 }" @change="onPaginationChange" :rowClassName="() => 'custom-row-style'" >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'build'">
                    <a-button
                            v-permission="'project:build'"
                            type="link"
                            :danger="idIsExist(record.id, projectBuildStatusFail)"
                            :disabled="idIsExist(record.id, projectBuildStatus)"
                            :loading="idIsExist(record.id, projectBuildStatus)"
                            @click="showBuildModal(record)"
                    >{{ buildButtonText(record.id) }}</a-button>
                </template>
                <template v-if="column.key === 'deploy'">
                    <a-button v-permission="'project:deploy'" type="link" @click="showDeployModal(record)">deploy</a-button>
                </template>
                <template v-if="column.key === 'action'">
                    <span>
                        <a v-permission="'project:edit'" @click="showUpdateModal(record)">编辑</a>
                        <a-divider v-permission="'project:edit'" type="vertical" />
                        <a v-permission="'project:delete'" @click="showDeleteProjectModal(record)">删除</a>
                        <a-divider v-permission="'project:delete'" type="vertical" />
                        <a v-permission="'project:view'" @click="showProjectDetailTable(record)">详情</a>
                    </span>
                </template>
            </template>
        </a-table>

        <SaveModal ref="projectSaveModal" @success="getProject"/>
        <BuildModal ref="projectBuildModal" :project="projectBuildRecord" />
        <DeployModal ref="projectDeployModal" :project="projectDeployRecord"/>
        <UpdateModal ref="projectUpdateModal" :project="projectUpdateRecord" @success="getProject"/>
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
import router from "@/router";


const dataSource = ref([]);
const columns = [
    { title: "#", align: "center", dataIndex: "id", key: "id", width: 80 },
    { title: "项目名", align: "center", dataIndex: "gitlab_name", key: "gitlab_name", width: 150 },
    { title: "应用名", align: "center", dataIndex: "deployment_name", key: "deployment_name", width: 150 },
    { title: "任务ID", align: "center", dataIndex: "task_id", key: "task_id", width: 80 },
    { title: "构建", align: "center", key: "build", width: 80 },
    { title: "发布", align: "center", key: "deploy", width: 80 },
    { title: "操作", align: "center", key: "action", fixed: 'right', width: 180 },
];
const pagination= ref({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: false,
    size: 'medium'
});
const projectSaveModal = ref(false);
const projectBuildModal = ref(false);
const projectDeployModal = ref(false);
const projectBuildRecord = ref(null);
const projectDeployRecord = ref(null)
const projectUpdateModal = ref(false);
const projectUpdateRecord = ref(null);
const projectBuildStatus = ref([]);
const projectBuildStatusFail = ref([]);
const projectBuildStatusIntervalId = ref(null);

const showDeleteProjectModal = (record) => {
    Modal.confirm({
        title: record.gitlab_name+' 确定删除该项目吗？',
        async onOk() {
            await delProjects(record.id)
            await getProject();
            if (dataSource.value.length === 0 && pagination.value.current > 1) {
                pagination.value.current--;
                await getProject();
            }
        },
    })
};
const showUpdateModal = (record) => {
    projectUpdateModal.value.visible = true;
    projectUpdateRecord.value = record;
};
const getProject = async () => {
    await getProjects(pagination.value.current, pagination.value.pageSize)
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
const refresh = async () => {
    await getProject();
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
            projectBuildStatus.value = res.ing;
            projectBuildStatusFail.value = res.fail;
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
const showProjectDetailTable = (record) => {
    router.push(`/project/${record.id}`);
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

.custom-row-style td {
    line-height: 55px;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}
</style>
