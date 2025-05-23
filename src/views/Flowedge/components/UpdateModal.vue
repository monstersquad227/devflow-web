<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="更新Flowedge" :bodyStyle="{ padding: '20px' }" @ok="handleOk" >
            <a-form :model="formState" layout="horizontal" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-form-item label="关联服务">
                    <a-select v-model:value="formState.application" :options="applicationOptions" />
                </a-form-item>
            </a-form>
        </a-modal>
    </a-config-provider>
</template>

<script setup>

import zhCN from "ant-design-vue/es/locale/zh_CN";
import {ref, watchEffect} from "vue";
import {getProjectsApplications} from "@/http/project";

const visible = ref(false);
const formState = ref({
    application: ''
});
const applicationOptions = ref([]);

const handleOk = () => {
    visible.value = false;
};

watchEffect(() => {
    if (visible.value === true) {
        getProjectsApplications().then(res => {
            applicationOptions.value = res.map(item => ({
                label: item.deployment_name,
                value: item.deployment_name
            }));
        })
    }
});
defineExpose({
    visible,
});
</script>

<style scoped>

</style>