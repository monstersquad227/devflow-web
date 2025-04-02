<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="更新项目" :bodyStyle="{ padding: '20px' }" @ok="handleOk" >
            <a-form :model="formState" layout="horizontal" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="项目名" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" >
                            <a-input v-model:value="formState.gitlab_name" disabled />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="应用名" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" >
                            <a-input v-model:value="formState.deployment_name" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="GitLabID" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" >
                            <a-input v-model:value="formState.gitlab_id" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="任务ID" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" >
                            <a-input v-model:value="formState.task_id" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="仓库地址">
                    <a-input v-model:value="formState.gitlab_repo" />
                </a-form-item>
                <a-form-item label="项目路径">
                    <a-input v-model:value="formState.project_build_path" />
                </a-form-item>
                <a-form-item label="项目包名">
                    <a-input v-model:value="formState.project_package_name" />
                </a-form-item>
                <a-form-item label="备注信息">
                    <a-textarea v-model:value="formState.description" :auto-size="{ minRows: 3, maxRows: 5 }" />
                </a-form-item>
            </a-form>
        </a-modal>
    </a-config-provider>
</template>

<script setup>

import zhCN from "ant-design-vue/es/locale/zh_CN";
import {ref, watchEffect} from "vue";

const visible = ref(false);
const props = defineProps({
    project: Object,
})
const formState = ref({
    id: null,
    gitlab_id: null,
    task_id: null,
    gitlab_name: '',
    deployment_name: '',
    gitlab_repo: '',
    project_build_path: '',
    project_package_name: '',
    description: ''
})
const handleOk = () => {
    console.log(formState.value);
    visible.value = false;
};

watchEffect(() => {
    if (props.project && visible.value === true) {
        formState.value.id = props.project.id;
        formState.value.gitlab_id = props.project.gitlab_id;
        formState.value.task_id = props.project.task_id;
        formState.value.gitlab_name = props.project.gitlab_name;
        formState.value.deployment_name = props.project.deployment_name;
        formState.value.gitlab_repo = props.project.gitlab_repo;
        formState.value.project_build_path = props.project.project_build_path;
        formState.value.project_package_name = props.project.project_package_name;
        formState.value.description = props.project.description;
    }
})

defineExpose({
    visible,
})
</script>

<style scoped>

</style>