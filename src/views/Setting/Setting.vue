<template>
    <Layout>
        <a-tabs v-model:activeKey="activeKey" @change="tabsChange">
            <a-tab-pane key="1" >
                <template #tab>
                    <span>
                        <EnvironmentOutlined />
                        环境
                    </span>
                </template>
                <div class="table-header">
                    <a-button v-permission="'setting:env:add'" type="primary" @click="showEnvSaveModal"><template #icon><PlusCircleOutlined /></template>添加</a-button>
                    <a-button type="primary" @click="envRefresh"><template #icon><ReloadOutlined /></template>刷新</a-button>
                </div>
                <a-table :data-source="envDataSource" :columns="envColumns" :scroll="{ x: 'max-content' }" :pagination="envPagination" @change="envOnPaginationChange" >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'action'">
                            <span>
                                <a v-permission="'setting:env:edit'" @click="showUpdateEnvModal(record)">编辑</a>
                                <a-divider type="vertical" />
                                <a v-permission="'setting:env:delete'" @click="showDeleteEnvConfirm(record)">删除</a>
                            </span>
                        </template>
                    </template>
                </a-table>
            </a-tab-pane>
            <a-tab-pane key="2" >
                <template #tab>
                    <span>
                        <EnvironmentOutlined />
                        镜像
                    </span>
                </template>
                <div class="table-header">
                    <a-button v-permission="'setting:image:add'" type="primary" @click="showSaveImageModal"><template #icon><PlusCircleOutlined /></template>添加</a-button>
                    <a-button type="primary" @click="imageRefresh"><template #icon><ReloadOutlined /></template>刷新</a-button>
                </div>
                <a-table :data-source="imageDataSource" :columns="imageColumns" :scroll="{ x: 'max-content' }" :pagination="imagePagination" @change="imageOnPaginationChange" >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'action'">
                            <span>
                                <a v-permission="'setting:image:edit'" @click="showUpdateImageModal(record)">编辑</a>
                                <a-divider type="vertical" />
                                <a v-permission="'setting:image:delete'" @click="showDeleteImageConfirm(record)">删除</a>
                            </span>
                        </template>
                    </template>
                </a-table>
            </a-tab-pane>
            <a-tab-pane key="3" >
                <template #tab>
                    <span>
                        <EnvironmentOutlined />
                        任务
                    </span>
                </template>
                <div class="table-header">
                    <a-button v-permission="'setting:task:add'" type="primary" @click="showTaskSaveModal"><template #icon><PlusCircleOutlined /></template>添加</a-button>
                    <a-button type="primary" @click="taskRefresh"><template #icon><ReloadOutlined /></template>刷新</a-button>
                </div>
                <a-table :data-source="taskDataSource" :columns="taskColumns" :scroll="{ x: 'max-content' }" :pagination="taskPagination" @change="taskOnPaginationChange" >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'action'">
                            <span>
                                <a v-permission="'setting:task:edit'" @click="showTaskUpdateModal(record)">编辑</a>
                                <a-divider type="vertical" />
                                <a v-permission="'setting:task:delete'" @click="showTaskDeleteModal(record)">删除</a>
                            </span>
                        </template>
                    </template>
                </a-table>
            </a-tab-pane>
        </a-tabs>
        <EnvSaveModal ref="envSaveModal" @success="getEnvsData" />
        <EnvUpdateModal ref="envUpdateModal" :env="envUpdateRecord" @success="getEnvsData" />
        <ImageSaveModal ref="imageSaveModal" @success="getImagesData" />
        <ImageUpdateModal ref="imageUpdateModal" :image="imageUpdateRecord" @success="getImagesData"/>
        <TaskSaveModal ref="taskSaveModal" @success="getTasksData" />
        <TaskUpdateModal ref="taskUpdateModal" :task="taskUpdateRecord" @success="getTasksData" />
    </Layout>
</template>

<script setup>

import { ref } from "vue";
import {deleteEnv, deleteImage, deleteTask, getEnvData, getImageData, getTaskData} from "@/http/setting";
import Layout from "@/components/Layout.vue";
import EnvSaveModal from "@/views/Setting/components/EnvSaveModal.vue";
import { message, Modal } from "ant-design-vue";
import EnvUpdateModal from "@/views/Setting/components/EnvUpdateModal.vue";
import ImageSaveModal from "@/views/Setting/components/ImageSaveModal.vue";
import ImageUpdateModal from "@/views/Setting/components/ImageUpdateModal.vue";
import TaskSaveModal from "@/views/Setting/components/taskSaveModal.vue";
import TaskUpdateModal from "@/views/Setting/components/taskUpdateModal.vue";

const activeKey = ref('');
const tabsChange = (activeKey) => {
    switch (activeKey) {
        case '1':
            return getEnvsData();
        case '2':
            return getImagesData();
        case '3':
            return getTasksData();
    }
};

