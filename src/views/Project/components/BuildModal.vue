<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="构建项目" :bodyStyle="{ padding: '20px' }" @ok="handleOk" okText="构建" >
            <a-form ref="formRef" :model="formState" layout="vertical" >
                <a-form-item label="项目名">
                    <a-input v-model:value="formState.gitlab_name" disabled />
                </a-form-item>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="环境" name="env" :rules="[{ required: true, message: '请选择环境' }]" >
                            <a-select v-model:value="formState.env" :options="envOptions" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="分支" name="branch" :rules="[{ required: true, message: '请选择分支' }]" >
                            <a-select v-model:value="formState.branch" :options="branchesOptions" @change="branchChange" />
                        </a-form-item>
                    </a-col>
                </a-row>

<!--                <a-form-item label="仓库地址">-->
<!--                    <a-input v-model:value="formState.gitlab_repo" disabled />-->
<!--                </a-form-item>-->

                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="作者">
                            <a-input v-model:value="formState.author" disabled />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="提交ID">
                            <a-input v-model:value="formState.short_id" disabled />
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-form-item label="版本信息">
                    <a-input v-model:value="formState.message" disabled />
                </a-form-item>
                <a-form-item label="编译指令" name="command" :rules="[{ required: true, message: '请选输入编译指令' }]">
                    <a-textarea :rows="3" v-model:value="formState.command" placeholder="例如: npm install && npm run fat 或 mvn clean package -Pprod -U" />
                </a-form-item>
<!--                <a-form-item label="项目路径">-->
<!--                    <a-input v-model:value="formState.project_build_path" disabled />-->
<!--                </a-form-item>-->
<!--                <a-form-item label="项目包名">-->
<!--                    <a-input v-model:value="formState.project_package_name" disabled />-->
<!--                </a-form-item>-->
                <a-form-item label="备注信息">
                    <a-textarea v-model:value="formState.description" />
                </a-form-item>
            </a-form>
        </a-modal>
    </a-config-provider>
</template>

<script setup>
import {ref, defineProps, watchEffect, nextTick} from "vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { getEnvData } from "@/http/setting";
import { buildProjects, getProjectsBranches, getProjectsBranchesDetails } from "@/http/project";

const props = defineProps({
    project: Object,  // 接收 project 对象
});
const formState = ref({
    id: '',
    gitlab_name: '',
    deployment_name: '',
    env: '',
    gitlab_repo: '',
    task_id: '',
    branch: '',
    author: '',
    short_id: '',
    message: '',
    command: '',
    project_build_path: '',
    project_package_name: '',
    description: ''
});
const envOptions = ref([]);
const branchesOptions = ref([]);
const visible = ref(false);
const formRef = ref();
const handleOk = async () => {
    try {
        await formRef.value.validate();

        const data = {
            gitlab_name: formState.value.gitlab_name,
            deployment_name: formState.value.deployment_name,
            task_id: formState.value.task_id.toString(),
            branch: formState.value.branch,
            gitlab_repo: formState.value.gitlab_repo,
            environment_unique: envOptions.value.find(item => item["value"] === formState.value.env)["label"],
            harbor_url: "harbor.chengdd.cc",
            short_id: formState.value.short_id,
            project_build_path: formState.value.project_build_path,
            project_package_name: formState.value.project_package_name,
            command: formState.value.command
        }
        await buildProjects(data, formState.value.id);
        visible.value = false;
    } catch (error) {
        console.log('验证或构建失败:', error);
    }
};
const branchChange = () => {
    getProjectsBranchesDetails(props.project.gitlab_id, formState.value.branch)
        .then((res) => {
            formState.value.author = res.commit["author_name"];
            formState.value.message = res.commit.message;
            formState.value.short_id = res.commit.short_id;
        })
};

watchEffect(async () => {
    if (visible.value === true) {

        formState.value = {
            gitlab_name: '',
            deployment_name: '',
            env: '',
            gitlab_repo: '',
            branch: '',
            author: '',
            message: '',
            command: '',
            project_build_path: '',
            project_package_name: '',
            description: ''
        };
        envOptions.value = [];
        branchesOptions.value = [];

        // 清除之前的验证错误
        await nextTick(() => {
            formRef.value?.clearValidate();
        });


        await getEnvData(1, 100)
            .then((res) => {
                const { data } = res
                envOptions.value = data.map(item => ({
                    label: item.name,
                    value: item.id
                }))
            });
        await getProjectsBranches(props.project.gitlab_id)
            .then((res) => {
                const {branches} = res
                branchesOptions.value = branches.map(item => ({
                    label: item.name,
                    value: item.name
                }))
            });
    }
    if (props.project) {
        formState.value.gitlab_name = props.project.gitlab_name;
        formState.value.deployment_name = props.project.deployment_name;
        formState.value.gitlab_repo = props.project.gitlab_repo;
        formState.value.project_build_path = props.project.project_build_path;
        formState.value.project_package_name = props.project.project_package_name;
        formState.value.description = props.project.description;
        formState.value.task_id = props.project.task_id;
        formState.value.id = props.project.id;
    }
});

defineExpose({
    visible,
});
</script>
