<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="添加项目" :bodyStyle="{ padding: '20px' }" @ok="handleOk" @cancel="handleCancel">
            <a-form :model="formState" layout="horizontal" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-form-item label="项目名">
                    <a-input v-model:value="formState.gitlab_name" placeholder="请输入项目名" />
                </a-form-item>
                <a-form-item label="应用名">
                    <a-input v-model:value="formState.deployment_name" placeholder="请输入应用名" />
                </a-form-item>
                <a-form-item label="任务模版">
                    <a-select v-model:value="formState.build_template_id" :options="templateOptions" placeholder="请选择任务模版" />
                </a-form-item>
                <a-form-item label="项目路径">
                    <a-input v-model:value="formState.project_build_path" placeholder="请输入项目构建路径" />
                </a-form-item>
                <a-form-item label="项目包名">
                    <a-input v-model:value="formState.project_package_name" placeholder="请输入项目包名" />
                </a-form-item>
                <a-form-item label="备注信息">
                    <a-textarea v-model:value="formState.description" placeholder="请输入项目信息"></a-textarea>
                </a-form-item>
            </a-form>
        </a-modal>
    </a-config-provider>
</template>

<script setup>
import {ref, watchEffect} from "vue";
import { getTaskData } from "@/http/setting"
import { saveProjects, getProjects } from "@/http/project"
import zhCN from "ant-design-vue/es/locale/zh_CN";

const visible = ref(false);
const formState = ref({
    gitlab_name: "",
    deployment_name: "",
    build_template_id: null, // 绑定任务模版
    project_build_path: "",
    project_package_name: "",
    description: "",
});
const templateOptions = ref([]);
const handleOk = () => {
    console.log("提交的表单数据：", formState.value);
    saveProjects(formState.value)
    visible.value = false;
};
const handleCancel = () => {
    visible.value = false;
};

watchEffect(()=> {
    if (visible.value === true) {
        getTemplateData();
    }
});

function getTemplateData() {
    getTaskData(1, 100)
        .then((res) => {
            const { data } = res
            templateOptions.value = data.map(item => ({
                label: item.name,
                value: item.id,
            }))
        })
}

defineExpose({
    visible,
});
</script>
