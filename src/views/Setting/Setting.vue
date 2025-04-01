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
                    <a-button type="primary" @click="showEnvSaveModal"><template #icon><PlusCircleOutlined /></template>添加</a-button>
                    <a-button type="primary" @click="envRefresh"><template #icon><ReloadOutlined /></template>刷新</a-button>
                </div>
                <a-table :data-source="envDataSource" :columns="envColumns" :scroll="{ x: 1500 }" :pagination="envPagination" @change="envOnPaginationChange" >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'action'">
                            <span>
                                <a @click="showUpdateModal(record)">编辑</a>
                                <a-divider type="vertical" />
                                <a @click="showDeleteConfirm(record)">删除</a>
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
                    <a-button type="primary"><template #icon><PlusCircleOutlined /></template>添加</a-button>
                    <a-button type="primary" @click="imageRefresh"><template #icon><ReloadOutlined /></template>刷新</a-button>
                </div>
                <a-table :data-source="imageDataSource" :columns="imageColumns" :scroll="{ x: 1500 }" :pagination="imagePagination" @change="imageOnPaginationChange" >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'action'">
                            <span>
                                <a>编辑</a>
                                <a-divider type="vertical" />
                                <a>删除</a>
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
                    <a-button type="primary"><template #icon><PlusCircleOutlined /></template>添加</a-button>
                    <a-button type="primary" @click="taskRefresh"><template #icon><ReloadOutlined /></template>刷新</a-button>
                </div>
                <a-table :data-source="taskDataSource" :columns="taskColumns" :scroll="{ x: 1500 }" :pagination="taskPagination" @change="taskOnPaginationChange" >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'action'">
                            <span>
                                <a>编辑</a>
                                <a-divider type="vertical" />
                                <a>删除</a>
                            </span>
                        </template>
                    </template>
                </a-table>
            </a-tab-pane>
        </a-tabs>
        <EnvSaveModal ref="envSaveModal" />
        <EnvUpdateModal ref="envUpdateModal" :env="envUpdateRecord" />
    </Layout>
</template>

<script setup>

import { ref } from "vue";
import {deleteEnv, getEnvData, getImageData, getTaskData} from "@/http/setting";
import Layout from "@/components/Layout.vue";
import EnvSaveModal from "@/views/Setting/components/EnvSaveModal.vue";
import {message, Modal} from "ant-design-vue";
import EnvUpdateModal from "@/views/Setting/components/EnvUpdateModal.vue";

const activeKey = ref('')
const envDataSource = ref([])
const envColumns = [
    { title: '#', align: 'center', dataIndex: 'id', key: 'id', width: 60 },
    { title: '环境名', align: 'center', dataIndex: 'name', key: 'name', width: 80 },
    { title: '创建人', align: 'center', dataIndex: 'created_by', key: 'created_by', width: 150 },
    { title: '更新人', align: 'center', dataIndex: 'updated_by', key: 'updated_by', width: 150 },
    { title: '创建时间', align: 'center', dataIndex: 'created_at', key: 'created_at', width: 200 },
    { title: '更新时间', align: 'center', dataIndex: 'updated_at', key: 'updated_at', width: 200 },
    { title: '操作', align: 'center', key: 'action', fixed: 'right', width: 150 }
]
const envPagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    size: 'medium',
    hideOnSinglePage: true
})

const imageDataSource = ref([])
const imageColumns = [
    { title: '#', align: 'center', dataIndex: 'id', key: 'id', width: 60 },
    { title: '名称', align: 'center', dataIndex: 'name', key: 'name', width: 400},
    { title: '创建人', align: 'center', dataIndex: 'created_by', key: 'created_by', width: 150},
    { title: '更新人', align: 'center', dataIndex: 'updated_by', key: 'updated_by', width: 150 },
    { title: '创建时间', align: 'center', dataIndex: 'created_at', key: 'created_at', width: 200 },
    { title: '更新时间', align: 'center', dataIndex: 'updated_at', key: 'updated_at', width: 200},
    { title: '操作', align: 'center', key: 'action', fixed: 'right', width: 150 }
]
const imagePagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    size: 'medium',
    hideOnSinglePage: true
})

const taskDataSource = ref([])
const taskColumns = [
    { title: '#', align: 'center', dataIndex: 'id', key: 'id', width: 60 },
    { title: '名称', align: 'center', dataIndex: 'name', key: 'name', width: 200 },
    { title: '镜像ID', align: 'center', dataIndex: 'image_id', key: 'image_id', width: 100 },
    { title: '创建人', align: 'center', dataIndex: 'created_by', key: 'created_by', width: 150 },
    { title: '更新人', align: 'center', dataIndex: 'updated_by', key: 'updated_by', width: 150 },
    { title: '创建时间', align: 'center', dataIndex: 'created_at', key: 'created_at', width: 200 },
    { title: '更新时间', align: 'center', dataIndex: 'updated_at', key: 'updated_at', width: 200 },
    { title: '操作', align: 'center', key: 'action', fixed: 'right', width: 150 }
]
const taskPagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    size: 'medium',
    hideOnSinglePage: true
})

const envSaveModal = ref(false);
const showEnvSaveModal = () => {
    envSaveModal.value.visible = true;
};
const showDeleteConfirm = (record) => {
    Modal.confirm({
        title: record.name + ' 环境确定删除吗？',
        onOk() {
            deleteEnv(record.id)
        }
    })
};
const envUpdateRecord = ref(null);
const envUpdateModal = ref(false);
const showUpdateModal = (record) => {
      envUpdateModal.value.visible = true;
      envUpdateRecord.value = record;
};


function tabsChange(activeKey) {
    switch (activeKey) {
        case '1':
            return getEnvsData();
        case '2':
            return getImagesData();
        case '3':
            return getTasksData();
    }
}

// onMounted(() => {
//     getEnvsData();
//     getImagesData();
//     getTasksData();
// })

function getEnvsData() {
    getEnvData(envPagination.value.current, envPagination.value.pageSize)
        .then((res) => {
            const {data, total} = res
            envDataSource.value = data || []
            envPagination.value.total = total || 0
        })
}
function envOnPaginationChange({current}) {
    envPagination.value.current = current
    getEnvsData()
}

function envRefresh() {
    envOnPaginationChange({current: envPagination.value.current, pageSize: 10})
    message.success('操作成功');
}

function getImagesData() {
    getImageData(imagePagination.value.current, imagePagination.value.pageSize)
        .then((res) => {
            const { data, total } = res
            imageDataSource.value = data
            imagePagination.value.total = total
        })
}
function imageOnPaginationChange({ current }) {
    imagePagination.value.current = current
    getImagesData()
}
function imageRefresh() {
    imageOnPaginationChange({current: imagePagination.value.current, pageSize: 10})
}

function getTasksData() {
    getTaskData(taskPagination.value.current, taskPagination.value.pageSize)
        .then((res) => {
            const { data, total } = res
            taskDataSource.value = data
            taskPagination.value.total = total
        })
}
function taskOnPaginationChange({ current }) {
    taskPagination.value.current = current
    getTasksData()
}
function taskRefresh() {
    taskOnPaginationChange({current: taskPagination.value.current, pageSize: 10})
}



</script>

<style scoped>
.table-header {
    display: flex;
    align-items: center;
    margin: 0 0 24px 0;
    gap: 15px;
}
</style>
