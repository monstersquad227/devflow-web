<template>
    <Layout>
<!--        <div class="header">-->
<!--            <a-button @click="addProject">添加项目</a-button>-->
<!--            <a-input-search></a-input-search>-->
<!--            <a-button>刷新</a-button>-->
<!--        </div>-->

        <a-table
            :dataSource="dataSource"
            :columns="columns"
            :pagination="pagination"
            @change="onPaginationChange"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'build'">
                    <a-button type="link">build</a-button>
                </template>
                <template v-if="column.key === 'deploy'">
                    <a-button type="link">deploy</a-button>
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
    </Layout>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {getProjects} from "@/http/project";
import Layout from "@/components/Layout.vue";

// 响应式数据
const dataSource = ref([]);

const columns = [
    { title: "", align: "center", dataIndex: "id", key: "id" },
    { title: "项目名", align: "center", dataIndex: "gitlab_name", key: "gitlab_name" },
    { title: "应用名", align: "center", dataIndex: "deployment_name", key: "deployment_name" },
    { title: "构建模版ID", align: "center", dataIndex: "build_template_id", key: "build_template_id" },
    { title: "构建", align: "center", key: "build" },
    { title: "发布", align: "center", key: "deploy" },
    { title: "操作", align: "center", key: "action" },
];
const pagination= ref({
    current: 1,
    pageSize: 1,
    total: 2
})

onMounted(() => {
    getProject()
})
function getProject() {
    getProjects(pagination.value.current, pagination.value.pageSize)
        .then((res) => {
            dataSource.value = res
        })
}

function onPaginationChange({ current, pageSize }) {

    pagination.value.current = current

    getProject()
    // 获取当前页码
    console.log("当前页码:", current);
    console.log("每页条数:", pageSize);
};
</script>
