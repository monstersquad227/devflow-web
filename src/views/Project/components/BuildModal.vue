<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="构建项目" :bodyStyle="{ padding: '20px' }" @ok="handleOk" @cancel="handleCancel">
            <a-form :model="formState" layout="horizontal"  :wrapperCol="{ span: 24 }">
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="项目名" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                            <a-input v-model:value="formState.gitlab_name" disabled />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="环境" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                            <a-select v-model:value="formState.env" :options="envOptions" ></a-select>
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-form-item label="仓库地址">
                    <a-input v-model:value="formState.gitlab_repo" disabled />
                </a-form-item>

                <a-row>
                    <a-col :span="12">
                        <a-form-item label="分支" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                            <a-select v-model:value="formState.branch" :options="branchesOptions" @change="branchChange"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="作者" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                            <a-input v-model:value="formState.author" disabled />
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-form-item label="版本信息">
                    <a-input v-model:value="formState.message" disabled />
                </a-form-item>
                <a-form-item label="编译指令">
                    <a-input v-model:value="formState.command" />
                </a-form-item>
                <a-form-item label="项目路径">
                    <a-input v-model:value="formState.project_build_path" disabled />
                </a-form-item>
                <a-form-item label="项目包名">
                    <a-input v-model:value="formState.project_package_name" disabled />
                </a-form-item>
                <a-form-item label="备注信息">
                    <a-textarea v-model:value="formState.description" />
                </a-form-item>
            </a-form>
        </a-modal>
    </a-config-provider>
</template>

<script setup>
import {ref, defineProps, watchEffect} from "vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import {getEnvData} from "@/http/setting";
import {getProjectsBranches, getProjectsBranchesDetails} from "@/http/project";

// 从父组件传递过来的数据
const props = defineProps({
    project: Object,  // 接收 project 对象
});
const formState = ref({
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
});
const envOptions = ref([]);
const branchesOptions = ref([]);

// 控制 modal 显示的状态
const visible = ref(false);


watchEffect(() => {
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
        getEnvData(1, 100)
            .then((res) => {
                const { data } = res
                envOptions.value = data.map(item => ({
                    label: item.name,
                    value: item.id
                }))
            });
        getProjectsBranches(props.project.gitlab_id)
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
        formState.value.description = props.project.description;
    }
});

const handleOk = () => {
    console.log("提交的构建数据：", props.project);
    visible.value = false;
};

const handleCancel = () => {
    visible.value = false;
};

function branchChange() {
    getProjectsBranchesDetails(props.project.gitlab_id, formState.value.branch)
        .then((res) => {
            formState.value.author = res.commit["author_name"];
            formState.value.message = res.commit.message;
        })
    console.log(formState.value.branch)
}

defineExpose({
    visible,
});
</script>