const envDataSource = ref([]);
const envColumns = ref([
    { title: '#', align: 'center', dataIndex: 'id', key: 'id', width: 60 },
    { title: '环境名', align: 'center', dataIndex: 'name', key: 'name', width: 80 },
    { title: '备注', align: 'center', dataIndex: 'remark', key: 'remark', width: 100 },
    { title: '创建人', align: 'center', dataIndex: 'created_by', key: 'created_by', width: 120 },
    { title: '更新人', align: 'center', dataIndex: 'updated_by', key: 'updated_by', width: 120 },
    { title: '创建时间', align: 'center', dataIndex: 'created_at', key: 'created_at', width: 150 },
    { title: '更新时间', align: 'center', dataIndex: 'updated_at', key: 'updated_at', width: 150 },
    { title: '操作', align: 'center', key: 'action', fixed: 'right', width: 150 }
]);
const envPagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    size: 'medium',
    hideOnSinglePage: true
});
const envSaveModal = ref(false);
const envUpdateRecord = ref(null);
const envUpdateModal = ref(false);
const showEnvSaveModal = () => {
    envSaveModal.value.visible = true;
};
const showDeleteEnvConfirm = (record) => {
    Modal.confirm({
        title: record.name + ' 确定删除吗？',
        async onOk() {
            await deleteEnv(record.id);
            await getEnvsData();
            if (envDataSource.value.length === 0 && envPagination.value.current > 1) {
                envPagination.value.current--;
                await getEnvsData();
            }
        }
    })
};
const showUpdateEnvModal = (record) => {
    envUpdateModal.value.visible = true;
    envUpdateRecord.value = record;
};
const getEnvsData = async () => {
    await getEnvData(envPagination.value.current, envPagination.value.pageSize)
            .then((res) => {
                const { data, total } = res
                envDataSource.value = data || []
                envPagination.value.total = total || 0
            })
};
const envOnPaginationChange = ({current}) => {
    envPagination.value.current = current;
    getEnvsData()
};
const envRefresh = () => {
    getEnvsData();
    message.success('操作成功');
};


const imageDataSource = ref([]);
const imageColumns = ref([
    { title: '#', align: 'center', dataIndex: 'id', key: 'id', width: 60 },
    { title: '名称', align: 'center', dataIndex: 'name', key: 'name', width: 400},
    { title: '创建人', align: 'center', dataIndex: 'created_by', key: 'created_by', width: 120},
    { title: '更新人', align: 'center', dataIndex: 'updated_by', key: 'updated_by', width: 120 },
    { title: '创建时间', align: 'center', dataIndex: 'created_at', key: 'created_at', width: 150 },
    { title: '更新时间', align: 'center', dataIndex: 'updated_at', key: 'updated_at', width: 150},
    { title: '操作', align: 'center', key: 'action', fixed: 'right', width: 150 }
]);
const imagePagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    size: 'medium',
    hideOnSinglePage: true
});
const imageSaveModal = ref(false);
const imageUpdateModal = ref(false);
const imageUpdateRecord = ref(null);
const getImagesData = async () => {
    await getImageData(imagePagination.value.current, imagePagination.value.pageSize)
            .then((res) => {
                const { data, total } = res
                imageDataSource.value = data
                imagePagination.value.total = total
            })
};
const imageOnPaginationChange = async ({ current }) => {
    imagePagination.value.current = current;
    await getImagesData();
};
const imageRefresh = async () => {
    await getImagesData();
    message.success('操作成功');
};
const showSaveImageModal = () => {
    imageSaveModal.value.visible = true;
};
const showDeleteImageConfirm = (record) => {
    Modal.confirm({
        title: record.name + ' 确定删除吗？',
        async onOk() {
            await deleteImage(record.id);
            await getImagesData()
            if (imageDataSource.value.length === 0 && imagePagination.value.current > 1) {
                imagePagination.value.current--;
                await getImagesData();
            }
        }
    })
};
const showUpdateImageModal = (record) => {
    imageUpdateModal.value.visible = true;
    imageUpdateRecord.value = record;
};


const taskDataSource = ref([]);
const taskColumns = ref([
    { title: '#', align: 'center', dataIndex: 'id', key: 'id', width: 60 },
    { title: '名称', align: 'center', dataIndex: 'name', key: 'name', width: 200 },
    { title: '镜像ID', align: 'center', dataIndex: 'image_id', key: 'image_id', width: 100 },
    { title: '创建人', align: 'center', dataIndex: 'created_by', key: 'created_by', width: 120 },
    { title: '更新人', align: 'center', dataIndex: 'updated_by', key: 'updated_by', width: 120 },
    { title: '创建时间', align: 'center', dataIndex: 'created_at', key: 'created_at', width: 150 },
    { title: '更新时间', align: 'center', dataIndex: 'updated_at', key: 'updated_at', width: 150 },
    { title: '操作', align: 'center', key: 'action', fixed: 'right', width: 150 }
]);
const taskPagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    size: 'medium',
    hideOnSinglePage: true
});
const taskSaveModal = ref(false);
const taskUpdateRecord = ref(null);
const taskUpdateModal = ref(false);
const getTasksData = async () => {
    await getTaskData(taskPagination.value.current, taskPagination.value.pageSize)
            .then((res) => {
                const { data, total } = res
                taskDataSource.value = data
                taskPagination.value.total = total
            })
};
const taskOnPaginationChange = async ({ current }) => {
    taskPagination.value.current = current;
    await getTasksData();
};
const taskRefresh = async () => {
    await getTasksData();
    message.success('操作成功')
};
const showTaskSaveModal = () => {
    taskSaveModal.value.visible = true;
};
const showTaskDeleteModal = (record) => {
    Modal.confirm({
        title: record.name + ' 确定删除吗？',
        async onOk() {
            await deleteTask(record.id);
            await getTasksData();
            if (taskDataSource.value.length === 0 && taskPagination.value.current > 1) {
                taskPagination.value.current--;
                await getTasksData();
            }
        }
    })
};
const showTaskUpdateModal = (record) => {
    taskUpdateModal.value.visible = true;
    taskUpdateRecord.value = record;
};

</script>

<style scoped>
.table-header {
    display: flex;
    align-items: center;
    margin: 0 0 24px 0;
    gap: 15px;
}
</style>
